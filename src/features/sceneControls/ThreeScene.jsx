import { updateEnvironment } from './environmentSetup';
import { __UP, __Q, __TMP, __A, __B, __M, __Inv, nearestVertexIndex, updateThickWireframeCylinders } from '../../utils/geometryHelpers';
import React from 'react';
import './ThreeScene.css';
import { use, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { createSceneObject } from './factories/objectFactory';
import { useSceneInitialization } from './hooks/useSceneInitialization';
import { useObjectManager } from './hooks/useObjectManager';
import { useCameraController } from './hooks/useCameraController';
import { useMaterialUpdates } from './hooks/useMaterialUpdates';
import { useLightingUpdates } from './hooks/useLightingUpdates';
import { useMouseTracking, useEnvironmentUpdate } from './hooks/useSceneEffects';



// ========================================================================
// THREESCENE.JSX - THE 3D RENDERER (RECEIVES PROPS FROM APP.JSX)
// ========================================================================
// This component ONLY receives data - it doesn't manage any state itself.
// All the values come from App.jsx as props, and when App.jsx changes them,
// this component automatically re-renders the 3D scene with new values.

function ThreeScene({ 
	// MATERIAL PROPS - How the 3D objects should look (FROM App.jsx state)
	scale,                 // Current scale value → will update Three.js object scale
	metalness,           // Current metalness value → will update Three.js material.metalness (0-1)
	emissiveIntensity,   // Current emissive intensity → will update Three.js material.emissive (multiplied by baseColor)
	baseColor,           // Current base color → will update Three.js material.color
	wireframeIntensity,  // Current wireframe intensity → will update Three.js material.wireframe
	
	// INTRICATE WIREFRAME PROPS - How the intricate wireframe should look (FROM App.jsx state)
	hyperframeColor,  // Current spiral color → will update intricate wireframe spiral lines
	hyperframeLineColor,    // Current edge color → will update intricate wireframe edge connections
	
	// SCENE BEHAVIOR PROPS - How the scene should behave (FROM App.jsx state)
	cameraView,          // Current camera view → will position/animate camera
	environment,         // Current environment → will change background/lighting
	objectCount,         // Current object count → will create this many objects
	animationStyle,      // Current animation → will control how objects move
	objectType,          // Current object type → will determine which 3D shape to show
	
	// LIGHTING PROPS - How the scene should be lit (FROM App.jsx state)
	ambientLightColor,       // Current ambient light color → will update ambient light
	ambientLightIntensity,   // Current ambient light intensity → will update ambient light
	directionalLightColor,   // Current directional light color → will update directional light
	directionalLightIntensity, // Current directional light intensity → will update directional light
	directionalLightX,       // Current light X position → will position directional light
	directionalLightY,       // Current light Y position → will position directional light
	directionalLightZ        // Current light Z position → will position directional light
}) {
	// DEBUG: Log all props on every render
	console.log('[ThreeScene] Rendered with props:', {
		scale,
		metalness,
		emissiveIntensity,
		baseColor,
		wireframeIntensity,
		hyperframeColor,
		hyperframeLineColor,
		cameraView,
		environment,
		objectCount,
		animationStyle,
		objectType,
		ambientLightColor,
		ambientLightIntensity,
		directionalLightColor,
		directionalLightIntensity,
		directionalLightX,
		directionalLightY,
		directionalLightZ
	});
	// ========================================
	// REFS - STORING THREE.JS OBJECTS
	// ========================================
	// useRef lets us store Three.js objects that persist between re-renders
	// These are NOT React state - they're just containers for Three.js objects
	
	const mountRef = useRef(null)              // Where to attach the 3D canvas to the DOM
	const sceneRef = useRef(null)              // The Three.js scene object
	const materialRef = useRef(null)           // Reference to main material for debugging
	const cameraRef = useRef(null)             // The Three.js camera object
	const rendererRef = useRef(null)           // The Three.js renderer object
	const objectsRef = useRef([])              // Array of all 3D objects in the scene
	const animationIdRef = useRef(null)        // ID for the animation loop (so we can cancel it)
	const ambientLightRef = useRef(null)       // Reference to ambient light (so we can update it)
	const directionalLightRef = useRef(null)   // Reference to directional light (so we can update it)

	// =============================================
	// CUSTOM HOOKS - ORGANIZED SCENE MANAGEMENT
	// =============================================
	
	// Initialize scene, camera, renderer, lights (runs once on mount)
	useSceneInitialization(
		{ sceneRef, cameraRef, rendererRef, mountRef, ambientLightRef, directionalLightRef, animationIdRef },
		{ ambientLightColor, ambientLightIntensity, directionalLightColor, directionalLightIntensity, 
		  directionalLightX, directionalLightY, directionalLightZ }
	);

	// Track mouse for orb interaction
	useMouseTracking(rendererRef, cameraRef);

	// Update environment (background and orbs)
	useEnvironmentUpdate(sceneRef, environment);

	// Manage object creation and updates
	useObjectManager(
		{ sceneRef, objectsRef, materialRef },
		{ objectCount, objectType, baseColor, metalness, emissiveIntensity, 
		  wireframeIntensity, hyperframeColor, hyperframeLineColor }
	);

	// Control camera position
	useCameraController(cameraRef, cameraView);

	// Update material properties
	useMaterialUpdates(objectsRef, {
		scale, metalness, emissiveIntensity, baseColor, wireframeIntensity,
		hyperframeColor, hyperframeLineColor
	});

	// Update lighting
	useLightingUpdates(
		{ ambientLightRef, directionalLightRef },
		{ ambientLightColor, ambientLightIntensity, directionalLightColor, directionalLightIntensity,
		  directionalLightX, directionalLightY, directionalLightZ }
	);

	// ===============================================
	// ANIMATION CONTROLLER - RESPONDS TO animationStyle PROP
	// ===============================================
	// When App.jsx changes animationStyle prop, this useEffect runs and starts a new animation loop
	
	useEffect(() => {
		if (!sceneRef.current || !cameraRef.current) return // Safety checks

		const scene = sceneRef.current
		const camera = cameraRef.current

		// MAIN ANIMATION LOOP - Different styles based on animationStyle prop from App.jsx
		function animate() {
			animationIdRef.current = requestAnimationFrame(animate) // Schedule next frame
			
			const time = performance.now() // Get current time for smooth animations
			const t = time * 0.001         // Convert to seconds

			// ANIMATE EACH OBJECT based on animationStyle prop from App.jsx
			objectsRef.current.forEach((objData, index) => {
				const { solidMesh, wireframeMesh, centerLines, curvedLines, mesh, originalPosition, phase, geometry, originalPositions, magneticPoints } = objData
				
				// Use either the new dual-mesh system or legacy single mesh
				const meshesToAnimate = solidMesh && wireframeMesh ? [solidMesh, wireframeMesh, centerLines, curvedLines] : (mesh ? [mesh] : [])
				
				meshesToAnimate.forEach(currentMesh => {
					switch(animationStyle) { // Use animationStyle prop from App.jsx
						case 'rotate':
							// Simple rotation animation - reset vertices to original positions first
							if (geometry && originalPositions && currentMesh === solidMesh) {
								const positions = geometry.attributes.position.array
								for (let i = 0; i < positions.length; i++) {
									positions[i] = originalPositions[i]
								}
								geometry.attributes.position.needsUpdate = true
								
								// Also reset wireframe geometry to match original positions
								if (centerLines && centerLines.geometry && geometry.type !== 'TetrahedronGeometry') {
									// Rebuild spiral wireframe for non-tetrahedron geometries
									const edgesGeometry = new THREE.EdgesGeometry(geometry)
									const edgeVertices = edgesGeometry.attributes.position.array
									
									const centerLinesGeometry = centerLines.geometry
									const centerLinesPositions = []
									
									// Recreate spiral paths from center to original edge points
									for (let j = 0; j < edgeVertices.length; j += 12) {
										const endX = edgeVertices[j + 3]
										const endY = edgeVertices[j + 4]
										const endZ = edgeVertices[j + 5]
										
										const steps = 8 // Number of spiral steps
										for (let step = 0; step < steps; step++) {
											const t1 = step / steps
											const t2 = (step + 1) / steps
											
											// Spiral parameters
											const radius1 = t1 * 0.8 // Gradually increase radius
											const radius2 = t2 * 0.8
											const angle1 = t1 * Math.PI * 2 // One full rotation
											const angle2 = t2 * Math.PI * 2
											
											// Interpolate toward the actual edge point
											const x1 = Math.cos(angle1) * radius1 * (endX / Math.sqrt(endX*endX + endY*endY + endZ*endZ))
											const y1 = Math.sin(angle1) * radius1 * (endY / Math.sqrt(endX*endX + endY*endY + endZ*endZ)) + t1 * endY
											const z1 = t1 * endZ
											
											const x2 = Math.cos(angle2) * radius2 * (endX / Math.sqrt(endX*endX + endY*endY + endZ*endZ))
											const y2 = Math.sin(angle2) * radius2 * (endY / Math.sqrt(endX*endX + endY*endY + endZ*endZ)) + t2 * endY
											const z2 = t2 * endZ
											
											centerLinesPositions.push(x1, y1, z1, x2, y2, z2)
										}
									}
									
									if (centerLinesPositions.length > 0) {
										centerLinesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(centerLinesPositions, 3))
									}
								}
							}
							
							currentMesh.rotation.x += 0.01
							currentMesh.rotation.y += 0.01
							currentMesh.rotation.z += 0.01
							currentMesh.position.copy(originalPosition)
							break

						case 'float':
							// Floating/bobbing animation - reset vertices to original positions first
							if (geometry && originalPositions && currentMesh === solidMesh) {
								const positions = geometry.attributes.position.array
								for (let i = 0; i < positions.length; i++) {
									positions[i] = originalPositions[i]
								}
								geometry.attributes.position.needsUpdate = true
								
								// Also reset wireframe geometry to match original positions
								if (centerLines && centerLines.geometry && geometry.type !== 'TetrahedronGeometry') {
									// Rebuild spiral wireframe for non-tetrahedron geometries
									const edgesGeometry = new THREE.EdgesGeometry(geometry)
									const edgeVertices = edgesGeometry.attributes.position.array
									
									const centerLinesGeometry = centerLines.geometry
									const centerLinesPositions = []
									
									// Recreate spiral paths from center to original edge points
									for (let j = 0; j < edgeVertices.length; j += 12) {
										const endX = edgeVertices[j + 3]
										const endY = edgeVertices[j + 4]
										const endZ = edgeVertices[j + 5]
										
										const steps = 8 // Number of spiral steps
										for (let step = 0; step < steps; step++) {
											const t1 = step / steps
											const t2 = (step + 1) / steps
											
											// Spiral parameters
											const radius1 = t1 * 0.8 // Gradually increase radius
											const radius2 = t2 * 0.8
											const angle1 = t1 * Math.PI * 2 // One full rotation
											const angle2 = t2 * Math.PI * 2
											
											// Interpolate toward the actual edge point
											const x1 = Math.cos(angle1) * radius1 * (endX / Math.sqrt(endX*endX + endY*endY + endZ*endZ))
											const y1 = Math.sin(angle1) * radius1 * (endY / Math.sqrt(endX*endX + endY*endY + endZ*endZ)) + t1 * endY
											const z1 = t1 * endZ
											
											const x2 = Math.cos(angle2) * radius2 * (endX / Math.sqrt(endX*endX + endY*endY + endZ*endZ))
											const y2 = Math.sin(angle2) * radius2 * (endY / Math.sqrt(endX*endX + endY*endY + endZ*endZ)) + t2 * endY
											const z2 = t2 * endZ
											
											centerLinesPositions.push(x1, y1, z1, x2, y2, z2)
										}
									}
									
									if (centerLinesPositions.length > 0) {
										centerLinesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(centerLinesPositions, 3))
									}
								}
							}
							
							currentMesh.rotation.x = t + phase
							currentMesh.rotation.y = t * 0.7 + phase
							currentMesh.position.x = originalPosition.x + Math.sin(t + phase) * 0.5
							currentMesh.position.y = originalPosition.y + Math.cos(t + phase) * 0.5
							currentMesh.position.z = originalPosition.z + Math.sin(t * 0.5 + phase) * 0.3
							break

						case 'spiral':
							// Spiral motion animation - reset vertices to original positions first
							if (geometry && originalPositions && currentMesh === solidMesh) {
								const positions = geometry.attributes.position.array
								for (let i = 0; i < positions.length; i++) {
									positions[i] = originalPositions[i]
								}
								geometry.attributes.position.needsUpdate = true
								
								// Also reset wireframe geometry to match original positions
								if (centerLines && centerLines.geometry && geometry.type !== 'TetrahedronGeometry') {
									// Rebuild spiral wireframe for non-tetrahedron geometries
									const edgesGeometry = new THREE.EdgesGeometry(geometry)
									const edgeVertices = edgesGeometry.attributes.position.array
									
									const centerLinesGeometry = centerLines.geometry
									const centerLinesPositions = []
									
									// Recreate spiral paths from center to original edge points
									for (let j = 0; j < edgeVertices.length; j += 12) {
										const endX = edgeVertices[j + 3]
										const endY = edgeVertices[j + 4]
										const endZ = edgeVertices[j + 5]

										
										const steps = 8 // Number of spiral steps
										for (let step = 0; step < steps; step++) {
											const t1 = step / steps
											const t2 = (step + 1) / steps
											
											// Spiral parameters
											const radius1 = t1 * 0.8 // Gradually increase radius
											const radius2 = t2 * 0.8
											const angle1 = t1 * Math.PI * 2 // One full rotation
											const angle2 = t2 * Math.PI * 2
											
											// Interpolate toward the actual edge point
											const x1 = Math.cos(angle1) * radius1 * (endX / Math.sqrt(endX*endX + endY*endY + endZ*endZ))
											const y1 = Math.sin(angle1) * radius1 * (endY / Math.sqrt(endX*endX + endY*endY + endZ*endZ)) + t1 * endY
											const z1 = t1 * endZ
											
											const x2 = Math.cos(angle2) * radius2 * (endX / Math.sqrt(endX*endX + endY*endY + endZ*endZ))
											const y2 = Math.sin(angle2) * radius2 * (endY / Math.sqrt(endX*endX + endY*endY + endZ*endZ)) + t2 * endY
											const z2 = t2 * endZ
											
											centerLinesPositions.push(x1, y1, z1, x2, y2, z2)
										}
									}
									
									if (centerLinesPositions.length > 0) {
										centerLinesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(centerLinesPositions, 3))
									}
								}
							}
							
							const spiralRadius = 2 + Math.sin(t + phase) * 1
							const spiralAngle = t + phase + index * 0.5
							currentMesh.position.x = Math.cos(spiralAngle) * spiralRadius
							currentMesh.position.y = Math.sin(t * 2 + phase) * 2
							currentMesh.position.z = Math.sin(spiralAngle) * spiralRadius
							currentMesh.rotation.x = spiralAngle
							currentMesh.rotation.y = spiralAngle * 0.7
							break

					case 'liquid':
						// Liquid metal effect: morph vertices with smooth flowing sine/cosine waves
						if (geometry && originalPositions && currentMesh === solidMesh) {
							// Check if this is a structured geometry that should maintain its shape
							const isSphere = geometry.type === 'SphereGeometry';
							const isBox = geometry.type === 'BoxGeometry';
							const isOctahedron = geometry.type === 'OctahedronGeometry';
							const isTetrahedron = geometry.type === 'TetrahedronGeometry';
							const shouldMaintainStructure = isSphere || isBox || isOctahedron || isTetrahedron;
							
							if (!shouldMaintainStructure) {
								// Only deform unstructured geometries
								const positions = geometry.attributes.position.array;
								for (let i = 0; i < positions.length; i += 3) {
									const ox = originalPositions[i];
									const oy = originalPositions[i + 1];
									const oz = originalPositions[i + 2];
									// Three gentle, phase-shifted waves
									const wave1 = Math.sin(ox * 1.2 + t * 1.1) * 0.12;
									const wave2 = Math.cos(oy * 1.3 + t * 0.9) * 0.10;
									const wave3 = Math.sin(oz * 1.1 + t * 1.3 + Math.cos(t * 0.5)) * 0.08;
									positions[i]     = ox + wave1;
									positions[i + 1] = oy + wave2;
									positions[i + 2] = oz + wave3;
								}
								geometry.attributes.position.needsUpdate = true;
							}
						}
						// Slow, gentle rotation and keep original position
						currentMesh.rotation.x += 0.004;
						currentMesh.rotation.y += 0.006;
						currentMesh.position.copy(originalPosition);
						break;						case 'chaos':
							// Chaotic random movement - reset vertices to original positions first
							if (geometry && originalPositions && currentMesh === solidMesh) {
								const positions = geometry.attributes.position.array
								for (let i = 0; i < positions.length; i++) {
									positions[i] = originalPositions[i]
								}
								geometry.attributes.position.needsUpdate = true
								
								// Also reset wireframe geometry to match original positions
								if (centerLines && centerLines.geometry && geometry.type !== 'TetrahedronGeometry') {
									// Rebuild spiral wireframe for non-tetrahedron geometries
									const edgesGeometry = new THREE.EdgesGeometry(geometry)
									const edgeVertices = edgesGeometry.attributes.position.array
									
									const centerLinesGeometry = centerLines.geometry
									const centerLinesPositions = []
									
									// Recreate spiral paths from center to original edge points
									for (let j = 0; j < edgeVertices.length; j += 12) {
										const endX = edgeVertices[j + 3]
										const endY = edgeVertices[j + 4]
										const endZ = edgeVertices[j + 9]
										
										const steps = 8 // Number of spiral steps
										for (let step = 0; step < steps; step++) {
											const t1 = step / steps
											const t2 = (step + 1) / steps
											
											// Spiral parameters
											const radius1 = t1 * 0.8 // Gradually increase radius
											const radius2 = t2 * 0.8
											const angle1 = t1 * Math.PI * 2 // One full rotation
											const angle2 = t2 * Math.PI * 2
											
											// Interpolate toward the actual edge point
											const x1 = Math.cos(angle1) * radius1 * (endX / Math.sqrt(endX*endX + endY*endY + endZ*endZ))
											const y1 = Math.sin(angle1) * radius1 * (endY / Math.sqrt(endX*endX + endY*endY + endZ*endZ)) + t1 * endY
											const z1 = t1 * endZ
											
											const x2 = Math.cos(angle2) * radius2 * (endX / Math.sqrt(endX*endX + endY*endY + endZ*endZ))
											const y2 = Math.sin(angle2) * radius2 * (endY / Math.sqrt(endX*endX + endY*endY + endZ*endZ)) + t2 * endY
											const z2 = t2 * endZ
											
											centerLinesPositions.push(x1, y1, z1, x2, y2, z2)
										}
									}
									
									if (centerLinesPositions.length > 0) {
										centerLinesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(centerLinesPositions, 3))
									}
								}
							}
							
							currentMesh.position.x = originalPosition.x + Math.sin(t * 3 + phase) * 2
							currentMesh.position.y = originalPosition.y + Math.cos(t * 2 + phase) * 2
							currentMesh.position.z = originalPosition.z + Math.sin(t * 1.5 + phase) * 2
							currentMesh.rotation.x = t * 2 + phase
							currentMesh.rotation.y = t * 1.5 + phase
							currentMesh.rotation.z = t * 2.5 + phase
							break
case 'alien':
  // Only animate solidMesh - wireframes will be synchronized after
  if (currentMesh !== solidMesh) break;
  
  // ============================================
  // ALIEN INTELLIGENCE V4.0 - SENTIENT SYMPHONY (Slow Build & Elliptical Dash)
  // Focus: Non-repetitive, slowly building spin, and a curved, curious recede/return.
  // ============================================

  // STEP 3: Choose speed variation (Moved up from below)
  const speedVariation = index % 4;
  let cycleTime, orbitSize, reactionSpeed;
  
  // --- Utility Easing Functions (for graceful, sentient transitions) ---
  const easeInOutCubic = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const easeInQuart = (t) => t * t * t * t;
  const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);
  const easeInOutQuad = (t) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  // New Easing: Smoother, more organic buildup
  const easeInOutQuint = (t) => t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (t - 1) * (t - 1) * (t - 1) * (t - 1) * (t - 1);

  // STEP 1 & 2: Reset & Rebuild with geometry-specific handling
  if (geometry && originalPositions && currentMesh === solidMesh) {
    const positions = geometry.attributes.position.array
    
    // Check if this is a structured geometry
    const isSphere = geometry.type === 'SphereGeometry';
    const isBox = geometry.type === 'BoxGeometry';
    const isOctahedron = geometry.type === 'OctahedronGeometry';
    const isTetrahedron = geometry.type === 'TetrahedronGeometry';
    const isIcosahedron = geometry.type === 'IcosahedronGeometry';
    const shouldMaintainStructure = isSphere || isBox || isOctahedron || isTetrahedron || isIcosahedron;
    
    // Restore original positions
    for (let i = 0; i < positions.length; i++) {
      positions[i] = originalPositions[i]
    }
    geometry.attributes.position.needsUpdate = true

    // Rebuild centerLines using geometry-specific patterns
    if (centerLines && centerLines.geometry) {
      const edgesGeometry = new THREE.EdgesGeometry(geometry)
      const edgeVertices = edgesGeometry.attributes.position.array
      const centerLinesGeometry = centerLines.geometry
      const centerLinesPositions = []

      if (isSphere) {
        // Spiral pattern for spheres
        for (let j = 0; j < edgeVertices.length; j += 12) {
          const endX = edgeVertices[j + 3];
          const endY = edgeVertices[j + 4];
          const endZ = edgeVertices[j + 5];
          const steps = 8;
          for (let step = 0; step < steps; step++) {
            const t1 = step / steps;
            const t2 = (step + 1) / steps;
            const radius1 = t1 * 0.8;
            const radius2 = t2 * 0.8;
            const angle1 = t1 * Math.PI * 2;
            const angle2 = t2 * Math.PI * 2;
            const norm = Math.sqrt(endX*endX + endY*endY + endZ*endZ);
            const x1 = Math.cos(angle1) * radius1 * (endX / norm);
            const y1 = Math.sin(angle1) * radius1 * (endY / norm) + t1 * endY;
            const z1 = t1 * endZ;
            const x2 = Math.cos(angle2) * radius2 * (endX / norm);
            const y2 = Math.sin(angle2) * radius2 * (endY / norm) + t2 * endY;
            const z2 = t2 * endZ;
            centerLinesPositions.push(x1, y1, z1, x2, y2, z2);
          }
        }
      } else if (isBox || isOctahedron || isIcosahedron) {
        // Clean linear interpolation for boxes, octahedrons, and icosahedrons
        for (let j = 0; j < edgeVertices.length; j += 6) {
          const p1 = new THREE.Vector3(edgeVertices[j], edgeVertices[j + 1], edgeVertices[j + 2]);
          const p2 = new THREE.Vector3(edgeVertices[j + 3], edgeVertices[j + 4], edgeVertices[j + 5]);
          const steps = 6;
          for (let step = 0; step < steps; step++) {
            const t1 = step / steps;
            const t2 = (step + 1) / steps;
            const x1 = p1.x + (p2.x - p1.x) * t1;
            const y1 = p1.y + (p2.y - p1.y) * t1;
            const z1 = p1.z + (p2.z - p1.z) * t1;
            const x2 = p1.x + (p2.x - p1.x) * t2;
            const y2 = p1.y + (p2.y - p1.y) * t2;
            const z2 = p1.z + (p2.z - p1.z) * t2;
            centerLinesPositions.push(x1, y1, z1, x2, y2, z2);
          }
        }
      } else if (isTetrahedron) {
        // Direct vertex connections for tetrahedrons
        const verts = [];
        for (let i = 0; i < positions.length; i += 3) {
          verts.push([positions[i], positions[i + 1], positions[i + 2]]);
        }
        const edges = [[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]];
        for (const [a, b] of edges) {
          centerLinesPositions.push(...verts[a], ...verts[b]);
        }
      } else {
        // For other geometries, use the original noisy pattern
        for (let j = 0; j < edgeVertices.length; j += 6) {
          const p1 = new THREE.Vector3(edgeVertices[j], edgeVertices[j + 1], edgeVertices[j + 2]);
          const p2 = new THREE.Vector3(edgeVertices[j + 3], edgeVertices[j + 4], edgeVertices[j + 5]);
          const dir = p2.clone().sub(p1).normalize();
          
          const steps = 6;
          const noiseScale = 0.05 * (speedVariation + 1);
          for (let step = 0; step < steps; step++) {
            const t1 = step / steps;
            const t2 = (step + 1) / steps;
            
            const x1 = p1.x + dir.x * (p2.x - p1.x) * t1 + Math.sin(t * 10 + j) * noiseScale * t1;
            const y1 = p1.y + dir.y * (p2.y - p1.y) * t1 + Math.cos(t * 10 + j) * noiseScale * t1;
            const z1 = p1.z + dir.z * (p2.z - p1.z) * t1;
            
            const x2 = p1.x + dir.x * (p2.x - p1.x) * t2 + Math.sin(t * 10 + j) * noiseScale * t2;
            const y2 = p1.y + dir.y * (p2.y - p1.y) * t2 + Math.cos(t * 10 + j) * noiseScale * t2;
            const z2 = p1.z + dir.z * (p2.z - p1.z) * t2;
            
            centerLinesPositions.push(x1, y1, z1, x2, y2, z2);
          }
        }
      }
      
      if (centerLinesPositions.length > 0) {
        centerLinesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(centerLinesPositions, 3))
        centerLinesGeometry.attributes.position.needsUpdate = true;
      }
    }
  }

  // Set speed parameters based on variation
  switch(speedVariation) {
    case 0: // Reflective & Smooth (Emotion: Curiosity)
      cycleTime = 30 
      orbitSize = 3 
      reactionSpeed = 10 
      break
    case 1: // Observational & Measured (Emotion: Calm Intelligence)
      cycleTime = 22
      orbitSize = 4.5
      reactionSpeed = 15
      break
    case 2: // Focused & Intense (Emotion: Determination/Aversion)
      cycleTime = 16 
      orbitSize = 6
      reactionSpeed = 20
      break
    case 3: // Erratic & Unpredictable (Emotion: Disturbed/Agitated)
      cycleTime = 18 + Math.sin(t * 0.5 + phase) * 3 
      orbitSize = 5 + Math.cos(t * 0.3 + phase) * 1.5
      reactionSpeed = 18 + Math.sin(t * 0.7 + phase) * 5
      break
  }

  const cycleProgress = ((t + phase) % cycleTime) / cycleTime

  // --- Intelligent Movement Phases ---

  // PHASE 1: Initial Float & Contemplation (0% - 20%)
  if (cycleProgress < 0.20) {
    const hoverIntensity = 0.08 + (speedVariation * 0.02) // Reduced from 0.15
    
    currentMesh.position.x = originalPosition.x + Math.sin(t * 0.8 + phase) * hoverIntensity * 1.2 // Much slower from t*1.5
    currentMesh.position.y = originalPosition.y + Math.cos(t * 1.0 + phase) * hoverIntensity // Much slower from t*2
    currentMesh.position.z = originalPosition.z + Math.sin(t * 0.6 + phase) * hoverIntensity * 0.5 // Much slower from t*1
    
    // Very gentle, contemplative rotation (50% slower than Phase 2)
    currentMesh.rotation.y = t * 0.05 + phase // 50% of Phase 2's 0.1
    currentMesh.rotation.x = Math.sin(t * 0.1 + phase) * 0.05 // 50% slower time & amplitude
    currentMesh.rotation.z = Math.cos(t * 0.075 + phase) * 0.04 // 50% slower time & amplitude
    
    currentMesh.scale.setScalar(1 + Math.sin(t * 0.5 + phase) * 0.015) // Much slower breathing from t*1
  }

  // PHASE 2: Symphonic Pause & Dervish Dance (20% - 35%)
  // Sentient: Spin varies its speed and builds up slowly at unpredictable intervals.
  else if (cycleProgress < 0.35) {
    const t_spin = (cycleProgress - 0.20) / 0.15
    const eased_pos = easeInOutQuad(t_spin)

    // Position: Swiftly returns to origin and holds (The 'stop for a second' request)
    currentMesh.position.x = THREE.MathUtils.lerp(currentMesh.position.x, originalPosition.x, eased_pos * 0.5) 
    currentMesh.position.y = THREE.MathUtils.lerp(currentMesh.position.y, originalPosition.y, eased_pos * 0.5) 
    currentMesh.position.z = THREE.MathUtils.lerp(currentMesh.position.z, originalPosition.z, eased_pos * 0.5) 
    
    // --- New Modulated Spin Logic (Non-Repetitive Buildup) ---
    
    // 1. Time-Based Modulator: Very slow wave for ultra-graceful movement
    const longWaveModulator = (Math.sin(t * 0.15 + phase * 2) * 0.5 + 0.5); // Much slower from t*0.3
    
    // 2. Slow Build-up Curve: Use a slower easing function (Quintic) on the local spin time (t_spin)
    const buildUpFactor = easeInOutQuint(t_spin);

    // 3. Emotional Speed Mix: Further reduced max speed for ultra-smooth motion
    const minSpeed = 0.02 + speedVariation * 0.01; // Further reduced
    const maxSpeed = reactionSpeed * 0.02;         // Further reduced
    
    // Current Spin is controlled by the slow time wave, scaled by the buildup over the phase
    const currentSpinSpeed = THREE.MathUtils.lerp(
        minSpeed, 
        maxSpeed * longWaveModulator,
        buildUpFactor
    );

    // Rotation: Apply the modulated speed with ultra-smooth, graceful movement
    currentMesh.rotation.x += currentSpinSpeed * 0.5 * Math.sin(t * 0.15 + phase) // Much gentler/slower
    currentMesh.rotation.y += currentSpinSpeed * 1.0 // Reduced from 1.5
    currentMesh.rotation.z += currentSpinSpeed * 0.3 * Math.cos(t * 0.2 + phase) // Much gentler/slower
    
    // Curiosity/Wobble - ultra subtle
    currentMesh.position.x += Math.sin(t * 2 + phase) * (1 - buildUpFactor) * 0.005; // Much slower/subtler from t*5, 0.01
    currentMesh.position.y += Math.cos(t * 1.5 + phase) * (1 - buildUpFactor) * 0.005; // Much slower/subtler from t*4, 0.01
  }

  // PHASE 3: Elliptical Recede & Curious Return (35% - 50%)
  // Sentient: Recedes in a curved dash, then returns with Curiosity.
  else if (cycleProgress < 0.50) {
    const t_dash = (cycleProgress - 0.35) / 0.15
    const eased_recede = easeInOutQuad(t_dash); // Smooth, fast dash out and in

    const maxDashDistance = orbitSize * 1.5; // Larger, more dramatic move
    const ellipseHeight = orbitSize * 0.4;
    
    // Position: Move back (Z-) and swing out in an ellipse (X/Y curve)
    currentMesh.position.x = originalPosition.x + Math.sin(eased_recede * Math.PI) * maxDashDistance * 0.15; // Even gentler
    currentMesh.position.y = originalPosition.y + Math.cos(eased_recede * Math.PI) * ellipseHeight * 0.5;  // Even more reduced
    currentMesh.position.z = originalPosition.z - eased_recede * maxDashDistance * 0.5;                     // Even closer

    // Rotation: Curious movement (50% slower than Phase 2)
    currentMesh.rotation.x = Math.sin(t * 0.5 + phase) * 0.015 * (1 - eased_recede); // 50% slower
    currentMesh.rotation.y = eased_recede * Math.PI * 0.6; // 50% of Phase 2's rotation
    currentMesh.rotation.z = Math.cos(t * 0.4 + phase) * 0.015; // 50% slower
  }

  // PHASE 4: Erratic Figure-8 Ellipse Observation (50% - 85%)
  // (Kept the same highly intelligent pathing)
  else if (cycleProgress < 0.85) {
    const t_figure8 = (cycleProgress - 0.50) / 0.35
    const t_angle = t_figure8 * Math.PI * 2 * 1.5 
    const ellipseRadiusX = orbitSize * 0.8
    const ellipseRadiusY = orbitSize * 0.5
    const ellipseRadiusZ = orbitSize * 0.4
    const centerZ = -orbitSize * 0.3 

    currentMesh.position.x = originalPosition.x + ellipseRadiusX * Math.cos(t_angle) 
    currentMesh.position.y = originalPosition.y + ellipseRadiusY * Math.sin(t_angle * 2) * Math.sin(t * 0.8 + phase) * 0.2 + Math.sin(t_figure8 * Math.PI * 1.5) * 0.2 // Much slower oscillation
    currentMesh.position.z = originalPosition.z + centerZ + ellipseRadiusZ * Math.sin(t_angle)

    // Gentle observation rotations (50% slower than Phase 2)
    currentMesh.rotation.z = Math.sin(t_angle * 0.5) * 0.125 // 50% of 0.25
    currentMesh.rotation.x = Math.cos(t_angle * 0.7) * 0.075 // 50% of 0.15
    currentMesh.rotation.y += (t * 0.075 + phase) * 0.04 // 50% slower time & amplitude 
  }

  // PHASE 5: Swift Return & Re-entry (85% - 100%)
  // (Kept the same swift, graceful return)
  else {
    const t_return = (cycleProgress - 0.85) / 0.15
    const eased = easeInOutCubic(t_return) 

    currentMesh.position.x = THREE.MathUtils.lerp(currentMesh.position.x, originalPosition.x, eased)
    currentMesh.position.y = THREE.MathUtils.lerp(currentMesh.position.y, originalPosition.y, eased)
    currentMesh.position.z = THREE.MathUtils.lerp(currentMesh.position.z, originalPosition.z, eased)

    currentMesh.rotation.x = THREE.MathUtils.lerp(currentMesh.rotation.x, 0, eased * 0.5)
    currentMesh.rotation.y = THREE.MathUtils.lerp(currentMesh.rotation.y, 0, eased * 0.5)
    currentMesh.rotation.z = THREE.MathUtils.lerp(currentMesh.rotation.z, 0, eased * 0.5)

    currentMesh.scale.setScalar(1 + (1 - eased) * 0.05)
  }
    
  // Global Constraint: Ensure it stays in-frame
  const maxBoundary = 7; 
  currentMesh.position.x = THREE.MathUtils.clamp(currentMesh.position.x, originalPosition.x - maxBoundary, originalPosition.x + maxBoundary);
  currentMesh.position.y = THREE.MathUtils.clamp(currentMesh.position.y, originalPosition.y - maxBoundary, originalPosition.y + maxBoundary);
  currentMesh.position.z = THREE.MathUtils.clamp(currentMesh.position.z, originalPosition.z - maxBoundary, originalPosition.z + maxBoundary);
    
  // Update thick wireframe cylinders ONLY for unstructured geometries
  if (objData.thickCylinders && objData.edgePairs && geometry) {
    const isSphere = geometry.type === 'SphereGeometry';
    const isBox = geometry.type === 'BoxGeometry';
    const isOctahedron = geometry.type === 'OctahedronGeometry';
    const isTetrahedron = geometry.type === 'TetrahedronGeometry';
    const isIcosahedron = geometry.type === 'IcosahedronGeometry';
    const shouldMaintainStructure = isSphere || isBox || isOctahedron || isTetrahedron || isIcosahedron;
    
    if (!shouldMaintainStructure) {
      updateThickWireframeCylinders(objData);
    }
  }
  
  // Synchronize wireframe and centerLines with solidMesh
  if (wireframeMesh) {
    wireframeMesh.position.copy(solidMesh.position);
    wireframeMesh.rotation.copy(solidMesh.rotation);
    wireframeMesh.scale.copy(solidMesh.scale);
  }
  if (centerLines) {
    centerLines.position.copy(solidMesh.position);
    centerLines.rotation.copy(solidMesh.rotation);
    centerLines.scale.copy(solidMesh.scale);
  }
  if (curvedLines) {
    curvedLines.position.copy(solidMesh.position);
    curvedLines.rotation.copy(solidMesh.rotation);
    curvedLines.scale.copy(solidMesh.scale);
  }
    
  break
						case 'dna':
	// DNA Helix: Geometry-aware vertex morphing + rotation
	if (geometry && originalPositions && currentMesh === solidMesh) {
		const positions = geometry.attributes.position.array
		const type = geometry.type
		
		// Check if this is a structured geometry that should maintain its shape
		const isSphere = type === 'SphereGeometry';
		const isBox = type === 'BoxGeometry';
		const isOctahedron = type === 'OctahedronGeometry';
		const isTetrahedron = type === 'TetrahedronGeometry';
		const shouldMaintainStructure = isSphere || isBox || isOctahedron || isTetrahedron;
		
		if (!shouldMaintainStructure) {
			// Only deform unstructured geometries
			// For round shapes: use helical radial twist
			for (let i = 0; i < positions.length; i += 3) {
				const x = originalPositions[i]
				const y = originalPositions[i + 1]
				const z = originalPositions[i + 2]
				const radius = Math.sqrt(x * x + z * z)
				const angle = Math.atan2(z, x) + t * 0.5 + y * 0.3
				const helixRadius = radius + Math.sin(t * 2 + y * 2 + phase) * 0.2
				positions[i] = Math.cos(angle) * helixRadius
				positions[i + 1] = y + Math.sin(t * 1.5 + angle + phase) * 0.1
				positions[i + 2] = Math.sin(angle) * helixRadius
			}
			geometry.attributes.position.needsUpdate = true
		} else {
			// Structured geometries: keep original positions
			for (let i = 0; i < positions.length; i++) {
				positions[i] = originalPositions[i];
			}
			geometry.attributes.position.needsUpdate = true
		}
		
		// UPDATE INTRICATE WIREFRAME TO FOLLOW MORPHED SURFACE - DNA
		if (centerLines && curvedLines) {
			if (geometry.type === 'TetrahedronGeometry') {
				const centerLinesGeom = centerLines.geometry
				if (centerLinesGeom && centerLinesGeom.attributes.position) {
					const centerLinesPos = centerLinesGeom.attributes.position.array
					const vertices = []
					for (let v = 0; v < 4; v++) {
						vertices.push([positions[v * 3], positions[v * 3 + 1], positions[v * 3 + 2]])
					}
					const innerVertices = vertices.map(vertex => [vertex[0] * 0.5, vertex[1] * 0.5, vertex[2] * 0.5])
					const edges = [[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]]
					edges.forEach(([i, j], edgeIndex) => {
						const baseIndex = edgeIndex * 6
						centerLinesPos[baseIndex] = innerVertices[i][0]
						centerLinesPos[baseIndex + 1] = innerVertices[i][1]
						centerLinesPos[baseIndex + 2] = innerVertices[i][2]
						centerLinesPos[baseIndex + 3] = innerVertices[j][0]
						centerLinesPos[baseIndex + 4] = innerVertices[j][1]
						centerLinesPos[baseIndex + 5] = innerVertices[j][2]
					})
					centerLinesGeom.attributes.position.needsUpdate = true
				}
				
				const curvedLinesGeom = curvedLines.geometry
				if (curvedLinesGeom && curvedLinesGeom.attributes.position) {
					const curvedLinesPos = curvedLinesGeom.attributes.position.array
					const tetraEdges = [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]]
					tetraEdges.forEach(([i, j], edgeIndex) => {
						const baseIndex = edgeIndex * 6
						const innerScale = 0.5
						curvedLinesPos[baseIndex] = positions[i * 3] * innerScale
						curvedLinesPos[baseIndex + 1] = positions[i * 3 + 1] * innerScale
						curvedLinesPos[baseIndex + 2] = positions[i * 3 + 2] * innerScale
						curvedLinesPos[baseIndex + 3] = positions[j * 3]
						curvedLinesPos[baseIndex + 4] = positions[j * 3 + 1]
						curvedLinesPos[baseIndex + 5] = positions[j * 3 + 2]
					})
					curvedLinesGeom.attributes.position.needsUpdate = true
				}
			} else if (geometry.type === 'OctahedronGeometry') {
				const centerLinesGeom = centerLines.geometry
				if (centerLinesGeom && centerLinesGeom.attributes.position) {
					const centerLinesPos = centerLinesGeom.attributes.position.array
					const vertices = []
					for (let v = 0; v < 6; v++) {
						vertices.push([positions[v * 3], positions[v * 3 + 1], positions[v * 3 + 2]])
					}
					const innerVertices = vertices.map(vertex => [vertex[0] * 0.5, vertex[1] * 0.5, vertex[2] * 0.5])
					const edges = [[0,2],[0,3],[0,4],[0,5],[1,2],[1,3],[1,4],[1,5],[2,3],[3,4],[4,5],[5,2]]
					edges.forEach(([i, j], edgeIndex) => {
						const baseIndex = edgeIndex * 6
						centerLinesPos[baseIndex] = innerVertices[i][0]
						centerLinesPos[baseIndex + 1] = innerVertices[i][1]
						centerLinesPos[baseIndex + 2] = innerVertices[i][2]
						centerLinesPos[baseIndex + 3] = innerVertices[j][0]
						centerLinesPos[baseIndex + 4] = innerVertices[j][1]
						centerLinesPos[baseIndex + 5] = innerVertices[j][2]
					})
					centerLinesGeom.attributes.position.needsUpdate = true
				}
				
				const curvedLinesGeom = curvedLines.geometry
				if (curvedLinesGeom && curvedLinesGeom.attributes.position) {
					const curvedLinesPos = curvedLinesGeom.attributes.position.array
					for (let v = 0; v < 6; v++) {
						const baseIndex = v * 6
						const innerScale = 0.5
						curvedLinesPos[baseIndex] = positions[v * 3] * innerScale
						curvedLinesPos[baseIndex + 1] = positions[v * 3 + 1] * innerScale
						curvedLinesPos[baseIndex + 2] = positions[v * 3 + 2] * innerScale
						curvedLinesPos[baseIndex + 3] = positions[v * 3]
						curvedLinesPos[baseIndex + 4] = positions[v * 3 + 1]
						curvedLinesPos[baseIndex + 5] = positions[v * 3 + 2]
					}
					curvedLinesGeom.attributes.position.needsUpdate = true
				}
			} else {
				// GENERAL WIREFRAME SYNCHRONIZATION for other geometry types (sphere, box, etc.)
				
				// Update wireframe cylinders to follow the morphed mesh - DNA animation
				if (wireframeMesh && wireframeMesh.isGroup && objData.edgePairs) {
					const cylinders = wireframeMesh.children?.filter((c) => c.isMesh) || [];
					const n = Math.min(objData.edgePairs.length, cylinders.length);
					
					for (let k = 0; k < n; k++) {
						const cyl = cylinders[k];
						const [iA, iB] = objData.edgePairs[k];
						
						// Get current deformed vertex positions directly
						const vA = new THREE.Vector3(
							positions[iA * 3],
							positions[iA * 3 + 1], 
							positions[iA * 3 + 2]
						);
						const vB = new THREE.Vector3(
							positions[iB * 3],
							positions[iB * 3 + 1],
							positions[iB * 3 + 2]
						);
						
						// Update cylinder position to midpoint of deformed vertices
						const midpoint = vA.clone().add(vB).multiplyScalar(0.5);
						cyl.position.copy(midpoint);
						
						// Update cylinder rotation to align with deformed edge direction
						const direction = vB.clone().sub(vA).normalize();
						const up = new THREE.Vector3(0, 1, 0);
						const rotationMatrix = new THREE.Matrix4();
						rotationMatrix.lookAt(new THREE.Vector3(), direction, up);
						cyl.setRotationFromMatrix(rotationMatrix);
						cyl.rotateX(Math.PI / 2); // Adjust for cylinder's default orientation
						
						// Update cylinder scale to match deformed edge length
						const len = vA.distanceTo(vB);
						const base = cyl.userData.baseLength ?? (cyl.geometry?.parameters?.height || len);
						cyl.userData.baseLength = base;
						cyl.scale.set(1, len / base, 1);
						
						// Apply wireframe intensity
						if (cyl.material && wireframeIntensity !== undefined) {
							cyl.material.opacity = wireframeIntensity / 100;
							cyl.material.visible = wireframeIntensity > 0;
						}
					}
				}
				
				const centerLinesGeom = centerLines.geometry
				if (centerLinesGeom && centerLinesGeom.attributes.position) {
					const centerLinesPos = centerLinesGeom.attributes.position.array
					let lineIndex = 0
					for (let i = 1; i < centerLinesPos.length; i += 6) {
						const vertexIndex = lineIndex * 9
						if (vertexIndex < positions.length) {
							centerLinesPos[i] = positions[vertexIndex]
							centerLinesPos[i + 1] = positions[vertexIndex + 1]
							centerLinesPos[i + 2] = positions[vertexIndex + 2]
						}
						lineIndex++
					}
					centerLinesGeom.attributes.position.needsUpdate = true
				}
				
				const curvedLinesGeom = curvedLines.geometry
				if (curvedLinesGeom && curvedLinesGeom.attributes.position) {
					const curvedLinesPos = curvedLinesGeom.attributes.position.array
					for (let i = 0; i < curvedLinesPos.length; i += 6) {
						const vertex1Index = Math.floor((i / 6) * 30)
						const vertex2Index = vertex1Index + 30
						if (vertex1Index < positions.length && vertex2Index < positions.length) {
							const x1 = positions[vertex1Index]
							const y1 = positions[vertex1Index + 1]
							const z1 = positions[vertex1Index + 2]
							const x2 = positions[vertex2Index]
							const y2 = positions[vertex2Index + 1]
							const z2 = positions[vertex2Index + 2]
							const distance = Math.sqrt((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1) + (z2-z1)*(z2-z1))
							let shouldShow = distance < 0.8 && distance > 0.1
							if (geometry.type === 'TorusKnotGeometry' && shouldShow) {
								const centerDistance1 = Math.sqrt(x1*x1 + z1*z1)
								const centerDistance2 = Math.sqrt(x2*x2 + z2*z2)
								const centerDistanceDiff = Math.abs(centerDistance1 - centerDistance2)
								shouldShow = centerDistanceDiff < 0.5
							}
							if (shouldShow) {
								curvedLinesPos[i] = x1
								curvedLinesPos[i + 1] = y1
								curvedLinesPos[i + 2] = z1
								curvedLinesPos[i + 3] = x2
								curvedLinesPos[i + 4] = y2
								curvedLinesPos[i + 5] = z2
							} else {
								curvedLinesPos[i] = 0
								curvedLinesPos[i + 1] = 0
								curvedLinesPos[i + 2] = 0
								curvedLinesPos[i + 3] = 0
								curvedLinesPos[i + 4] = 0
								curvedLinesPos[i + 5] = 0
							}
						}
					}
					curvedLinesGeom.attributes.position.needsUpdate = true
				}
			}
		}
	}
	
	currentMesh.scale.setScalar(1 + 0.2 * Math.sin(t * 1.5 + phase))
	currentMesh.rotation.x += Math.sin(t * 0.3) * 0.01
	currentMesh.rotation.y += Math.cos(t * 0.4) * 0.01
	currentMesh.position.copy(originalPosition)
	break
					case 'magnetic':
						// Magnetic Field: Vertices attracted/repelled by moving magnetic points
						if (geometry && originalPositions && magneticPoints) {
							const positions = geometry.attributes.position.array
							
							// Move magnetic points around
							magneticPoints.forEach((point, pIndex) => {
								point.x = Math.sin(t * 0.5 + pIndex * 2) * 3
								point.y = Math.cos(t * 0.7 + pIndex * 2) * 2
								point.z = Math.sin(t * 0.3 + pIndex * 3) * 3
							})
							
							for (let i = 0; i < positions.length; i += 3) {
								const x = originalPositions[i]
								const y = originalPositions[i + 1]
								const z = originalPositions[i + 2]
								
								let totalForceX = 0, totalForceY = 0, totalForceZ = 0
								
								// Calculate magnetic forces from each point
								magneticPoints.forEach(point => {
									const dx = x - point.x
									const dy = y - point.y
									const dz = z - point.z
									const distance = Math.sqrt(dx * dx + dy * dy + dz * dz) + 0.1
									const force = point.strength / (distance * distance)
									
									const direction = Math.sin(t + point.x + point.y) > 0 ? -1 : 1
									
									totalForceX += (dx / distance) * force * direction
									totalForceY += (dy / distance) * force * direction
									totalForceZ += (dz / distance) * force * direction
								})
								
								positions[i] = x + totalForceX * 0.3
								positions[i + 1] = y + totalForceY * 0.3
								positions[i + 2] = z + totalForceZ * 0.3
							}
							geometry.attributes.position.needsUpdate = true								// UPDATE INTRICATE WIREFRAME TO FOLLOW MORPHED SURFACE - MAGNETIC
								if (currentMesh === solidMesh && centerLines && curvedLines) {
									if (geometry.type === 'TetrahedronGeometry') {
										// TETRAHEDRON: Update hyper-tetrahedron wireframes during magnetic morphing
										
										// Update inner tetrahedron edges (red lines)
										const centerLinesGeom = centerLines.geometry
										if (centerLinesGeom && centerLinesGeom.attributes.position) {
											const centerLinesPos = centerLinesGeom.attributes.position.array
											
											// Get current morphed vertices
											const vertices = []
											for (let v = 0; v < 4; v++) {
												vertices.push([
													positions[v * 3],
													positions[v * 3 + 1], 
													positions[v * 3 + 2]
												])
											}
											
											// Update inner tetrahedron vertices (scaled 0.5x)
											const innerVertices = vertices.map(vertex => [
												vertex[0] * 0.5,
												vertex[1] * 0.5,
												vertex[2] * 0.5
											])
											
											// Update the 6 inner tetrahedron edges
											const edges = [[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]]
											edges.forEach(([i, j], edgeIndex) => {
												const baseIndex = edgeIndex * 6
												centerLinesPos[baseIndex] = innerVertices[i][0]
												centerLinesPos[baseIndex + 1] = innerVertices[i][1]
												centerLinesPos[baseIndex + 2] = innerVertices[i][2]
												centerLinesPos[baseIndex + 3] = innerVertices[j][0]
												centerLinesPos[baseIndex + 4] = innerVertices[j][1]
												centerLinesPos[baseIndex + 5] = innerVertices[j][2]
											})
											
											centerLinesGeom.attributes.position.needsUpdate = true
										}
										
										// Update vertex connections (green lines)
										const curvedLinesGeom = curvedLines.geometry
										if (curvedLinesGeom && curvedLinesGeom.attributes.position) {
											const curvedLinesPos = curvedLinesGeom.attributes.position.array
											
											// Update the 4 vertex-to-vertex connections
											for (let v = 0; v < 4; v++) {
												const baseIndex = v * 6
												const innerScale = 0.5
												
												// Inner vertex
												curvedLinesPos[baseIndex] = positions[v * 3] * innerScale
												curvedLinesPos[baseIndex + 1] = positions[v * 3 + 1] * innerScale
												curvedLinesPos[baseIndex + 2] = positions[v * 3 + 2] * innerScale
												
												// Outer vertex
												curvedLinesPos[baseIndex + 3] = positions[v * 3]
												curvedLinesPos[baseIndex + 4] = positions[v * 3 + 1]
												curvedLinesPos[baseIndex + 5] = positions[v * 3 + 2]
											}
											
											curvedLinesGeom.attributes.position.needsUpdate = true
										}
									} else if (geometry.type === 'OctahedronGeometry') {
										// OCTAHEDRON: Update hyper-octahedron wireframes during magnetic morphing
										
										// Update inner octahedron edges (red lines)
										const centerLinesGeom = centerLines.geometry
										if (centerLinesGeom && centerLinesGeom.attributes.position) {
											const centerLinesPos = centerLinesGeom.attributes.position.array
											
											// Get current morphed vertices (octahedron has 6 vertices)
											const vertices = []
											for (let v = 0; v < 6; v++) {
												vertices.push([
													positions[v * 3],
													positions[v * 3 + 1], 
													positions[v * 3 + 2]
												])
											}
											
											// Update inner octahedron vertices (scaled 0.5x)
											const innerVertices = vertices.map(vertex => [
												vertex[0] * 0.5,
												vertex[1] * 0.5,
												vertex[2] * 0.5
											])
											
											// Update the 12 inner octahedron edges
											const edges = [
												[0,2],[0,3],[0,4],[0,5],  // Top vertex to equatorial vertices
												[1,2],[1,3],[1,4],[1,5],  // Bottom vertex to equatorial vertices
												[2,3],[3,4],[4,5],[5,2]   // Equatorial edge loop
											]
											edges.forEach(([i, j], edgeIndex) => {
												const baseIndex = edgeIndex * 6
												centerLinesPos[baseIndex] = innerVertices[i][0]
												centerLinesPos[baseIndex + 1] = innerVertices[i][1]
												centerLinesPos[baseIndex + 2] = innerVertices[i][2]
												centerLinesPos[baseIndex + 3] = innerVertices[j][0]
												centerLinesPos[baseIndex + 4] = innerVertices[j][1]
												centerLinesPos[baseIndex + 5] = innerVertices[j][2]
											})
											
											centerLinesGeom.attributes.position.needsUpdate = true
										}
										
										// Update vertex connections (green lines)
										const curvedLinesGeom = curvedLines.geometry
										if (curvedLinesGeom && curvedLinesGeom.attributes.position) {
											const curvedLinesPos = curvedLinesGeom.attributes.position.array
											
											// Update the 6 vertex-to-vertex connections
											for (let v = 0; v < 6; v++) {
												const baseIndex = v * 6
												const innerScale = 0.5
												
												// Inner vertex
												curvedLinesPos[baseIndex] = positions[v * 3] * innerScale
												curvedLinesPos[baseIndex + 1] = positions[v * 3 + 1] * innerScale
												curvedLinesPos[baseIndex + 2] = positions[v * 3 + 2] * innerScale
												
												// Outer vertex
												curvedLinesPos[baseIndex + 3] = positions[v * 3]
												curvedLinesPos[baseIndex + 4] = positions[v * 3 + 1]
												curvedLinesPos[baseIndex + 5] = positions[v * 3 + 2]
											}
											
											curvedLinesGeom.attributes.position.needsUpdate = true
										}
									} else {
										// OTHER GEOMETRIES: Use existing update logic
										// Update center lines to follow morphed vertices
										const centerLinesGeom = centerLines.geometry
										if (centerLinesGeom && centerLinesGeom.attributes.position) {
											const centerLinesPos = centerLinesGeom.attributes.position.array
											let lineIndex = 0
											
											// Update every other point (the vertex endpoints) to match morphed surface
										for (let i = 1; i < centerLinesPos.length; i += 6) { // Every second point (vertex endpoints)
											const vertexIndex = lineIndex * 9 // Match the original vertex stepping
											if (vertexIndex < positions.length) {
												centerLinesPos[i] = positions[vertexIndex]     // X
												centerLinesPos[i + 1] = positions[vertexIndex + 1] // Y  
												centerLinesPos[i + 2] = positions[vertexIndex + 2] // Z
											}
											lineIndex++
										}
										centerLinesGeom.attributes.position.needsUpdate = true
									}
									
									// Update curved lines to follow morphed vertices
									const curvedLinesGeom = curvedLines.geometry
									if (curvedLinesGeom && curvedLinesGeom.attributes.position) {
										// Update existing curved line endpoints smoothly every frame with validation
										const curvedLinesPos = curvedLinesGeom.attributes.position.array
										
										// Update each line segment, but validate the connection is still appropriate
										for (let i = 0; i < curvedLinesPos.length; i += 6) {
											// Get the vertex indices for this line
											const vertex1Index = Math.floor((i / 6) * 30)
											const vertex2Index = vertex1Index + 30
											
											if (vertex1Index < positions.length && vertex2Index < positions.length) {
												const x1 = positions[vertex1Index]
												const y1 = positions[vertex1Index + 1]
												const z1 = positions[vertex1Index + 2]
												const x2 = positions[vertex2Index]
												const y2 = positions[vertex2Index + 1]
												const z2 = positions[vertex2Index + 2]
												
												// Check if this connection is still valid
												const distance = Math.sqrt((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1) + (z2-z1)*(z2-z1))
												let shouldShow = distance < 0.8 && distance > 0.1
												
												// For torus, check center distance to avoid cross-hole connections
												if (geometry.type === 'TorusKnotGeometry' && shouldShow) {
													const centerDistance1 = Math.sqrt(x1*x1 + z1*z1)
													const centerDistance2 = Math.sqrt(x2*x2 + z2*z2)
													const centerDistanceDiff = Math.abs(centerDistance1 - centerDistance2)
													shouldShow = centerDistanceDiff < 0.5
												}
												
												if (shouldShow) {
													// Update the line endpoints
													curvedLinesPos[i] = x1
													curvedLinesPos[i + 1] = y1
													curvedLinesPos[i + 2] = z1
													curvedLinesPos[i + 3] = x2
													curvedLinesPos[i + 4] = y2
													curvedLinesPos[i + 5] = z2
												} else {
													// Hide invalid connections by collapsing them to a single point
													curvedLinesPos[i] = 0
													curvedLinesPos[i + 1] = 0
													curvedLinesPos[i + 2] = 0
													curvedLinesPos[i + 3] = 0
													curvedLinesPos[i + 4] = 0
													curvedLinesPos[i + 5] = 0
												}
											}
										}
										curvedLinesGeom.attributes.position.needsUpdate = true
									}
									} // Close the else block for non-tetrahedron geometries
								} // Close the if (currentMesh === solidMesh && centerLines && curvedLines) block
								
								// Update wireframe cylinders to follow deformed vertices
								if (currentMesh === solidMesh && wireframeMesh && wireframeMesh.isGroup && objData.edgePairs) {
									const cylinders = wireframeMesh.children?.filter((c) => c.isMesh) || [];
									const edgePairs = objData.edgePairs;
									const positions = geometry.attributes.position.array;
									
									for (let k = 0; k < Math.min(edgePairs.length, cylinders.length); k++) {
										const cyl = cylinders[k];
										const [iA, iB] = edgePairs[k];
										
										// Get deformed vertex positions
										const vA = new THREE.Vector3(
											positions[iA * 3],
											positions[iA * 3 + 1],
											positions[iA * 3 + 2]
										);
										const vB = new THREE.Vector3(
											positions[iB * 3],
											positions[iB * 3 + 1],
											positions[iB * 3 + 2]
										);
										
										// Update cylinder position (midpoint)
										cyl.position.copy(vA).add(vB).multiplyScalar(0.5);
										
										// Update cylinder orientation
										const direction = vB.clone().sub(vA);
										const length = direction.length() || 1e-6;
										const up = new THREE.Vector3(0, 1, 0);
										const quaternion = new THREE.Quaternion();
										quaternion.setFromUnitVectors(up, direction.normalize());
										cyl.quaternion.copy(quaternion);
										
										// Update cylinder scale to match deformed length
										const baseLength = cyl.userData.baseLength ?? (cyl.geometry?.parameters?.height || length);
										cyl.userData.baseLength = baseLength;
										cyl.scale.set(1, length / baseLength, 1);
									}
								}
						} // Close the if (geometry && originalPositions && magneticPoints) block
						
						// For geometries with thick wireframes, don't rotate - deformation provides the motion
						const hasThickWireframe = geometry && (
							geometry.type === 'SphereGeometry' || 
							geometry.type === 'BoxGeometry' || 
							geometry.type === 'OctahedronGeometry' || 
							geometry.type === 'TetrahedronGeometry' ||
							geometry.type === 'IcosahedronGeometry'
						);
						
						if (!hasThickWireframe) {
							currentMesh.rotation.y = t * 0.3 + phase
							currentMesh.rotation.x = Math.sin(t * 0.2) * 0.2
						}
						currentMesh.position.copy(originalPosition)
						break
					}
				}) // Close meshesToAnimate.forEach
			}) // Close objectsRef.current.forEach

			// DYNAMIC CAMERA MOVEMENT for certain views
			if (cameraView === 'orbit') {
				const orbitRadius = 8
				camera.position.x = Math.cos(t * 0.3) * orbitRadius
				camera.position.z = Math.sin(t * 0.3) * orbitRadius
				camera.lookAt(0, 0, 0)
			} else if (cameraView === 'cinematic') {
				camera.position.x = -3 + Math.sin(t * 0.1) * 1
				camera.position.y = 2 + Math.cos(t * 0.15) * 0.5
				camera.lookAt(0, 0, 0)
			}

			// RENDER THE FRAME
			rendererRef.current.render(scene, camera)
		}

		animate() // Start the animation loop

		// CLEANUP - Cancel animation when effect re-runs or component unmounts
		return () => {
			if (animationIdRef.current) {
				cancelAnimationFrame(animationIdRef.current)
			}
		}
	}, [animationStyle, cameraView]) // Run when animationStyle or cameraView props from App.jsx change

	// ===============================================
	// RENDER METHOD - WHAT GETS DISPLAYED IN THE DOM
	// ===============================================
	// This component renders a parent div with a CSS gradient background, and the Three.js canvas inside
	// Helper: map environment names to CSS class names
	function getBackgroundClass(env) {
		switch (env) {
			case 'nebula': return 'bg-gradient bg-gradient-nebula';
			case 'space': return 'bg-gradient bg-gradient-space';
			case 'sunset': return 'bg-gradient bg-gradient-sunset';
			case 'matrix': return 'bg-gradient bg-gradient-matrix';
			default: return 'bg-gradient bg-gradient-default';
		}
	}

	return (
		<div className={getBackgroundClass(environment)}>
			<div ref={mountRef} className="three-scene-container" />
		</div>
	);
}



