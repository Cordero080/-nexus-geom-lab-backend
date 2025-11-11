import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { createQuantumManifold } from '../../../features/sceneControls/geometries/manifolds/quantumManifold';

export default function QuantumManifoldAnimation({ isActive = false }) {
  const containerRef = useRef();
  const sceneRef = useRef();
  const rendererRef = useRef();
  const meshRef = useRef();
  const innerMeshRef = useRef();
  const frameIdRef = useRef();
  const timeRef = useRef(0);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      55,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 3.3;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true 
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create outer Quantum Manifold geometry with color gradient shader
    const geometry = createQuantumManifold();
    
    // Create edges geometry for wireframe
    const edges = new THREE.EdgesGeometry(geometry);
    
    // Animated gradient material using ShaderMaterial
    const material = new THREE.ShaderMaterial({
      transparent: true,
      opacity: 0.65,
      uniforms: {
        time: { value: 0 },
        color1: { value: new THREE.Color(0xaa00ff) }, // Purple
        color2: { value: new THREE.Color(0x00ffff) }, // Cyan
        color3: { value: new THREE.Color(0xff00aa) }, // Pink-purple
        opacity: { value: 0.65 }
      },
      vertexShader: `
        varying vec3 vPosition;
        void main() {
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 color1;
        uniform vec3 color2;
        uniform vec3 color3;
        uniform float opacity;
        varying vec3 vPosition;
        
        void main() {
          // Create flowing color based on position and time
          float wave = sin(vPosition.x * 2.0 + time) * 0.5 + 0.5;
          
          // Occasionally shift to third color (every ~10 seconds)
          float colorShift = sin(time * 0.15) * 0.5 + 0.5;
          vec3 baseColor = mix(color1, color2, wave);
          vec3 color = mix(baseColor, color3, colorShift * 0.3);
          
          gl_FragColor = vec4(color, opacity);
        }
      `
    });
    
    const mesh = new THREE.LineSegments(edges, material);
    scene.add(mesh);
    meshRef.current = mesh;
    
    // Create inner manifold (counter-rotating, smaller, different color)
    const innerGeometry = createQuantumManifold({ scale: 0.35 });
    const innerEdges = new THREE.EdgesGeometry(innerGeometry);
    
    // Animated color-shifting material for inner manifold
    const innerMaterial = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        time: { value: 0 },
        color1: { value: new THREE.Color(0xff66ff) }, // Bright magenta
        color2: { value: new THREE.Color(0xdd88ff) }, // Light purple
        color3: { value: new THREE.Color(0xffaaff) }, // Pale purple-pink
        color4: { value: new THREE.Color(0x66ffff) }, // Bright turquoise
        opacity: { value: 0.25 }
      },
      vertexShader: `
        void main() {
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 color1;
        uniform vec3 color2;
        uniform vec3 color3;
        uniform vec3 color4;
        uniform float opacity;
        
        void main() {
          // Cycle through 4 colors: magenta → purple → pale pink → turquoise
          float phase = mod(time * 0.25, 4.0);
          vec3 color;
          
          if (phase < 1.0) {
            color = mix(color1, color2, phase);
          } else if (phase < 2.0) {
            color = mix(color2, color3, phase - 1.0);
          } else if (phase < 3.0) {
            color = mix(color3, color4, phase - 2.0);
          } else {
            color = mix(color4, color1, phase - 3.0);
          }
          
          gl_FragColor = vec4(color, opacity);
        }
      `
    });
    
    const innerMesh = new THREE.LineSegments(innerEdges, innerMaterial);
    scene.add(innerMesh);
    innerMeshRef.current = innerMesh;

    // Animation loop
    function animate() {
      frameIdRef.current = requestAnimationFrame(animate);
      
      timeRef.current += 0.016; // ~60fps
      
      if (meshRef.current) {
        // Outer manifold: smooth, flowing rotation
        meshRef.current.rotation.x += 0.003;
        meshRef.current.rotation.y += 0.005;
        meshRef.current.rotation.z += 0.002;
        
        // Update shader time uniform for color flow
        if (meshRef.current.material.uniforms) {
          meshRef.current.material.uniforms.time.value = timeRef.current;
        }
        
        // Add subtle breathing/pulsing scale
        const breathe = 1 + Math.sin(timeRef.current * 0.5) * 0.05;
        meshRef.current.scale.setScalar(breathe);
      }
      
      if (innerMeshRef.current) {
        // Inner manifold: counter-rotate on different axes
        innerMeshRef.current.rotation.x -= 0.004;
        innerMeshRef.current.rotation.y -= 0.006;
        innerMeshRef.current.rotation.z += 0.003;
        
        // Independent breathing for inner layer
        const innerBreathe = 1 + Math.sin(timeRef.current * 0.7 + Math.PI) * 0.08;
        innerMeshRef.current.scale.setScalar(innerBreathe);
        
        // Update inner shader time for color cycling
        if (innerMeshRef.current.material.uniforms) {
          innerMeshRef.current.material.uniforms.time.value = timeRef.current;
        }
      }
      
      renderer.render(scene, camera);
    }
    animate();

    // Cleanup
    return () => {
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      geometry.dispose();
      edges.dispose();
      material.dispose();
      if (innerMeshRef.current) {
        innerMeshRef.current.geometry.dispose();
        innerMeshRef.current.material.dispose();
      }
      renderer.dispose();
    };
  }, []);

  // Update opacity based on active state
  useEffect(() => {
    if (meshRef.current && meshRef.current.material && meshRef.current.material.uniforms) {
      meshRef.current.material.uniforms.opacity.value = isActive ? 0.1 : 0.1;
    }
    if (innerMeshRef.current && innerMeshRef.current.material && innerMeshRef.current.material.uniforms) {
      innerMeshRef.current.material.uniforms.opacity.value = isActive ? 0.25 : 0.25;
    }
  }, [isActive]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: -80,
        left: 0,
        zIndex: 1,
        pointerEvents: 'none',
      }}
    />
  );
}
