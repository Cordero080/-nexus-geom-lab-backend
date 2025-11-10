import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { createIcosahedron } from '../../../features/sceneControls/geometries/polytopes/icosahedron';

export default function CompoundIcosahedronAnimation({ progress = 0 }) {
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
      30,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true 
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create compound icosahedron geometry
    const geometry = createIcosahedron();
    
    // Create edges geometry for wireframe
    const edges = new THREE.EdgesGeometry(geometry);
    const material = new THREE.LineBasicMaterial({ 
      color: 0x00fff7,
      transparent: true,
      opacity: 0.8
    });
    const mesh = new THREE.LineSegments(edges, material);
    scene.add(mesh);
    meshRef.current = mesh;

    // Animation loop
    function animate() {
      frameIdRef.current = requestAnimationFrame(animate);
      
      if (meshRef.current) {
        // Slow rotation
        meshRef.current.rotation.x += 0.003;
        meshRef.current.rotation.y += 0.005;
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

  // Update opacity based on progress
  useEffect(() => {
    if (meshRef.current && meshRef.current.material) {
      meshRef.current.material.opacity = 0.3 + progress * 0.5;
    }
  }, [progress]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '200px',
        height: '200px',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 2,
        pointerEvents: 'none',
      }}
    />
  );
}