export default ThreeScene

/*
=================================================================
SUMMARY: HOW THREESCENE.JSX RECEIVES AND USES PROPS FROM APP.JSX
=================================================================

1. PROPS FLOW IN FROM APP.JSX
	 - All the values (shininess, colors, counts, etc.) come from App.jsx state
	 - When App.jsx state changes, this component automatically re-renders

2. USEEFFECTS LISTEN FOR SPECIFIC PROP CHANGES
	 - Each useEffect has a dependency array that lists which props it cares about
	 - When those specific props change, only that useEffect runs (not the whole component)

3. PROPS GET CONVERTED TO THREE.JS ACTIONS
	 - shininess prop → material.shininess property
	 - specularColor prop → material.specular.setHex() call
	 - objectCount prop → creates that many 3D objects
	 - animationStyle prop → determines which animation code runs

4. THE REACT → THREE.JS BRIDGE
	 - React handles the UI state and prop flow
	 - Three.js handles the 3D rendering and animation
	 - useRef stores Three.js objects that persist between React re-renders
	 - useEffect bridges React prop changes to Three.js object updates

5. KEY INSIGHT: SEPARATION OF CONCERNS
	 - App.jsx = Data management (what the values should be)
	 - Controls.jsx = User interface (how users change the values)  
	 - ThreeScene.jsx = Visual rendering (how the values look in 3D)

FLOW: User interacts with Controls.jsx → Controls.jsx calls App.jsx setters → App.jsx updates state → ThreeScene.jsx receives new props → useEffects update Three.js objects → 3D scene re-renders
*/