import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import './ThreeScene.css';
import { initializeScene } from './sceneSetup';
import { initializeLighting } from './lightingSetup';
import { createGeometryByType } from './geometryCreation';
import { startAnimationLoop } from './animationLoop';
import { __UP, __Q, __TMP, __A, __B, __M, __Inv, nearestVertexIndex, updateThickWireframeCylinders } from '../../utils/geometryHelpers';
import { DEFAULT_COLOR } from '../../utils/threeConstants';

// ========================================================================
// THREESCENE.JSX - THE 3D RENDERER (RECEIVES PROPS FROM APP.JSX)
// ========================================================================
// This component ONLY receives data - it doesn't manage any state itself.
// All the values come from App.jsx as props, and when App.jsx changes them,
// this component automatically re-renders the 3D scene with new values.

function ThreeScene({ 
  // MATERIAL PROPS - How the 3D objects should look
  scale = 1,                 // Current scale value → will update Three.js object scale
  metalness = 0.5,          // Current metalness value → will update Three.js material.metalness
  specularColor = "#ffffff",       // Current specular color → will update Three.js material.specular
  emissiveIntensity = 0,   // Current emissive intensity → will update Three.js material.emissiveIntensity
  baseColor = "#4287f5",           // Current base color → will update Three.js material.color
  wireframeIntensity = 30,  // Current wireframe intensity → will update Three.js material.wireframe
  
  // INTRICATE WIREFRAME PROPS - How the intricate wireframe should look
  intricateWireframeSpiralColor = "#5900ff",  // Current spiral color → will update intricate wireframe spiral lines
  intricateWireframeEdgeColor = "#00ff00",    // Current edge color → will update intricate wireframe edge connections
  
  // SCENE BEHAVIOR PROPS - How the scene should behave
  cameraView = "free",          // Current camera view → will position/animate camera
  environment = "default",         // Current environment → will change background/lighting
  objectCount = 1,         // Current object count → will create this many objects
  animationStyle = "rotate",      // Current animation → will control how objects move
  objectType = "icosahedron",          // Current object type → will determine which 3D shape to show
  
  // LIGHTING PROPS - How the scene should be lit
  ambientLightColor = "#ffffff",       // Current ambient light color → will update ambient light
  ambientLightIntensity = 0.5,   // Current ambient light intensity → will update ambient light
  directionalLightColor = "#ffffff",   // Current directional light color → will update directional light
  directionalLightIntensity = 1, // Current directional light intensity → will update directional light
  directionalLightX = 0,       // Current light X position → will position directional light
  directionalLightY = 10,       // Current light Y position → will position directional light
  directionalLightZ = 10        // Current light Z position → will position directional light
}) {
  // ========================================
  // REFS - STORING THREE.JS OBJECTS
  // ========================================
  // useRef lets us store Three.js objects that persist between re-renders
  // These are NOT React state - they're just containers for Three.js objects
  
  const mountRef = useRef(null);              // Where to attach the 3D canvas to the DOM
  const sceneRef = useRef(null);              // The Three.js scene object
  const materialRef = useRef(null);           // Reference to main material for debugging
  const cameraRef = useRef(null);             // The Three.js camera object
  const rendererRef = useRef(null);           // The Three.js renderer object
  const objectsRef = useRef([]);              // Array of all 3D objects in the scene
  const animationIdRef = useRef(null);        // ID for the animation loop (so we can cancel it)
  const ambientLightRef = useRef(null);       // Reference to ambient light (so we can update it)
  const directionalLightRef = useRef(null);   // Reference to directional light (so we can update it)

  // =============================================
  // INITIAL SETUP - RUNS ONCE WHEN COMPONENT MOUNTS
  // =============================================
  useEffect(() => {
    // 1. CREATE SCENE - The 3D world container
    const { scene, camera, renderer } = initializeScene();
    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);

    // 2. CREATE LIGHTS - Using current prop values
    const { ambientLight, directionalLight } = initializeLighting({
      ambientLightColor, 
      ambientLightIntensity, 
      directionalLightColor, 
      directionalLightIntensity, 
      directionalLightPosition: { x: directionalLightX, y: directionalLightY, z: directionalLightZ },
    });
    
    // Store lights in refs so we can update them later when props change
    ambientLightRef.current = ambientLight;
    directionalLightRef.current = directionalLight;
    
    // Add lights to the scene
    scene.add(ambientLight);
    scene.add(directionalLight);

    // 3. START ANIMATION LOOP - Continuously render the scene
    startAnimationLoop(renderer, scene, camera, animationIdRef);

    // 4. HANDLE WINDOW RESIZE - Keep canvas matching screen size
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // 5. CLEANUP FUNCTION - Runs when component unmounts
    // Important: Clean up Three.js objects to prevent memory leaks
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []); // Empty dependency array = run once on mount

  // ===============================================
  // ENVIRONMENT UPDATER
  // ===============================================
  useEffect(() => {
    if (!sceneRef.current) return;
    sceneRef.current.background = null; // Set transparent background
  }, [environment]);

  // ===============================================
  // SCALE UPDATER
  // ===============================================
  useEffect(() => {
    objectsRef.current.forEach(({ solidMesh, wireframeMesh, centerLines, curvedLines, mesh }) => {
      // Handle dual-mesh objects
      if (solidMesh) {
        solidMesh.scale.setScalar(scale);
      }
      if (wireframeMesh) {
        wireframeMesh.scale.setScalar(scale);
      }
      // Handle intricate wireframe elements
      if (centerLines) {
        centerLines.scale.setScalar(scale);
      }
      if (curvedLines) {
        curvedLines.scale.setScalar(scale);
      }
      // Handle legacy single mesh objects
      if (mesh) {
        mesh.scale.setScalar(scale);
      }
    });
  }, [scale]);

  // ===============================================
  // LIGHTING UPDATER
  // ===============================================
  useEffect(() => {
    if (!ambientLightRef.current) return;
    
    const ambientLightColorHex = parseInt(ambientLightColor.replace('#', ''), 16);
    ambientLightRef.current.color.setHex(ambientLightColorHex);
    ambientLightRef.current.intensity = ambientLightIntensity;
  }, [ambientLightColor, ambientLightIntensity]);
  
  useEffect(() => {
    if (!directionalLightRef.current) return;
    
    const directionalLightColorHex = parseInt(directionalLightColor.replace('#', ''), 16);
    directionalLightRef.current.color.setHex(directionalLightColorHex);
    directionalLightRef.current.intensity = directionalLightIntensity;
    directionalLightRef.current.position.set(directionalLightX, directionalLightY, directionalLightZ);
  }, [directionalLightColor, directionalLightIntensity, directionalLightX, directionalLightY, directionalLightZ]);

  // ===============================================
  // CAMERA CONTROLLER
  // ===============================================
  useEffect(() => {
    if (!cameraRef.current) return; // Safety check

    const camera = cameraRef.current;

    // POSITION CAMERA based on cameraView prop
    switch(cameraView) {
      case 'free':
        camera.position.set(0, 0, 6);     // Standard front view
        break;
      case 'orbit':
        camera.position.set(0, 3, 6);     // Elevated view for orbiting
        camera.lookAt(0, 0, 0);           // Look at center
        break;
      case 'top':
        camera.position.set(0, 10, 0);    // Directly above
        camera.lookAt(0, 0, 0);           // Look down at center
        break;
      case 'side':
        camera.position.set(10, 0, 0);    // Far to the right side
        camera.lookAt(0, 0, 0);           // Look at center
        break;
      case 'cinematic':
        camera.position.set(-3, 2, 5);    // Dramatic angle
        camera.lookAt(0, 0, 0);           // Look at center
        break;
      default:
        camera.position.set(0, 0, 6);     // Default position
    }
  }, [cameraView]);

  // ===============================================
  // OBJECTS CREATOR
  // ===============================================
  useEffect(() => {
    if (!sceneRef.current) return; // Safety check

    const scene = sceneRef.current;
    
    // REMOVE OLD OBJECTS from scene and clear our reference array
    objectsRef.current.forEach(obj => {
      // Remove solid and wireframe meshes
      if (obj.solidMesh) scene.remove(obj.solidMesh);
      if (obj.wireframeMesh) scene.remove(obj.wireframeMesh);
      // Remove intricate wireframe elements
      if (obj.centerLines) scene.remove(obj.centerLines);
      if (obj.curvedLines) scene.remove(obj.curvedLines);
      // Also handle legacy single mesh objects
      if (obj.mesh) scene.remove(obj.mesh);
    });
    objectsRef.current = [];

    // CREATE NEW OBJECTS USING CURRENT PROP VALUES
    for (let i = 0; i < objectCount; i++) {
      
      // CHOOSE GEOMETRY based on objectType prop
      let geometry;
      if (objectCount === 1) {
        // Single object: use the selected objectType
        geometry = createGeometryByType(objectType);
      } else {
        // Multiple objects: cycle through different types for variety
        const geometryTypes = [
          'icosahedron',
          'sphere',
          'box',
          'octahedron',
          'tetrahedron',
          'torusknot'
        ];
        geometry = createGeometryByType(geometryTypes[i % geometryTypes.length]);
      }
      
      // Store original vertex positions for advanced animations
      const originalPositions = geometry.attributes.position.array.slice();
      
      // CREATE SOLID MATERIAL using current prop values
      const currentBaseColor = new THREE.Color(baseColor);
      const currentSpecularColor = new THREE.Color(specularColor);
      
      // Calculate emissive color based on base color and intensity
      const emissiveColor = new THREE.Color(baseColor).multiplyScalar(emissiveIntensity);
      
      const material = new THREE.MeshPhongMaterial({
        color: currentBaseColor,
        specular: currentSpecularColor,
        shininess: metalness * 100, // Map metalness 0-1 to shininess 0-100
        wireframe: false,
        transparent: true,
        opacity: 1 - (wireframeIntensity / 100),
        flatShading: false,
        emissive: emissiveColor,
      });

      // CREATE TWO MESHES - One solid, one wireframe for blending
      const solidMesh = new THREE.Mesh(geometry, material);
      
      let wireframeMesh;
      let wireframeMaterial; // Make sure this is available for all geometry types
      
      // Create appropriate wireframe based on geometry type
      if (geometry.type === 'SphereGeometry' || 
          geometry.type === 'BoxGeometry' || 
          geometry.type === 'OctahedronGeometry' ||
          geometry.type === 'TetrahedronGeometry' ||
          geometry.type === 'IcosahedronGeometry') {
        
        const emissiveColor = new THREE.Color(baseColor).multiplyScalar(emissiveIntensity);
        
        wireframeMaterial = new THREE.MeshPhongMaterial({
          color: currentBaseColor,
          specular: currentSpecularColor,
          shininess: metalness * 100,
          transparent: true,
          opacity: wireframeIntensity / 100,
          flatShading: false,
          emissive: emissiveColor,
        });
        
        // Create thick wireframe group
        const wireframeGroup = new THREE.Group();
        const edgePairs = [];
        
        // Use EdgesGeometry to get edges
        const edgesGeometry = new THREE.EdgesGeometry(geometry);
        const edgeVertices = edgesGeometry.attributes.position.array;
        
        // Create cylinder for each edge
        for (let j = 0; j < edgeVertices.length; j += 6) {
          const start = new THREE.Vector3(edgeVertices[j], edgeVertices[j+1], edgeVertices[j+2]);
          const end = new THREE.Vector3(edgeVertices[j+3], edgeVertices[j+4], edgeVertices[j+5]);
          const distance = start.distanceTo(end);
          
          // Adjust cylinder radius based on geometry type
          let cylinderRadius = 0.005; // Default
          if (geometry.type === 'BoxGeometry') cylinderRadius = 0.015;
          else if (geometry.type === 'TetrahedronGeometry') cylinderRadius = 0.011;
          else if (geometry.type === 'OctahedronGeometry') cylinderRadius = 0.012;
          else if (geometry.type === 'IcosahedronGeometry') cylinderRadius = 0.012;
          
          // Create thick cylinder for edge
          const cylinderGeom = new THREE.CylinderGeometry(cylinderRadius, cylinderRadius, distance, 8);
          const cylinderMesh = new THREE.Mesh(cylinderGeom, wireframeMaterial);
          
          // Position cylinder between start and end points
          cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5));
          cylinderMesh.lookAt(end);
          cylinderMesh.rotateX(Math.PI / 2);
          
          cylinderMesh.userData.baseLength = distance;
          const iA = nearestVertexIndex(geometry, start);
          const iB = nearestVertexIndex(geometry, end);
          edgePairs.push([iA, iB]);
          wireframeGroup.add(cylinderMesh);
        }
        
        wireframeGroup.userData.edgePairs = edgePairs;
        wireframeMesh = wireframeGroup;
      } else {
        // Standard thin wireframe for other geometries
        const emissiveColor = new THREE.Color(baseColor).multiplyScalar(emissiveIntensity);
        
        wireframeMaterial = new THREE.MeshPhongMaterial({
          color: currentBaseColor,
          specular: currentSpecularColor,
          shininess: metalness * 100,
          wireframe: true,
          transparent: true,
          opacity: wireframeIntensity / 100,
          flatShading: false,
          emissive: emissiveColor,
        });
        
        wireframeMesh = new THREE.Mesh(geometry, wireframeMaterial);
      }
      
      // CREATE INTRICATE WIREFRAME DETAILS
      let centerLines, centerLinesMaterial, curvedLines, curvedLinesMaterial;
      
      // Create custom intricate wireframe details based on geometry type
      if (geometry.type === 'TetrahedronGeometry') {
        // Tetrahedron wireframe
        centerLinesMaterial = new THREE.MeshBasicMaterial({
          color: new THREE.Color(intricateWireframeSpiralColor),
          transparent: false,
          opacity: 1.0,
        });
        
        // Create inner tetrahedron vertices and connections
        const vertices = geometry.attributes.position.array;
        const outerVertices = [];
        for (let v = 0; v < 4; v++) {
          outerVertices.push([
            vertices[v * 3],
            vertices[v * 3 + 1],
            vertices[v * 3 + 2]
          ]);
        }
        
        const innerVertices = outerVertices.map(vertex => [
          vertex[0] * 0.5,
          vertex[1] * 0.5,
          vertex[2] * 0.5
        ]);
        
        const innerTetrahedronGroup = new THREE.Group();
        const edges = [[0,1], [0,2], [0,3], [1,2], [1,3], [2,3]];
        
        edges.forEach(([i, j]) => {
          const start = new THREE.Vector3(...innerVertices[i]);
          const end = new THREE.Vector3(...innerVertices[j]);
          const distance = start.distanceTo(end);
          
          const cylinderGeom = new THREE.CylinderGeometry(0.004, 0.004, distance, 8);
          const cylinderMesh = new THREE.Mesh(cylinderGeom, centerLinesMaterial);
          
          cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5));
          cylinderMesh.lookAt(end);
          cylinderMesh.rotateX(Math.PI / 2);
          
          innerTetrahedronGroup.add(cylinderMesh);
        });
        
        centerLines = innerTetrahedronGroup;
        
        // Create connections between inner and outer vertices
        curvedLinesMaterial = new THREE.MeshBasicMaterial({
          color: new THREE.Color(intricateWireframeEdgeColor),
          transparent: false,
          opacity: 1.0,
        });
        
        const tetrahedronConnectionGroup = new THREE.Group();
        
        for (let v = 0; v < 4; v++) {
          const start = new THREE.Vector3(...outerVertices[v]);
          const end = new THREE.Vector3(...innerVertices[v]);
          const distance = start.distanceTo(end);
          
          const cylinderGeom = new THREE.CylinderGeometry(0.003, 0.003, distance, 6);
          const cylinderMesh = new THREE.Mesh(cylinderGeom, curvedLinesMaterial);
          
          cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5));
          cylinderMesh.lookAt(end);
          cylinderMesh.rotateX(Math.PI / 2);
          
          tetrahedronConnectionGroup.add(cylinderMesh);
        }
        
        curvedLines = tetrahedronConnectionGroup;
      } else if (geometry.type === 'BoxGeometry') {
        // Box/Cube wireframe
        const size = 0.75;
        const outerCorners = [
          [-size, -size, -size],
          [size, -size, -size],
          [size, size, -size],
          [-size, size, -size],
          [-size, -size, size],
          [size, -size, size],
          [size, size, size],
          [-size, size, size]
        ];
        
        const innerScale = 0.5;
        const innerCorners = outerCorners.map(corner => [
          corner[0] * innerScale,
          corner[1] * innerScale,
          corner[2] * innerScale
        ]);
        
        // Inner cube edges
        centerLinesMaterial = new THREE.MeshBasicMaterial({
          color: new THREE.Color(intricateWireframeSpiralColor),
          transparent: false,
          opacity: 1.0,
        });
        
        const innerCubeGroup = new THREE.Group();
        const innerEdges = [
          [0, 1], [1, 2], [2, 3], [3, 0],
          [4, 5], [5, 6], [6, 7], [7, 4],
          [0, 4], [1, 5], [2, 6], [3, 7]
        ];
        
        innerEdges.forEach(([i, j]) => {
          const start = new THREE.Vector3(...innerCorners[i]);
          const end = new THREE.Vector3(...innerCorners[j]);
          const distance = start.distanceTo(end);
          
          const cylinderGeom = new THREE.CylinderGeometry(0.003, 0.008, distance, 8);
          const cylinderMesh = new THREE.Mesh(cylinderGeom, centerLinesMaterial);
          
          cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5));
          cylinderMesh.lookAt(end);
          cylinderMesh.rotateX(Math.PI / 2);
          
          innerCubeGroup.add(cylinderMesh);
        });
        
        centerLines = innerCubeGroup;
        
        // Connections between inner and outer corners
        curvedLinesMaterial = new THREE.MeshBasicMaterial({
          color: new THREE.Color(intricateWireframeEdgeColor),
          transparent: false,
          opacity: 1.0,
        });
        
        const connectionGroup = new THREE.Group();
        
        for (let i = 0; i < 8; i++) {
          const start = new THREE.Vector3(...innerCorners[i]);
          const end = new THREE.Vector3(...outerCorners[i]);
          const distance = start.distanceTo(end);
          
          const cylinderGeom = new THREE.CylinderGeometry(0.003, 0.005, distance, 6);
          const cylinderMesh = new THREE.Mesh(cylinderGeom, curvedLinesMaterial);
          
          cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5));
          cylinderMesh.lookAt(end);
          cylinderMesh.rotateX(Math.PI / 2);
          
          connectionGroup.add(cylinderMesh);
        }
        
        curvedLines = connectionGroup;
      } else if (geometry.type === 'OctahedronGeometry') {
        // Octahedron wireframe
        const size = 1.0;
        const outerVertices = [
          [0, size, 0],    // Top vertex
          [0, -size, 0],   // Bottom vertex
          [size, 0, 0],    // Right vertex
          [-size, 0, 0],   // Left vertex
          [0, 0, size],    // Front vertex
          [0, 0, -size]    // Back vertex
        ];
        
        const innerScale = 0.5;
        const innerVertices = outerVertices.map(vertex => [
          vertex[0] * innerScale,
          vertex[1] * innerScale,
          vertex[2] * innerScale
        ]);
        
        // Inner octahedron edges
        centerLinesMaterial = new THREE.MeshBasicMaterial({
          color: new THREE.Color(intricateWireframeSpiralColor),
          transparent: false,
          opacity: 1.0,
        });
        
        const innerOctahedronGroup = new THREE.Group();
        const octahedronEdges = [
          [0, 2], [0, 3], [0, 4], [0, 5],
          [1, 2], [1, 3], [1, 4], [1, 5],
          [2, 4], [4, 3], [3, 5], [5, 2]
        ];
        
        octahedronEdges.forEach(([i, j]) => {
          const start = new THREE.Vector3(...innerVertices[i]);
          const end = new THREE.Vector3(...innerVertices[j]);
          const distance = start.distanceTo(end);
          
          const cylinderGeom = new THREE.CylinderGeometry(0.004, 0.004, distance, 8);
          const cylinderMesh = new THREE.Mesh(cylinderGeom, centerLinesMaterial);
          
          cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5));
          cylinderMesh.lookAt(end);
          cylinderMesh.rotateX(Math.PI / 2);
          
          innerOctahedronGroup.add(cylinderMesh);
        });
        
        centerLines = innerOctahedronGroup;
        
        // Connections between inner and outer vertices
        curvedLinesMaterial = new THREE.MeshBasicMaterial({
          color: new THREE.Color(intricateWireframeEdgeColor),
          transparent: false,
          opacity: 1.0,
        });
        
        const octahedronConnectionGroup = new THREE.Group();
        
        for (let i = 0; i < 6; i++) {
          const start = new THREE.Vector3(...innerVertices[i]);
          const end = new THREE.Vector3(...outerVertices[i]);
          const distance = start.distanceTo(end);
          
          const cylinderGeom = new THREE.CylinderGeometry(0.003, 0.003, distance, 6);
          const cylinderMesh = new THREE.Mesh(cylinderGeom, curvedLinesMaterial);
          
          cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5));
          cylinderMesh.lookAt(end);
          cylinderMesh.rotateX(Math.PI / 2);
          
          octahedronConnectionGroup.add(cylinderMesh);
        }
        
        curvedLines = octahedronConnectionGroup;
      } else if (geometry.type === 'IcosahedronGeometry') {
        // Icosahedron wireframe
        // Golden ratio for canonical vertices
        const phi = (1 + Math.sqrt(5)) / 2;
        const rawVertices = [
          [-1, phi, 0], [1, phi, 0], [-1, -phi, 0], [1, -phi, 0],
          [0, -1, phi], [0, 1, phi], [0, -1, -phi], [0, 1, -phi],
          [phi, 0, -1], [phi, 0, 1], [-phi, 0, -1], [-phi, 0, 1]
        ];
        
        // Normalize all vertices to radius 1
        const outerVertices = rawVertices.map(v => {
          const vec = new THREE.Vector3(...v);
          return vec.normalize().toArray();
        });
        
        const innerScale = 0.5;
        const innerVertices = outerVertices.map(vertex => [
          vertex[0] * innerScale,
          vertex[1] * innerScale,
          vertex[2] * innerScale
        ]);
        
        // Inner icosahedron edges
        centerLinesMaterial = new THREE.MeshBasicMaterial({
          color: new THREE.Color(intricateWireframeSpiralColor),
          transparent: false,
          opacity: 1.0,
        });
        
        const innerIcosahedronGroup = new THREE.Group();
        
        // Find all edges: connect vertices that are close enough
        const edgeThreshold = 2.1;
        let icosahedronEdges = [];
        for (let i = 0; i < innerVertices.length; i++) {
          for (let j = i + 1; j < innerVertices.length; j++) {
            const v1 = new THREE.Vector3(...innerVertices[i]);
            const v2 = new THREE.Vector3(...innerVertices[j]);
            if (v1.distanceTo(v2) < edgeThreshold) {
              icosahedronEdges.push([i, j]);
            }
          }
        }
        
        icosahedronEdges.forEach(([i, j]) => {
          const start = new THREE.Vector3(...innerVertices[i]);
          const end = new THREE.Vector3(...innerVertices[j]);
          const distance = start.distanceTo(end);
          
          const cylinderGeom = new THREE.CylinderGeometry(0.004, 0.004, distance, 8);
          const cylinderMesh = new THREE.Mesh(cylinderGeom, centerLinesMaterial);
          
          cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5));
          cylinderMesh.lookAt(end);
          cylinderMesh.rotateX(Math.PI / 2);
          
          innerIcosahedronGroup.add(cylinderMesh);
        });
        
        centerLines = innerIcosahedronGroup;
        
        // Connections between inner and outer vertices
        curvedLinesMaterial = new THREE.MeshBasicMaterial({
          color: new THREE.Color(intricateWireframeEdgeColor),
          transparent: false,
          opacity: 1.0,
        });
        
        const icosahedronConnectionGroup = new THREE.Group();
        
        for (let i = 0; i < 12; i++) {
          const start = new THREE.Vector3(...outerVertices[i]);
          const end = new THREE.Vector3(...innerVertices[i]);
          const distance = start.distanceTo(end);
          
          const cylinderGeom = new THREE.CylinderGeometry(0.003, 0.003, distance, 6);
          const cylinderMesh = new THREE.Mesh(cylinderGeom, curvedLinesMaterial);
          
          cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5));
          cylinderMesh.lookAt(end);
          cylinderMesh.rotateX(Math.PI / 2);
          
          icosahedronConnectionGroup.add(cylinderMesh);
        }
        
        curvedLines = icosahedronConnectionGroup;
      } else {
        // Default wireframe for other geometries
        const edgesGeometry = new THREE.EdgesGeometry(geometry);
        const edgeVertices = edgesGeometry.attributes.position.array;
        
        // Center lines (spiral)
        const centerLinesGeometry = new THREE.BufferGeometry();
        const centerLinesPositions = [];
        
        // Create spiral paths from center to edge points
        let createCenterLines = true;
        if (geometry.type === 'TorusKnotGeometry') {
          createCenterLines = false; // No center lines for torus
        }
        
        if (createCenterLines) {
          for (let j = 0; j < edgeVertices.length; j += 12) { // Every other edge
            const endX = edgeVertices[j + 3];
            const endY = edgeVertices[j + 4];
            const endZ = edgeVertices[j + 5];
            
            const steps = 8; // Number of spiral steps
            for (let step = 0; step < steps; step++) {
              const t1 = step / steps;
              const t2 = (step + 1) / steps;
              
              // Spiral parameters
              const radius1 = t1 * 0.8; // Gradually increase radius
              const radius2 = t2 * 0.8;
              const angle1 = t1 * Math.PI * 2; // One full rotation
              const angle2 = t2 * Math.PI * 2;
              
              // Interpolate toward the actual edge point
              const denominator = Math.sqrt(endX*endX + endY*endY + endZ*endZ);
              
              const x1 = Math.cos(angle1) * radius1 * (endX / denominator);
              const y1 = Math.sin(angle1) * radius1 * (endY / denominator) + t1 * endY;
              const z1 = t1 * endZ;
              
              const x2 = Math.cos(angle2) * radius2 * (endX / denominator);
              const y2 = Math.sin(angle2) * radius2 * (endY / denominator) + t2 * endY;
              const z2 = t2 * endZ;
              
              centerLinesPositions.push(x1, y1, z1, x2, y2, z2);
            }
          }
        }
        
        if (centerLinesPositions.length > 0) {
          centerLinesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(centerLinesPositions, 3));
          
          centerLinesMaterial = new THREE.LineBasicMaterial({
            color: new THREE.Color(intricateWireframeSpiralColor),
            transparent: true,
            opacity: 0.6,
          });
          
          centerLines = new THREE.LineSegments(centerLinesGeometry, centerLinesMaterial);
        } else {
          centerLines = new THREE.Object3D();
          centerLinesMaterial = null;
        }
        
        // Edge connections
        const curvedLinesGeometry = new THREE.BufferGeometry();
        const curvedLinesPositions = [];
        
        // Connect wireframe edges to create enhanced patterns
        for (let j = 0; j < edgeVertices.length; j += 6) {
          const edge1Start = [edgeVertices[j], edgeVertices[j + 1], edgeVertices[j + 2]];
          const edge1End = [edgeVertices[j + 3], edgeVertices[j + 4], edgeVertices[j + 5]];
          
          // Find nearby edges to connect to
          for (let k = j + 6; k < edgeVertices.length && k < j + 36; k += 6) {
            const edge2Start = [edgeVertices[k], edgeVertices[k + 1], edgeVertices[k + 2]];
            const edge2End = [edgeVertices[k + 3], edgeVertices[k + 4], edgeVertices[k + 5]];
            
            // Calculate distance between edge endpoints
            const dist1 = Math.sqrt(
              (edge1End[0] - edge2Start[0])**2 + 
              (edge1End[1] - edge2Start[1])**2 + 
              (edge1End[2] - edge2Start[2])**2
            );
            
            const dist2 = Math.sqrt(
              (edge1End[0] - edge2End[0])**2 + 
              (edge1End[1] - edge2End[1])**2 + 
              (edge1End[2] - edge2End[2])**2
            );
            
            // Connect to nearby edge points
            const maxDist = geometry.type === 'TorusKnotGeometry' ? 0.6 : 1.2;
            
            if (dist1 < maxDist) {
              curvedLinesPositions.push(...edge1End, ...edge2Start);
            } else if (dist2 < maxDist) {
              curvedLinesPositions.push(...edge1End, ...edge2End);
            }
          }
        }
        
        if (curvedLinesPositions.length > 0) {
          curvedLinesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(curvedLinesPositions, 3));
          
          curvedLinesMaterial = new THREE.LineBasicMaterial({
            color: new THREE.Color(intricateWireframeEdgeColor),
            transparent: true,
            opacity: 0.4,
          });
          
          curvedLines = new THREE.LineSegments(curvedLinesGeometry, curvedLinesMaterial);
        } else {
          curvedLines = new THREE.Object3D();
          curvedLinesMaterial = null;
        }
      }
      
      // POSITION OBJECTS
      if (objectCount === 1) {
        solidMesh.position.set(0, 0, 0); // Single object at center
        wireframeMesh.position.set(0, 0, 0);
        centerLines.position.set(0, 0, 0);
        curvedLines.position.set(0, 0, 0);
      } else {
        // Multiple objects arranged in a circle
        const angle = (i / objectCount) * Math.PI * 2;
        const radius = 3;
        const x = Math.cos(angle) * radius;
        const y = (Math.random() - 0.9) * 1; // Random Y position for variety
        const z = Math.sin(angle) * radius;
        
        solidMesh.position.set(x, y, z);
        wireframeMesh.position.set(x, y, z);
        centerLines.position.set(x, y, z);
        curvedLines.position.set(x, y, z);
      }
      
      // Enable shadows
      solidMesh.castShadow = true;
      solidMesh.receiveShadow = true;
      wireframeMesh.castShadow = true;
      wireframeMesh.receiveShadow = true;
      
      // Add meshes to the scene
      scene.add(solidMesh);
      scene.add(wireframeMesh);
      scene.add(centerLines);
      scene.add(curvedLines);
      
      // STORE OBJECT DATA for later updates and animations
      objectsRef.current.push({
        solidMesh,
        wireframeMesh,
        thickCylinders: (wireframeMesh && wireframeMesh.isGroup) ? wireframeMesh.children.filter(m => m.isMesh) : null,
        edgePairs: (wireframeMesh && wireframeMesh.userData && wireframeMesh.userData.edgePairs) ? wireframeMesh.userData.edgePairs : null,
        centerLines,
        curvedLines,
        material,
        wireframeMaterial,
        centerLinesMaterial,
        curvedLinesMaterial,
        geometry,
        originalPositions,
        originalPosition: solidMesh.position.clone(),
        phase: Math.random() * Math.PI * 2,
        // Magnetic points for magnetic field animation effect
        magneticPoints: [
          { x: Math.random() * 4 - 2, y: Math.random() * 4 - 2, z: Math.random() * 4 - 2, strength: Math.random() + 0.5 },
          { x: Math.random() * 4 - 2, y: Math.random() * 4 - 2, z: Math.random() * 4 - 2, strength: Math.random() + 0.5 },
          { x: Math.random() * 4 - 2, y: Math.random() * 4 - 2, z: Math.random() * 4 - 2, strength: Math.random() + 0.5 }
        ]
      });
    }

    // Store first material as main reference for debugging
    if (objectsRef.current.length > 0) {
      materialRef.current = objectsRef.current[0].material;
    }
  }, [objectCount, baseColor, specularColor, objectType, intricateWireframeSpiralColor, intricateWireframeEdgeColor]);

  // ===============================================
  // ANIMATION UPDATES - Wire and Material Properties
  // ===============================================
  useEffect(() => {
    objectsRef.current.forEach(obj => {
      if (obj.material) {
        obj.material.opacity = 1 - (wireframeIntensity / 100);
      }
      if (obj.wireframeMaterial) {
        obj.wireframeMaterial.opacity = wireframeIntensity / 100;
      }
    });
  }, [wireframeIntensity]);

  useEffect(() => {
    console.log('Updating metalness (mapped to shininess) to:', metalness * 100);
    objectsRef.current.forEach(obj => {
      if (obj.material) {
        obj.material.shininess = metalness * 100; // Map 0-1 to 0-100
        obj.material.needsUpdate = true;
      }
      if (obj.wireframeMaterial) {
        obj.wireframeMaterial.shininess = metalness * 100;
        obj.wireframeMaterial.needsUpdate = true;
      }
    });
  }, [metalness]);

  useEffect(() => {
    console.log('Updating emissiveIntensity to:', emissiveIntensity);
    const emissiveColor = new THREE.Color(baseColor).multiplyScalar(emissiveIntensity);
    objectsRef.current.forEach(obj => {
      if (obj.material) {
        obj.material.emissive = emissiveColor.clone();
        obj.material.needsUpdate = true;
      }
      if (obj.wireframeMaterial) {
        obj.wireframeMaterial.emissive = emissiveColor.clone();
        obj.wireframeMaterial.needsUpdate = true;
      }
    });
  }, [emissiveIntensity, baseColor]);

  useEffect(() => {
    objectsRef.current.forEach(obj => {
      if (obj.centerLinesMaterial) {
        obj.centerLinesMaterial.color = new THREE.Color(intricateWireframeSpiralColor);
      }
    });
  }, [intricateWireframeSpiralColor]);

  useEffect(() => {
    objectsRef.current.forEach(obj => {
      if (obj.curvedLinesMaterial) {
        obj.curvedLinesMaterial.color = new THREE.Color(intricateWireframeEdgeColor);
      }
    });
  }, [intricateWireframeEdgeColor]);

  // ===============================================
  // ANIMATION CONTROLLER - Basic animations
  // ===============================================
  useEffect(() => {
    if (!sceneRef.current || !cameraRef.current) return;

    const scene = sceneRef.current;
    const camera = cameraRef.current;

    function animate() {
      animationIdRef.current = requestAnimationFrame(animate);
      
      const time = performance.now(); // Get current time for smooth animations
      const t = time * 0.001;         // Convert to seconds

      // ANIMATE EACH OBJECT based on animationStyle
      objectsRef.current.forEach((objData, index) => {
        const { solidMesh, wireframeMesh, centerLines, curvedLines, originalPosition, phase } = objData;
        
        // Use either the new dual-mesh system or legacy single mesh
        const meshesToAnimate = [solidMesh, wireframeMesh, centerLines, curvedLines].filter(mesh => mesh);
        
        meshesToAnimate.forEach(currentMesh => {
          switch(animationStyle) {
            case 'rotate':
              // Simple rotation animation
              currentMesh.rotation.x += 0.01;
              currentMesh.rotation.y += 0.01;
              currentMesh.rotation.z += 0.01;
              currentMesh.position.copy(originalPosition);
              break;
              
            case 'float':
              // Floating/bobbing animation
              currentMesh.rotation.x = t + phase;
              currentMesh.rotation.y = t * 0.7 + phase;
              currentMesh.position.x = originalPosition.x + Math.sin(t + phase) * 0.5;
              currentMesh.position.y = originalPosition.y + Math.cos(t + phase) * 0.5;
              currentMesh.position.z = originalPosition.z + Math.sin(t * 0.5 + phase) * 0.3;
              break;
              
            // Add more animation styles as needed
            
            default:
              // Default animation (gentle rotation)
              currentMesh.rotation.y += 0.005;
          }
        });

        // Update wireframe cylinders to conform to mesh if needed
        if (objData.thickCylinders && objData.edgePairs) {
          updateThickWireframeCylinders(objData);
        }
      });
    }

    // Start the animation loop
    animate();

    // Clean up function
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [animationStyle]);

  return (
    <div className="three-scene" ref={mountRef}>
      {/* The 3D canvas will be attached here */}
    </div>
  );
}

export default ThreeScene;