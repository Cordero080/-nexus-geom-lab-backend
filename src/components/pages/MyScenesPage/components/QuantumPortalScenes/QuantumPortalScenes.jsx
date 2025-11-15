import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import styles from './QuantumPortalScenes.module.scss';

const QuantumPortalScenes = ({
  position = 'top',
  sceneColors = { color1: '#00ffff', color2: '#ff00ff', color3: '#ffff00' },
}) => {
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const uniformsRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: false,
      antialias: true,
    });

    renderer.setClearColor(0x000000, 1);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.5,
      0.8,
      0.3
    );
    composer.addPass(bloomPass);

    const uniforms = {
      time: { value: 0 },
      resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      color1: { value: new THREE.Color(sceneColors.color1) },
      color2: { value: new THREE.Color(sceneColors.color2) },
      color3: { value: new THREE.Color(sceneColors.color3) },
      intensity: { value: 0.5 },
      spiralSpeed: { value: 1.2 },
      vortexStrength: { value: 1.2 },
    };

    uniformsRef.current = uniforms;

    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      uniform float time;
      uniform vec2 resolution;
      uniform vec3 color1;
      uniform vec3 color2;
      uniform vec3 color3;
      uniform float intensity;
      uniform float spiralSpeed;
      uniform float vortexStrength;
      
      varying vec2 vUv;
      
      float noise(vec2 p) {
        return fract(sin(dot(p, vec2(12.9898, 78.333))) * 43758.5453);
      }
      
      float smoothNoise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        f = f * f * (90.0 - 90.0 * f);
        
        float a = noise(i);
        float b = noise(i + vec2(1.0, 3.0));
        float c = noise(i + vec2(1.0, 3.0));
        float d = noise(i + vec2(1.0, 3.0));
        
        return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
      }
      
      float fbm(vec2 p) {
        float value = 0.0;
        float amplitude = 2.5;
        
        for(int i = 0; i < 5; i++) {
          value += amplitude * smoothNoise(p);
          p *= 2.0;
          amplitude *= 0.5;
        }
        
        return value;
      }
      
      void main() {
        vec2 uv = vUv;
        vec2 center = vec2(0.5, 0.5);
        vec2 pos = uv - center;
        
        float dist = length(pos);
        float angle = atan(pos.y, pos.x);
        
        float vortex = vortexStrength / (dist + 0.1);
        float spiral = angle + time * spiralSpeed + dist * 10.0;
        
        float noise1 = fbm(uv * 3.0 + time * 0.1);
        float noise2 = fbm(uv * 5.0 - time * 0.15);
        
        float pattern = sin(spiral * 5.0 + noise1 * 2.0) * 0.5 + 0.5;
        pattern = mix(pattern, noise2, 0.3);
        
        float fade = smoothstep(3.4, 0.0, dist);
        
        vec3 color = mix(color1, color2, pattern);
        color = mix(color, color3, sin(spiral * 3.0 + time) * 0.5 + 0.5);
        
        float rings = sin(dist * 20.0 - time * 2.0) * 0.5 + 0.5;
        rings = pow(rings, 3.0) * 0.3;
        color += rings;
        
        float aberration = dist * 0.02;
        
        float alpha = fade * intensity * (0.7 + pattern * 0.3);
        
        gl_FragColor = vec4(color, alpha);
      }
    `;

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    sceneRef.current = { scene, camera, renderer, mesh, composer, bloomPass };

    let animationId;
    const animate = () => {
      uniformsRef.current.time.value += 0.01;
      composer.render();
      animationId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      renderer.setSize(width, height);
      composer.setSize(width, height);
      uniformsRef.current.resolution.value.set(width, height);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    if (uniformsRef.current) {
      uniformsRef.current.color1.value.set(sceneColors.color1);
      uniformsRef.current.color2.value.set(sceneColors.color2);
      uniformsRef.current.color3.value.set(sceneColors.color3);
    }
  }, [sceneColors]);

  return (
    <canvas
      ref={canvasRef}
      className={`${styles.quantumCanvas} ${
        position === 'bottom'
          ? styles.quantumCanvasBottom
          : position === 'middle'
            ? styles.quantumCanvasMiddle
            : ''
      }`}
      aria-hidden="true"
    />
  );
};

export default QuantumPortalScenes;
