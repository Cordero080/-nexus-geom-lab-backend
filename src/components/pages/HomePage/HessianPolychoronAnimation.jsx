import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { createHessianPolychoron } from '../../../features/sceneControls/geometries/polytopes/hessianPolychoron';

export default function HessianPolychoronAnimation({ isActive = false }) {
  const containerRef = useRef();
  const sceneRef = useRef();
  const rendererRef = useRef();
  const meshRef = useRef();
  const frameIdRef = useRef();

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      1000,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      10
    );
    camera.position.z =3;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true 
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setClearColor(0x0000, 0);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create Hessian Polychoron geometry
    const geometry = createHessianPolychoron();
    
    // Create edges geometry for wireframe
    const edges = new THREE.EdgesGeometry(geometry);
    const material = new THREE.LineBasicMaterial({ 
      color: 0x00ff3a,
      transparent: true,
      opacity: .9
    });
    const mesh = new THREE.LineSegments(edges, material);
    scene.add(mesh);
    meshRef.current = mesh;

    // Animation loop
    function animate() {
      frameIdRef.current = requestAnimationFrame(animate);
      
      if (meshRef.current) {
        // Slow, complex rotation for the multi-layered structure
        meshRef.current.rotation.x += 0.0001;
        meshRef.current.rotation.y += 0.0009;
        meshRef.current.rotation.z += 0.003;
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
      renderer.dispose();
    };
  }, []);

  // Update opacity based on active state
  useEffect(() => {
    if (meshRef.current && meshRef.current.material) {
      meshRef.current.material.opacity = isActive ? 0.2 : 0.1;
    }
  }, [isActive]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '-5%',
        left: 0,
        zIndex: 1,
        pointerEvents: 'none',
      }}
    />
  );
}
