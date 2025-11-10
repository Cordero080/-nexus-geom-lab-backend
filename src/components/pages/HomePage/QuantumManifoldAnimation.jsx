import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { createQuantumManifold } from '../../../features/sceneControls/geometries/manifolds/quantumManifold';

export default function QuantumManifoldAnimation({ isActive = false }) {
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

    // Create Quantum Manifold geometry
    const geometry = createQuantumManifold();
    
    // Create edges geometry for wireframe
    const edges = new THREE.EdgesGeometry(geometry);
    const material = new THREE.LineBasicMaterial({ 
      color: 0xaa00ff,
      transparent: true,
      opacity: 0.65
    });
    const mesh = new THREE.LineSegments(edges, material);
    scene.add(mesh);
    meshRef.current = mesh;

    // Animation loop
    function animate() {
      frameIdRef.current = requestAnimationFrame(animate);
      
      if (meshRef.current) {
        // Smooth, flowing rotation for the manifold
        meshRef.current.rotation.x += 0.003;
        meshRef.current.rotation.y += 0.005;
        meshRef.current.rotation.z += 0.002;
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
      meshRef.current.material.opacity = isActive ? 0.1 : 0.1;
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
