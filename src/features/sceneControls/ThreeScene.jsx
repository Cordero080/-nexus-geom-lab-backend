import { updateEnvironment } from './environmentSetup';
import { __UP, __Q, __TMP, __A, __B, __M, __Inv, nearestVertexIndex, updateThickWireframeCylinders } from '../../utils/geometryHelpers';
import React from 'react';
import './ThreeScene.css';
import { use, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { initializeScene } from './sceneSetup';
import { initializeLighting } from './lightingSetup';
import { createGeometryByType } from './geometryCreation';
import { startAnimationLoop } from './animationLoop';



// ========================================================================
// THREESCENE.JSX - THE 3D RENDERER (RECEIVES PROPS FROM APP.JSX)
// ========================================================================
// This component ONLY receives data - it doesn't manage any state itself.
// All the values come from App.jsx as props, and when App.jsx changes them,
// this component automatically re-renders the 3D scene with new values.

function ThreeScene({ 
	// MATERIAL PROPS - How the 3D objects should look (FROM App.jsx state)
	scale,                 // Current scale value → will update Three.js object scale
	shininess,           // Current shininess value → will update Three.js material.shininess
	specularColor,       // Current specular color → will update Three.js material.specular
	specularIntensity,   // Current specular intensity → will update Three.js material.reflectivity
	baseColor,           // Current base color → will update Three.js material.color
	wireframeIntensity,  // Current wireframe intensity → will update Three.js material.wireframe
	
	// INTRICATE WIREFRAME PROPS - How the intricate wireframe should look (FROM App.jsx state)
	intricateWireframeSpiralColor,  // Current spiral color → will update intricate wireframe spiral lines
	intricateWireframeEdgeColor,    // Current edge color → will update intricate wireframe edge connections
	
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
		shininess,
		specularColor,
		specularIntensity,
		baseColor,
		wireframeIntensity,
		intricateWireframeSpiralColor,
		intricateWireframeEdgeColor,
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
	// INITIAL SETUP - RUNS ONCE WHEN COMPONENT MOUNTS
	// =============================================
	// This useEffect has an empty dependency array [], so it only runs once
	// It sets up the basic Three.js scene structure that won't change
	
	useEffect(() => {
		// 1. CREATE SCENE - The 3D world container
		const { scene, camera, renderer } = initializeScene();
		sceneRef.current = scene;
		cameraRef.current = camera;
		rendererRef.current = renderer;
		mountRef.current.appendChild(renderer.domElement);

		// 4. CREATE LIGHTS - Using current prop values from App.jsx
		// Convert hex color strings (like "#ff0000") to Three.js color numbers
		const ambientLightColorHex = parseInt(ambientLightColor.replace('#', ''), 16)
		const directionalLightColorHex = parseInt(directionalLightColor.replace('#', ''), 16)
		
		// Create lights with current App.jsx values
		const { ambientLight, directionalLight } = initializeLighting({
			ambientLightColor, 
			ambientLightIntensity, 
			directionalLightColor, 
			directionalLightIntensity, 
			directionalLightPosition: { x: directionalLightX, y: directionalLightY, z: directionalLightZ },
		});
		
		// Store lights in refs so we can update them later when App.jsx props change
		ambientLightRef.current = ambientLight
		directionalLightRef.current = directionalLight
		
		// Add lights to the scene
		scene.add(ambientLight)
		scene.add(directionalLight)

		// 5. START ANIMATION LOOP - Continuously render the scene
		startAnimationLoop(renderer, scene, camera, animationIdRef);

		// 6. HANDLE WINDOW RESIZE - Keep canvas matching screen size
		const handleResize = () => {
			camera.aspect = window.innerWidth / window.innerHeight
			camera.updateProjectionMatrix()
			renderer.setSize(window.innerWidth, window.innerHeight)
		}
		window.addEventListener('resize', handleResize)

		// 7. CLEANUP FUNCTION - Runs when component unmounts
		// Important: Clean up Three.js objects to prevent memory leaks
		return () => {
			window.removeEventListener('resize', handleResize)
			if (animationIdRef.current) {
				cancelAnimationFrame(animationIdRef.current)
			}
			if (mountRef.current && renderer.domElement) {
				mountRef.current.removeChild(renderer.domElement)
			}
			renderer.dispose()
		}
	}, []) // Empty dependency array = run once on mount

	// ===============================================
	// GEOMETRY CREATION HELPER FUNCTION
	// ===============================================
	
	// ===============================================
	// ENVIRONMENT UPDATER - RESPONDS TO environment PROP
	// ===============================================
	// When App.jsx changes the environment prop, this useEffect runs
	// and updates the scene background accordingly
	
	// Scale updater - responds to scale prop changes
	useEffect(() => {
		objectsRef.current.forEach(({ solidMesh, wireframeMesh, centerLines, curvedLines, mesh }) => {
			// Handle dual-mesh objects
			if (solidMesh) {
				solidMesh.scale.setScalar(scale)
			}
			if (wireframeMesh) {
				wireframeMesh.scale.setScalar(scale)
			}
			// Handle intricate wireframe elements
			if (centerLines) {
				centerLines.scale.setScalar(scale)
			}
			if (curvedLines) {
				curvedLines.scale.setScalar(scale)
			}
			// Handle legacy single mesh objects
			if (mesh) {
				mesh.scale.setScalar(scale)
			}
		})
	}, [scale])


	// Remove all canvas background creation. Just set scene.background to null for transparency.
	useEffect(() => {
		if (!sceneRef.current) return;
		sceneRef.current.background = null;
	}, [environment]);

	// ...existing code...

	// ===============================================
	// OBJECTS CREATOR - RESPONDS TO MULTIPLE PROPS
	// ===============================================
	// When App.jsx changes objectCount, baseColor, specularColor, etc., this useEffect runs
	// and recreates all the 3D objects with the new values
	
	useEffect(() => {
		if (!sceneRef.current) return; // Safety check

		const scene = sceneRef.current
		
		// REMOVE OLD OBJECTS from scene and clear our reference array
		objectsRef.current.forEach(obj => {
			// Remove solid and wireframe meshes
			if (obj.solidMesh) scene.remove(obj.solidMesh)
			if (obj.wireframeMesh) scene.remove(obj.wireframeMesh)
			// Remove intricate wireframe elements
			if (obj.centerLines) scene.remove(obj.centerLines)
			if (obj.curvedLines) scene.remove(obj.curvedLines)
			// Also handle legacy single mesh objects
			if (obj.mesh) scene.remove(obj.mesh)
		})
		objectsRef.current = []

		// CREATE NEW OBJECTS USING CURRENT APP.JSX PROP VALUES
		for (let i = 0; i < objectCount; i++) { // Use objectCount prop from App.jsx
			
			// CHOOSE GEOMETRY based on objectType prop from App.jsx
			let geometry
			if (objectCount === 1) {
				// Single object: use the selected objectType from App.jsx
				geometry = createGeometryByType(objectType)
			} else {
				// Multiple objects: cycle through different types for variety
				const geometryTypes = [
					() => new THREE.IcosahedronGeometry(),
					() => new THREE.SphereGeometry(1, 16, 16),
					() => new THREE.BoxGeometry(1.5, 1.5, 1.5),
					() => new THREE.OctahedronGeometry(),
					() => new THREE.TetrahedronGeometry(1.2),
					() => new THREE.TorusKnotGeometry(1, .2, 150, 16),
				]
				geometry = geometryTypes[i % geometryTypes.length]()
			}
			
			// Store original vertex positions for advanced animations
			const originalPositions = geometry.attributes.position.array.slice()
			
			// CREATE SOLID MATERIAL using current App.jsx prop values
			const currentBaseColor = new THREE.Color(baseColor)           // Convert App.jsx baseColor prop
			const currentSpecularColor = new THREE.Color(specularColor)   // Convert App.jsx specularColor prop
			
			const material = new THREE.MeshPhongMaterial({
				color: currentBaseColor,                    // Use baseColor prop from App.jsx
				specular: currentSpecularColor,             // Use specularColor prop from App.jsx
				shininess: shininess,                       // Use shininess prop from App.jsx
				wireframe: false,                           // Solid material is NEVER wireframe
				transparent: true,                          // Always transparent for blending
				opacity: 1 - (wireframeIntensity / 100),   // Start with inverse of wireframe intensity
				flatShading: false,
				reflectivity: specularIntensity,            // Use specularIntensity prop from App.jsx
			})

			// CREATE TWO MESHES - One solid, one wireframe for blending
			const solidMesh = new THREE.Mesh(geometry, material)
			
			let wireframeMesh
			let wireframeMaterial // Make sure this is available for all geometry types

			if (geometry.type === 'SphereGeometry') {
				// CUSTOM THICK WIREFRAME for SphereGeometry
				wireframeMaterial = new THREE.MeshPhongMaterial({
					color: currentBaseColor,
					specular: currentSpecularColor,
					shininess: shininess,
					transparent: true,
					opacity: wireframeIntensity / 100,
					flatShading: false,
					reflectivity: specularIntensity,
				})
				// Create thick wireframe using cylinders for sphere edges
				const edgesGeometry = new THREE.EdgesGeometry(geometry)
				const edgeVertices = edgesGeometry.attributes.position.array
				const sphereWireframeGroup = new THREE.Group()
				const sphereEdgePairs = []
				for (let j = 0; j < edgeVertices.length; j += 6) {
					const start = new THREE.Vector3(edgeVertices[j], edgeVertices[j+1], edgeVertices[j+2])
					const end = new THREE.Vector3(edgeVertices[j+3], edgeVertices[j+4], edgeVertices[j+5])
					const distance = start.distanceTo(end)
					// Create thick cylinder for sphere edge - ADJUST 0.012 TO CHANGE THICKNESS
					const cylinderGeom = new THREE.CylinderGeometry(0.005, 0.005, distance, 8)
					const cylinderMesh = new THREE.Mesh(cylinderGeom, wireframeMaterial)
					cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5))
					cylinderMesh.lookAt(end)
					cylinderMesh.rotateX(Math.PI / 2)
					cylinderMesh.userData.baseLength = distance;
					const iA_s = nearestVertexIndex(geometry, start);
					const iB_s = nearestVertexIndex(geometry, end);
					sphereEdgePairs.push([iA_s, iB_s]);
					sphereWireframeGroup.add(cylinderMesh)
				}
				sphereWireframeGroup.userData.edgePairs = sphereEdgePairs;
				wireframeMesh = sphereWireframeGroup
				console.log('Created thick wireframe for sphere with', edgeVertices.length / 6, 'cylinder edges')
			} else if (geometry.type === 'BoxGeometry') {
				// CUSTOM THICK WIREFRAME for BoxGeometry
				wireframeMaterial = new THREE.MeshPhongMaterial({
					color: currentBaseColor,
					specular: currentSpecularColor,
					shininess: shininess,
					transparent: true,
					opacity: wireframeIntensity / 100,
					flatShading: false,
					reflectivity: specularIntensity,
				})
				
				// Create thick wireframe using cylinders for cube edges
				const cubeWireframeGroup = new THREE.Group()
				const cubeEdgePairs = []
				
				// Get the 8 corners of the cube
				const size = 0.75 // Half of 1.5
				const cubeCorners = [
					[-size, -size, -size], [size, -size, -size], [size, size, -size], [-size, size, -size], // Back face
					[-size, -size, size], [size, -size, size], [size, size, size], [-size, size, size] 
						// Front face
				]
				
				// Define the 12 edges of the cube
				const cubeEdges = [
					// Back face edges
					[0, 1], [1, 2], [2, 3], [3, 0],
					// Front face edges  
					[4, 5], [5, 6], [6, 7], [7, 4],
					// Connecting edges between front and back
					[0, 4], [1, 5], [2, 6], [3, 7]
				]
				
				// Create cylinder for each cube edge
				cubeEdges.forEach(([i, j]) => {
					const start = new THREE.Vector3(...cubeCorners[i])
					const end = new THREE.Vector3(...cubeCorners[j])
					const distance = start.distanceTo(end)
					
						// Create thick cylinder for cube edge - ADJUST 0.018 TO CHANGE MAIN WIREFRAME THICKNESS
						const cylinderGeom = new THREE.CylinderGeometry(0.015, 0.015, distance, 8)
					const cylinderMesh = new THREE.Mesh(cylinderGeom, wireframeMaterial)
					
					// Position cylinder between start and end points
					cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5))
					cylinderMesh.lookAt(end)
					cylinderMesh.rotateX(Math.PI / 2)
					
					cylinderMesh.userData.baseLength = distance;
					const iA_c = nearestVertexIndex(geometry, start);
					const iB_c = nearestVertexIndex(geometry, end);
					cubeEdgePairs.push([iA_c, iB_c]);
					cubeWireframeGroup.add(cylinderMesh)
				})
				
				cubeWireframeGroup.userData.edgePairs = cubeEdgePairs;
				wireframeMesh = cubeWireframeGroup
				console.log('Created thick wireframe for cube with', cubeEdges.length, 'cylinder edges')
				
			} else if (geometry.type === 'OctahedronGeometry') {
				// CUSTOM THICK WIREFRAME for OctahedronGeometry
				wireframeMaterial = new THREE.MeshPhongMaterial({
					color: currentBaseColor,
					specular: currentSpecularColor,
					shininess: shininess,
					transparent: true,
					opacity: wireframeIntensity / 100,
					flatShading: false,
					reflectivity: specularIntensity,
				})
				
				// Create thick wireframe using cylinders for octahedron edges
				const octahedronWireframeGroup = new THREE.Group()
				const octaEdgePairs = []
				
				// Get the 6 vertices from the octahedron geometry (like tetrahedron does)
				// Use canonical octahedron vertices for consistent wireframe
				const octaVertices = [
					[0, 1, 0],    // 0: Top vertex
					[0, -1, 0],   // 1: Bottom vertex
					[1, 0, 0],    // 2: Right vertex
					[-1, 0, 0],   // 3: Left vertex
					[0, 0, 1],    // 4: Front vertex
					[0, 0, -1]    // 5: Back vertex
				]
				
				// Define the 12 edges of the octahedron
				const octahedronMainEdges = [
					// Top pyramid edges
					[0, 2], [0, 3], [0, 4], [0, 5],
					// Bottom pyramid edges
					[1, 2], [1, 3], [1, 4], [1, 5],
					// Middle ring edges
					[2, 4], [4, 3], [3, 5], [5, 2]
				]
				
				// Create cylinder for each octahedron edge
				octahedronMainEdges.forEach(([i, j]) => {
					const start = new THREE.Vector3(...octaVertices[i])
					const end = new THREE.Vector3(...octaVertices[j])
					const distance = start.distanceTo(end)
					
						// Create thick cylinder for octahedron edge - ADJUST 0.018 TO CHANGE MAIN WIREFRAME THICKNESS
						const cylinderGeom = new THREE.CylinderGeometry(0.012, 0.012, distance, 8)
					const cylinderMesh = new THREE.Mesh(cylinderGeom, wireframeMaterial)
					
					// Position cylinder between start and end points
					cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5))
					cylinderMesh.lookAt(end)
					cylinderMesh.rotateX(Math.PI / 2)
					
					cylinderMesh.userData.baseLength = distance;
				const iA_o = nearestVertexIndex(geometry, start);
				const iB_o = nearestVertexIndex(geometry, end);
				octaEdgePairs.push([iA_o, iB_o]);
				octahedronWireframeGroup.add(cylinderMesh)
				})
				
				octahedronWireframeGroup.userData.edgePairs = octaEdgePairs;
				wireframeMesh = octahedronWireframeGroup
				console.log('Created thick wireframe for octahedron with', octahedronMainEdges.length, 'cylinder edges')
				
			} else if (geometry.type === 'TetrahedronGeometry') {
				// CUSTOM THICK WIREFRAME for TetrahedronGeometry
				wireframeMaterial = new THREE.MeshPhongMaterial({
					color: currentBaseColor,
					specular: currentSpecularColor,
					shininess: shininess,
					transparent: true,
					opacity: wireframeIntensity / 100,
					flatShading: false,
					reflectivity: specularIntensity,
				})
				
				// Create thick wireframe using cylinders for tetrahedron edges
				const tetrahedronWireframeGroup = new THREE.Group()
				const tetraEdgePairs = []
				
				// Get the 4 vertices from the tetrahedron geometry
				const vertices = geometry.attributes.position.array
				const tetraVertices = []
				for (let v = 0; v < 4; v++) {
					tetraVertices.push([
						vertices[v * 3],
						vertices[v * 3 + 1], 
						vertices[v * 3 + 2]
					])
				}
				
				// Define the 6 edges of the tetrahedron
				const tetrahedronMainEdges = [
					[0, 1], [0, 2], [0, 3],  // From vertex 0 to others
					[1, 2], [1, 3],          // From vertex 1 to remaining 
					[2, 3]                   // From vertex 2 to 3
				]
				
				// Create cylinder for each main tetrahedron edge
				tetrahedronMainEdges.forEach(([i, j]) => {
					const start = new THREE.Vector3(...tetraVertices[i])
					const end = new THREE.Vector3(...tetraVertices[j])
					const distance = start.distanceTo(end)
					
						// Create thick cylinder for main tetrahedron edge
						const cylinderGeom = new THREE.CylinderGeometry(0.011, 0.011, distance, 8)
					const cylinderMesh = new THREE.Mesh(cylinderGeom, wireframeMaterial)
					
					// Position cylinder between start and end points
					cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5))
					cylinderMesh.lookAt(end)
					cylinderMesh.rotateX(Math.PI / 2)
					
					cylinderMesh.userData.baseLength = distance;
					const iA_t = nearestVertexIndex(geometry, start);
					const iB_t = nearestVertexIndex(geometry, end);
					tetraEdgePairs.push([iA_t, iB_t]);
					tetrahedronWireframeGroup.add(cylinderMesh)
				})
				
				tetrahedronWireframeGroup.userData.edgePairs = tetraEdgePairs;
				wireframeMesh = tetrahedronWireframeGroup
				console.log('Created thick wireframe for tetrahedron with', tetrahedronMainEdges.length, 'cylinder edges')
				} else if (geometry.type === 'IcosahedronGeometry') {
					// CUSTOM THICK WIREFRAME for IcosahedronGeometry (20-sided)
					wireframeMaterial = new THREE.MeshPhongMaterial({
							color: currentBaseColor,
							specular: currentSpecularColor,
							shininess: shininess,
							transparent: true,
							opacity: wireframeIntensity / 100,
							flatShading: false,
							reflectivity: specularIntensity,
					});

					// Use EdgesGeometry to reliably get all 30 edges
					const edgesGeometry = new THREE.EdgesGeometry(geometry);
					const edgeVertices = edgesGeometry.attributes.position.array;
					const icosahedronWireframeGroup = new THREE.Group();
					const icoEdgePairs = [];
					const upVector = new THREE.Vector3(0, 1, 0); // Alias for __UP
					if (typeof window.__Q === 'undefined') window.__Q = new THREE.Quaternion();
					const __Q = window.__Q;

					for (let j = 0; j < edgeVertices.length; j += 6) {
							const start = new THREE.Vector3(edgeVertices[j], edgeVertices[j + 1], edgeVertices[j + 2]);
							const end = new THREE.Vector3(edgeVertices[j + 3], edgeVertices[j + 4], edgeVertices[j + 5]);
							const direction = end.clone().sub(start);
							const distance = direction.length();
							// Create thick cylinder for icosahedron edge - ADJUST 0.012 for radius
							const cylinderGeom = new THREE.CylinderGeometry(0.012, 0.012, distance, 8);
							const cylinderMesh = new THREE.Mesh(cylinderGeom, wireframeMaterial);
							// Position cylinder at midpoint
							cylinderMesh.position.copy(start).add(end).multiplyScalar(0.5);
							// Orient cylinder using quaternion helper (essential for correct rotation conformance)
							__Q.setFromUnitVectors(upVector, direction.normalize());
							cylinderMesh.quaternion.copy(__Q);
							// Store original length and vertex indices for updateThickWireframeCylinders
							cylinderMesh.userData.baseLength = distance;
							const iA_ico = nearestVertexIndex(geometry, start);
							const iB_ico = nearestVertexIndex(geometry, end);
							icoEdgePairs.push([iA_ico, iB_ico]);
							icosahedronWireframeGroup.add(cylinderMesh);
					}
					icosahedronWireframeGroup.userData.edgePairs = icoEdgePairs;
					wireframeMesh = icosahedronWireframeGroup;
					console.log('Created thick wireframe for icosahedron with', edgeVertices.length / 6, 'cylinder edges');

			} else {
				// Standard thin wireframe for other geometries
				wireframeMaterial = new THREE.MeshPhongMaterial({
					color: currentBaseColor,
					specular: currentSpecularColor,
					shininess: shininess,
					wireframe: true,           // This one is always wireframe
					transparent: true,
					opacity: wireframeIntensity / 100, // Start with current wireframe intensity
					flatShading: false,
					reflectivity: specularIntensity,
				})
				
				wireframeMesh = new THREE.Mesh(geometry, wireframeMaterial)
			}
			
			// CREATE INTRICATE WIREFRAME DETAILS
			console.log(`Creating intricate wireframe for object ${i}, geometry type:`, geometry.type)
			console.log('Available geometry types check:', geometry.type === 'TetrahedronGeometry')
			console.log('Geometry constructor:', geometry.constructor.name)
			console.log('All geometry properties:', Object.getOwnPropertyNames(geometry))
			
			// Create simple center-to-vertex wireframes for tetrahedron only
			let centerLines, centerLinesMaterial, curvedLines, curvedLinesMaterial
			
			if (geometry.type === 'TetrahedronGeometry' || geometry.constructor.name === 'TetrahedronGeometry') {
				// TETRAHEDRON: Create hyper-tetrahedron like hypercube but with LineSegments
				console.log('*** ENTERING TETRAHEDRON SECTION ***')
				console.log('Creating hyper-tetrahedron with inner tetrahedron and vertex connections')
				
				// Get the 4 vertices from the tetrahedron geometry
				const vertices = geometry.attributes.position.array
				const outerVertices = []
				for (let v = 0; v < 4; v++) {
					outerVertices.push([
						vertices[v * 3],     // x
						vertices[v * 3 + 1], // y  
						vertices[v * 3 + 2]  // z
					])
				}
				
				console.log('Outer tetrahedron vertices:', outerVertices)
				
				// Create inner tetrahedron vertices (scaled down by 0.5 from center)
				const innerVertices = outerVertices.map(vertex => [
					vertex[0] * 0.5,
					vertex[1] * 0.5,
					vertex[2] * 0.5
				])
				
				console.log('Inner tetrahedron vertices:', innerVertices)
				
				// 1. Create inner tetrahedron wireframe using thick cylinders
				centerLinesMaterial = new THREE.MeshBasicMaterial({
					color: new THREE.Color(intricateWireframeSpiralColor), // USE SPIRAL COLOR CONTROL!
					transparent: false,
					opacity: 1.0,
				})
				
				const innerTetrahedronGroup = new THREE.Group()
				
				// Tetrahedron edges: connect every vertex to every other vertex (6 edges total)
				const edges = [
					[0, 1], [0, 2], [0, 3],  // From vertex 0 to others
					[1, 2], [1, 3],          // From vertex 1 to remaining 
					[2, 3]                   // From vertex 2 to 3
				]
				
				// Create cylinder for each inner tetrahedron edge
				edges.forEach(([i, j]) => {
					const start = new THREE.Vector3(...innerVertices[i])
					const end = new THREE.Vector3(...innerVertices[j])
					const distance = start.distanceTo(end)
					
					// Create thick cylinder for inner tetrahedron edge - ADJUST 0.004 TO CHANGE THICKNESS
					const cylinderGeom = new THREE.CylinderGeometry(0.004, 0.004, distance, 8)
					const cylinderMesh = new THREE.Mesh(cylinderGeom, centerLinesMaterial)
					
					// Position cylinder between start and end points
					cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5))
					cylinderMesh.lookAt(end)
					cylinderMesh.rotateX(Math.PI / 2)
					
					innerTetrahedronGroup.add(cylinderMesh)
				})
				
				centerLines = innerTetrahedronGroup
				console.log(`Created inner tetrahedron: 6 thick cylinder edges`)
				
				// 2. Create hyper-tetrahedron connections (vertex to vertex) using thick cylinders
				curvedLinesMaterial = new THREE.MeshBasicMaterial({
					color: new THREE.Color(intricateWireframeEdgeColor), // USE EDGE COLOR CONTROL!
					transparent: false,
					opacity: 1.0,
				})
				
				// Create thick connection lines using cylinder geometry
				const tetrahedronConnectionGroup = new THREE.Group()
				
				// Connect each outer vertex to corresponding inner vertex (4 connections going INWARD)
				for (let v = 0; v < 4; v++) {
					const start = new THREE.Vector3(...outerVertices[v])
					const end = new THREE.Vector3(...innerVertices[v])
					const distance = start.distanceTo(end)
					
					// Create cylinder for each connection line - ADJUST 0.003 TO CHANGE THICKNESS
					const cylinderGeom = new THREE.CylinderGeometry(0.003, 0.003, distance, 6)
					const cylinderMesh = new THREE.Mesh(cylinderGeom, curvedLinesMaterial)
					
					// Position cylinder between start and end points
					cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5))
					cylinderMesh.lookAt(end)
					cylinderMesh.rotateX(Math.PI / 2)
					
					tetrahedronConnectionGroup.add(cylinderMesh)
				}
				
				curvedLines = tetrahedronConnectionGroup
				console.log(`Created hyper-tetrahedron connections: 4 thick vertex-to-vertex connections`)
				
			} else if (geometry.type === 'BoxGeometry') {
				// CUBE/BOX: Create hypercube-style inner cube with corner-to-corner connections
				console.log('Creating hypercube wireframe for BoxGeometry')
				
				// Get the 8 corners of the outer cube (BoxGeometry 1.5x1.5x1.5)
				const size = 0.75 // Half of 1.5
				const outerCorners = [
					[-size, -size, -size], // 0: bottom-back-left
					[size, -size, -size],  // 1: bottom-back-right  
					[size, size, -size],   // 2: top-back-right
					[-size, size, -size],  // 3: top-back-left
					[-size, -size, size],  // 4: bottom-front-left
					[size, -size, size],   // 5: bottom-front-right
					[size, size, size],    // 6: top-front-right
					[-size, size, size]    // 7: top-front-left
				]
				
				// Create inner cube (scaled down to be INSIDE the outer cube)
				const innerScale = 0.5
				const innerCorners = outerCorners.map(corner => [
					corner[0] * innerScale,
					corner[1] * innerScale, 
					corner[2] * innerScale
				])
				
				// 1. Create inner cube wireframe using thick cylinders
				const centerLinesGeometry = new THREE.BufferGeometry() // Keep for compatibility
				
				// Inner cube edges - proper cube wireframe structure
				const innerEdges = [
					// Back face (z = -size)
					[0, 1], [1, 2], [2, 3], [3, 0],
					// Front face (z = +size)  
					[4, 5], [5, 6], [6, 7], [7, 4],
					// Connecting edges between front and back
					[0, 4], [1, 5], [2, 6], [3, 7]
				]
				
				centerLinesMaterial = new THREE.MeshBasicMaterial({
					color: new THREE.Color('#5900ffff'), // Bright red for inner cube
					transparent: false,
					opacity: 1.0,
				})
				
				// Create thick visible lines using cylinder geometry
				const innerCubeGroup = new THREE.Group()
				
				innerEdges.forEach(([i, j]) => {
					const start = new THREE.Vector3(...innerCorners[i])
					const end = new THREE.Vector3(...innerCorners[j])
					const distance = start.distanceTo(end)
					
					// Create cylinder for each edge
					const cylinderGeom = new THREE.CylinderGeometry(0.003, 0.008, distance, 8)
					const cylinderMesh = new THREE.Mesh(cylinderGeom, centerLinesMaterial)
					
					// Position cylinder between start and end points
					cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5))
					cylinderMesh.lookAt(end)
					cylinderMesh.rotateX(Math.PI / 2)
					
					innerCubeGroup.add(cylinderMesh)
				})
				
				centerLines = innerCubeGroup
				console.log(`Created hypercube inner cube with ${innerEdges.length} cylinder edges`)
				
				// 2. Create hypercube connections (corner to corner) using thick cylinders
				curvedLinesMaterial = new THREE.MeshBasicMaterial({
					color: new THREE.Color('#00ff00'), // Bright green for connections
					transparent: false,
					opacity: 1.0,
				})
				
				// Create thick connection lines using cylinder geometry
				const connectionGroup = new THREE.Group()
				
				// Connect each inner corner to corresponding outer corner
				for (let i = 0; i < 8; i++) {
					const start = new THREE.Vector3(...innerCorners[i])
					const end = new THREE.Vector3(...outerCorners[i])
					const distance = start.distanceTo(end)
					
					// Create cylinder for each connection line - ADJUST 0.005 TO CHANGE THICKNESS
					const cylinderGeom = new THREE.CylinderGeometry(0.003, 0.005, distance, 6)
					const cylinderMesh = new THREE.Mesh(cylinderGeom, curvedLinesMaterial)
					
					// Position cylinder between start and end points
					cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5))
					cylinderMesh.lookAt(end)
					cylinderMesh.rotateX(Math.PI / 2)
					
					connectionGroup.add(cylinderMesh)
				}
				
				curvedLines = connectionGroup
				console.log(`Created hypercube connections: ${innerEdges.length} thick cylinder connections`)
				
			} else if (geometry.type === 'OctahedronGeometry') {
				// CUSTOM THICK WIREFRAME for OctahedronGeometry
				wireframeMaterial = new THREE.MeshPhongMaterial({
					color: currentBaseColor,
					specular: currentSpecularColor,
					shininess: shininess,
					transparent: true,
					opacity: wireframeIntensity / 100,
					flatShading: false,
					reflectivity: specularIntensity,
				})
				
				// Create thick wireframe using cylinders for octahedron edges
				const octahedronWireframeGroup = new THREE.Group()
				const octaEdgePairs = []
				
				// Get the 6 vertices of the octahedron (top, bottom, and 4 around the middle)
				const size = 1.0 // Octahedron radius
				const outerVertices = [
					[0, size, 0],    // 0: Top vertex
					[0, -size, 0],   // 1: Bottom vertex
					[size, 0, 0],    // 2: Right vertex
					[-size, 0, 0],   // 3: Left vertex
					[0, 0, size],    // 4: Front vertex
					[0, 0, -size]    // 5: Back vertex
				]
				
				// Create inner octahedron (scaled down)
				const innerScale = 0.5
				const innerVertices = outerVertices.map(vertex => [
					vertex[0] * innerScale,
					vertex[1] * innerScale,
					vertex[2] * innerScale
				])
				
				// 1. Create inner octahedron wireframe using thick cylinders
				centerLinesMaterial = new THREE.MeshBasicMaterial({
					color: new THREE.Color('#ff0000'), // Bright red for inner octahedron
					transparent: false,
					opacity: 1.0,
				})
				
				const innerOctahedronGroup = new THREE.Group()
				
				// Define the 12 edges of the octahedron
				const octahedronEdges = [
					// Top pyramid edges (from top vertex to middle ring)
					[0, 2], [0, 3], [0, 4], [0, 5],
					// Bottom pyramid edges (from bottom vertex to middle ring)
					[1, 2], [1, 3], [1, 4], [1, 5],
					// Middle ring edges (connecting the 4 middle vertices)
					[2, 4], [4, 3], [3, 5], [5, 2]
				]
				
				// Create cylinder for each inner octahedron edge
				centerLinesMaterial = new THREE.MeshBasicMaterial({
					color: new THREE.Color(intricateWireframeSpiralColor),
					transparent: false,
					opacity: 1.0,
				});
				octahedronEdges.forEach(([i, j]) => {
					const start = new THREE.Vector3(...innerVertices[i]);
					const end = new THREE.Vector3(...innerVertices[j]);
					const distance = start.distanceTo(end);
					// Create thick cylinder for inner octahedron edge
					const cylinderGeom = new THREE.CylinderGeometry(0.004, 0.004, distance, 8);
					const cylinderMesh = new THREE.Mesh(cylinderGeom, centerLinesMaterial);
					// Position cylinder between start and end points
					cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5));
					cylinderMesh.lookAt(end);
					cylinderMesh.rotateX(Math.PI / 2);
					innerOctahedronGroup.add(cylinderMesh);
				});
				centerLines = innerOctahedronGroup;
				console.log(`Created hyper-octahedron inner wireframe with ${octahedronEdges.length} cylinder edges`);
				curvedLinesMaterial = new THREE.LineBasicMaterial({
					color: new THREE.Color(intricateWireframeEdgeColor),
					transparent: true,
					opacity: 0.7,
				});
				// Create thick connection lines using cylinder geometry
				const octahedronConnectionGroup = new THREE.Group()
				
				// Connect each inner vertex to corresponding outer vertex
				for (let i = 0; i < 6; i++) {
					const start = new THREE.Vector3(...innerVertices[i])
					const end = new THREE.Vector3(...outerVertices[i])
					const distance = start.distanceTo(end)
					
					// Create cylinder for each connection line - ADJUST 0.003 TO CHANGE THICKNESS
					const cylinderGeom = new THREE.CylinderGeometry(0.003, 0.003, distance, 6)
					const cylinderMesh = new THREE.Mesh(cylinderGeom, curvedLinesMaterial)
					
					// Position cylinder between start and end points
					cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5))
					cylinderMesh.lookAt(end)
					cylinderMesh.rotateX(Math.PI / 2)
					
					octahedronConnectionGroup.add(cylinderMesh)
				}
				
				curvedLines = octahedronConnectionGroup
				console.log(`Created hyper-octahedron connections: 6 vertex-to-vertex connections`)

				} else if (geometry.type === 'IcosahedronGeometry') {
					// ICOSAHEDRON: Create hyper-icosahedron with inner icosahedron and connections
					console.log('Creating hyper-icosahedron wireframe for IcosahedronGeometry')

					// Golden ratio for icosahedron construction
					const phi = (1 + Math.sqrt(5)) / 2;
					// Canonical vertices
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
					// Create inner icosahedron (scaled down)
					const innerScale = 0.5;
					const innerVertices = outerVertices.map(vertex => [
						vertex[0] * innerScale,
						vertex[1] * innerScale,
						vertex[2] * innerScale
					]);

					// 1. Create inner icosahedron wireframe using thick cylinders
					centerLinesMaterial = new THREE.MeshBasicMaterial({
						color: intricateWireframeSpiralColor,
						transparent: false,
						opacity: 1.0,
					});
					const innerIcosahedronGroup = new THREE.Group();
					// Find all edges: connect vertices that are distance ≈ 2.0 apart
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
					console.log(`Created hyper-icosahedron inner wireframe with ${icosahedronEdges.length} cylinder edges`);

					// 2. Create hyper-icosahedron connections (vertex to vertex) using thick cylinders
					curvedLinesMaterial = new THREE.MeshBasicMaterial({
						color: intricateWireframeEdgeColor,
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
					console.log(`Created hyper-icosahedron connections: 12 vertex-to-vertex connections`);
				
			} else {
				// OTHER GEOMETRIES: Use existing complex wireframe logic
				const edgesGeometry = new THREE.EdgesGeometry(geometry)
				const edgeVertices = edgesGeometry.attributes.position.array
				
				console.log(`Object ${i} has ${edgeVertices.length / 6} wireframe edges`)
				
				// 1. Spiral connections to wireframe vertices
				const centerLinesGeometry = new THREE.BufferGeometry()
				const centerLinesPositions = []
				
				// Create spiral paths from center to actual wireframe edge points
				let createCenterLines = true
				if (geometry.type === 'TorusKnotGeometry') {
					createCenterLines = false // No center lines for torus
				}
				
				if (createCenterLines) {
					// Use actual wireframe edge endpoints for connections
					for (let j = 0; j < edgeVertices.length; j += 12) { // Every other edge
						const endX = edgeVertices[j + 3] // End point of edge
						const endY = edgeVertices[j + 4]
						const endZ = edgeVertices[j + 5]
						
						// Create spiral path from center to edge endpoint
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
				}
				
				// Only create center lines if we have valid positions
				if (centerLinesPositions.length > 0) {
					centerLinesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(centerLinesPositions, 3))
					
					centerLinesMaterial = new THREE.LineBasicMaterial({
						color: new THREE.Color(intricateWireframeSpiralColor), // Use the new spiral color control
						transparent: true,
						opacity: 0.6,
					})
					
					centerLines = new THREE.LineSegments(centerLinesGeometry, centerLinesMaterial)
					console.log(`Created spiral center lines for object ${i} with ${centerLinesPositions.length / 6} segments`)
				} else {
					centerLines = new THREE.Object3D()
					centerLinesMaterial = null
					console.log(`No center lines created for object ${i}`)
				}
				
				// 2. Enhanced wireframe edge connections
				const curvedLinesGeometry = new THREE.BufferGeometry()
				const curvedLinesPositions = []
				
				// Connect wireframe edges to create enhanced patterns
				for (let j = 0; j < edgeVertices.length; j += 6) {
					const edge1Start = [edgeVertices[j], edgeVertices[j + 1], edgeVertices[j + 2]]
					const edge1End = [edgeVertices[j + 3], edgeVertices[j + 4], edgeVertices[j + 5]]
					
					// Find nearby edges to connect to
					for (let k = j + 6; k < edgeVertices.length && k < j + 36; k += 6) {
						const edge2Start = [edgeVertices[k], edgeVertices[k + 1], edgeVertices[k + 2]]
						const edge2End = [edgeVertices[k + 3], edgeVertices[k + 4], edgeVertices[k + 5]]
						
						// Calculate distance between edge endpoints
						const dist1 = Math.sqrt(
							(edge1End[0] - edge2Start[0])**2 + 
							(edge1End[1] - edge2Start[1])**2 + 
							(edge1End[2] - edge2Start[2])**2
						)
						
						const dist2 = Math.sqrt(
							(edge1End[0] - edge2End[0])**2 + 
							(edge1End[1] - edge2End[1])**2 + 
							(edge1End[2] - edge2End[2])**2
						)
						
						// Connect to nearby edge points
						const maxDist = geometry.type === 'TorusKnotGeometry' ? 0.6 : 1.2
						
						if (dist1 < maxDist) {
							curvedLinesPositions.push(...edge1End, ...edge2Start)
						} else if (dist2 < maxDist) {
							curvedLinesPositions.push(...edge1End, ...edge2End)
						}
					}
				}
				
				// Only create curved lines if we have valid positions
				if (curvedLinesPositions.length > 0) {
					curvedLinesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(curvedLinesPositions, 3))
					
					curvedLinesMaterial = new THREE.LineBasicMaterial({
						color: new THREE.Color(intricateWireframeEdgeColor), // Use the new edge color control
						transparent: true,
						opacity: 0.4,
					})
					
					curvedLines = new THREE.LineSegments(curvedLinesGeometry, curvedLinesMaterial)
					console.log(`Created edge connections for object ${i} with ${curvedLinesPositions.length / 6} segments`)
				} else {
					curvedLines = new THREE.Object3D()
					curvedLinesMaterial = null
					console.log(`No edge connections created for object ${i}`)
				}
			}
			
			// POSITION ALL OBJECTS in same location
			if (objectCount === 1) {
				solidMesh.position.set(0, 0, 0) // Single object at center
				wireframeMesh.position.set(0, 0, 0) // Same position
				centerLines.position.set(0, 0, 0) // Same position
				curvedLines.position.set(0, 0, 0) // Same position
			} else {
				// Multiple objects arranged in a circle
				const angle = (i / objectCount) * Math.PI * 2
				const radius = 3
				const x = Math.cos(angle) * radius
				const y = (Math.random() - 0.9) * 1 // Random Y position for variety
				const z = Math.sin(angle) * radius
				
				solidMesh.position.set(x, y, z)
				wireframeMesh.position.set(x, y, z) // Same position
				centerLines.position.set(x, y, z) // Same position
				curvedLines.position.set(x, y, z) // Same position
			}
			
			// Enable shadows for both meshes
			solidMesh.castShadow = true
			solidMesh.receiveShadow = true
			wireframeMesh.castShadow = true
			wireframeMesh.receiveShadow = true
			
			// Add all meshes to the scene
			const objectGroup = new THREE.Group();
			scene.add(solidMesh)
			scene.add(wireframeMesh)
			scene.add(centerLines)
			scene.add(curvedLines)
			scene.add(objectGroup);

			
			
			console.log(`Added object ${i} to scene:`, {
				solidMesh: solidMesh.type,
				wireframeMesh: wireframeMesh.type,
				centerLines: centerLines ? centerLines.type : 'NULL',
				curvedLines: curvedLines ? curvedLines.type : 'NULL',
				centerLinesChildren: centerLines ? centerLines.children?.length : 'N/A',
				curvedLinesChildren: curvedLines ? curvedLines.children?.length : 'N/A',
				position: solidMesh.position
			})

			// STORE OBJECT DATA for later updates and animations
			objectsRef.current.push({
				solidMesh,                  // The solid Three.js object
				wireframeMesh,              // The wireframe Three.js object
				thickCylinders: (wireframeMesh && wireframeMesh.isGroup) ? wireframeMesh.children.filter(m => m.isMesh) : null,
				edgePairs: (wireframeMesh && wireframeMesh.userData && wireframeMesh.userData.edgePairs) ? wireframeMesh.userData.edgePairs : null,
				centerLines,                // The center-to-vertex lines
				curvedLines,                // The vertex-to-vertex connections
				material,                   // The solid material (for updating properties)
				wireframeMaterial,          // The wireframe material (for updating properties)
				centerLinesMaterial,        // The center lines material (for updating properties)
				curvedLinesMaterial,        // The curved lines material (for updating properties)
				geometry,                   // The geometry (for vertex animations)
				originalPositions,          // Original vertex positions (for morphing effects)
				originalPosition: solidMesh.position.clone(), // Original object position
				phase: Math.random() * Math.PI * 2,      // Random phase for varied animations
				// Magnetic points for magnetic field animation effect
				magneticPoints: [
					{ x: Math.random() * 4 - 2, y: Math.random() * 4 - 2, z: Math.random() * 4 - 2, strength: Math.random() + 0.5 },
					{ x: Math.random() * 4 - 2, y: Math.random() * 4 - 2, z: Math.random() * 4 - 2, strength: Math.random() + 0.5 },
					{ x: Math.random() * 4 - 2, y: Math.random() * 4 - 2, z: Math.random() * 4 - 2, strength: Math.random() + 0.5 }
				]
			})
		}

		// Store first material as main reference for debugging
		if (objectsRef.current.length > 0) {
			materialRef.current = objectsRef.current[0].material
			console.log('Set main material reference, specular color:', objectsRef.current[0].material.specular.getHex())
		}
		
		console.log(`Created ${objectsRef.current.length} objects with current React state values`)
	}, [objectCount, baseColor, specularColor, objectType]) 
	// ↑ This effect runs when ANY of these App.jsx props change (removed wireframeIntensity, specularIntensity, and shininess)

	// ===============================================
	// CAMERA CONTROLLER - RESPONDS TO cameraView PROP
	// ===============================================
	// When App.jsx changes cameraView prop, this useEffect runs and repositions the camera
	
	useEffect(() => {
		if (!cameraRef.current) return // Safety check

		const camera = cameraRef.current

		// DEBUG: Log cameraView changes and camera position
		console.log('[ThreeScene] cameraView effect:', cameraView)

		// POSITION CAMERA based on cameraView prop from App.jsx
		switch(cameraView) {
			case 'free':
				camera.position.set(0, 0, 6)     // Standard front view
				break
			case 'orbit':
				camera.position.set(0, 3, 6)     // Elevated view for orbiting
				camera.lookAt(0, 0, 0)           // Look at center
				break
			case 'top':
				camera.position.set(0, 10, 0)    // Directly above
				camera.lookAt(0, 0, 0)           // Look down at center
				break
			case 'side':
				camera.position.set(10, 0, 0)    // Far to the right side
				camera.lookAt(0, 0, 0)           // Look at center
				break
			case 'cinematic':
				camera.position.set(-3, 2, 5)    // Dramatic angle
				camera.lookAt(0, 0, 0)           // Look at center
				break
		}
		console.log('[ThreeScene] camera position after update:', camera.position)
	}, [cameraView]) // Run when cameraView prop from App.jsx changes

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
							// Slow, gentle rotation and keep original position
							currentMesh.rotation.x += 0.004;
							currentMesh.rotation.y += 0.006;
							currentMesh.position.copy(originalPosition);
							break;

						case 'chaos':
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

  // STEP 1 & 2: Reset & Rebuild (Kept the same)
  if (geometry && originalPositions && currentMesh === solidMesh) {
    const positions = geometry.attributes.position.array
    for (let i = 0; i < positions.length; i++) {
      positions[i] = originalPositions[i]
    }
    geometry.attributes.position.needsUpdate = true

    if (centerLines && centerLines.geometry && geometry.type !== 'TetrahedronGeometry') {
      const edgesGeometry = new THREE.EdgesGeometry(geometry)
      const edgeVertices = edgesGeometry.attributes.position.array
      const centerLinesGeometry = centerLines.geometry
      const centerLinesPositions = []

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
          
          centerLinesPositions.push(x1, y1, z1, x2, y2, z2) 
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
    const hoverIntensity = 0.15 + (speedVariation * 0.05)
    
    currentMesh.position.x = originalPosition.x + Math.sin(t * 3 + phase) * hoverIntensity * 1.2 
    currentMesh.position.y = originalPosition.y + Math.cos(t * 4 + phase) * hoverIntensity
    currentMesh.position.z = originalPosition.z + Math.sin(t * 2 + phase) * hoverIntensity * 0.5
    
    currentMesh.rotation.y = t * 0.3 + phase 
    currentMesh.rotation.x = Math.sin(t * 0.7 + phase) * 0.3
    currentMesh.rotation.z = Math.cos(t * 0.4 + phase) * 0.2
    
    currentMesh.scale.setScalar(1 + Math.sin(t * 2 + phase) * 0.03) 
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
    
    // 1. Time-Based Modulator: Slower wave to reduce repetitiveness (t * 0.5)
    const longWaveModulator = (Math.sin(t * 0.5 + phase * 2) * 0.5 + 0.5); 
    
    // 2. Slow Build-up Curve: Use a slower easing function (Quintic) on the local spin time (t_spin)
    const buildUpFactor = easeInOutQuint(t_spin);

    // 3. Emotional Speed Mix: Max speed is now based on the slow-building factor
    const minSpeed = 0.05 + speedVariation * 0.05; // Very slow base spin for observation
    const maxSpeed = reactionSpeed * 0.05;       // Maximum possible dart speed
    
    // Current Spin is controlled by the slow time wave, scaled by the buildup over the phase
    const currentSpinSpeed = THREE.MathUtils.lerp(
        minSpeed, 
        maxSpeed * longWaveModulator, // The max speed is varied slowly over t
        buildUpFactor // The spin only reaches its max over the 0.15 phase duration
    );

    // Rotation: Apply the modulated speed with complex, odd-axis factors
    currentMesh.rotation.x += currentSpinSpeed * 1.5 * Math.sin(t * 0.4 + phase) // Dervish tilt X
    currentMesh.rotation.y += currentSpinSpeed * 2.0 // Main spin axis
    currentMesh.rotation.z += currentSpinSpeed * 1.0 * Math.cos(t * 0.7 + phase) // Dervish tilt Z
    
    // Curiosity/Wobble only happens when spin is very slow
    currentMesh.position.x += Math.sin(t * 10 + phase) * (1 - buildUpFactor) * 0.02;
    currentMesh.position.y += Math.cos(t * 8 + phase) * (1 - buildUpFactor) * 0.02;
  }

  // PHASE 3: Elliptical Recede & Curious Return (35% - 50%)
  // Sentient: Recedes in a curved dash, then returns with Curiosity.
  else if (cycleProgress < 0.50) {
    const t_dash = (cycleProgress - 0.35) / 0.15
    const eased_recede = easeInOutQuad(t_dash); // Smooth, fast dash out and in

    const maxDashDistance = orbitSize * 1.5; // Larger, more dramatic move
    const ellipseHeight = orbitSize * 0.4;
    
    // Position: Move back (Z-) and swing out in an ellipse (X/Y curve)
    currentMesh.position.x = originalPosition.x + Math.sin(eased_recede * Math.PI) * maxDashDistance * 0.3; // Curved X-out/in
    currentMesh.position.y = originalPosition.y + Math.cos(eased_recede * Math.PI) * ellipseHeight;        // Ellipse up/down
    currentMesh.position.z = originalPosition.z - eased_recede * maxDashDistance * 0.8;                     // Swift recede back

    // Rotation: Orient itself to the target of its "curiosity" (the camera/viewer)
    currentMesh.rotation.x = Math.sin(t * 5 + phase) * 0.1 * (1 - eased_recede); // Subtle wobble on return
    currentMesh.rotation.y = eased_recede * Math.PI * 2; // Spin as it dashes away
    currentMesh.rotation.z = Math.cos(t * 3 + phase) * 0.1;
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
    currentMesh.position.y = originalPosition.y + ellipseRadiusY * Math.sin(t_angle * 2) * Math.sin(t * 3 + phase) * 0.5 + Math.sin(t_figure8 * Math.PI * 4) * 0.5
    currentMesh.position.z = originalPosition.z + centerZ + ellipseRadiusZ * Math.sin(t_angle)

    currentMesh.rotation.z = Math.sin(t_angle * 0.5) * 0.8
    currentMesh.rotation.x = Math.cos(t_angle * 0.7) * 0.5
    currentMesh.rotation.y += (t * 0.5 + phase) * 0.1 
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
    
  // Update thick wireframe cylinders for sphere geometry
  if (objData.thickCylinders && objData.edgePairs) {
    updateThickWireframeCylinders(objData);
  }
    
  break
						case 'dna':
	// DNA Helix: Geometry-aware vertex morphing + rotation
	if (geometry && originalPositions && currentMesh === solidMesh) {
		const positions = geometry.attributes.position.array
		const type = geometry.type

		// For flat-faced polyhedrons: use gentle wave deformations
		if (type === 'BoxGeometry' || type === 'TetrahedronGeometry' || type === 'OctahedronGeometry') {
			for (let i = 0; i < positions.length; i += 3) {
				const ox = originalPositions[i]
				const oy = originalPositions[i + 1]
				const oz = originalPositions[i + 2]
				positions[i] = ox + Math.sin(t * 2 + oy * 3) * 0.12
				positions[i + 1] = oy + Math.cos(t * 1.5 + oz * 2) * 0.12
				positions[i + 2] = oz + Math.sin(t * 1.8 + ox * 2.5) * 0.12
			}
		} else {
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
		}
		
		geometry.attributes.position.needsUpdate = true
		
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
								geometry.attributes.position.needsUpdate = true
								
								// UPDATE INTRICATE WIREFRAME TO FOLLOW MORPHED SURFACE - MAGNETIC
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
								} // Close the wireframe update conditional
								
								// Update main geometry AFTER wireframe updates for perfect sync
								geometry.attributes.position.needsUpdate = true
							} // Close the DNA animation conditional
							
							currentMesh.rotation.y = t * 0.3 + phase
							currentMesh.rotation.x = Math.sin(t * 0.2) * 0.2
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
	// MATERIAL PROPERTY UPDATERS - RESPOND TO MATERIAL PROPS
	// ===============================================
	// These useEffects listen for changes to specific material properties from App.jsx
	// and update the existing 3D objects without recreating them entirely

	// SHININESS UPDATER - Responds to shininess prop changes
	useEffect(() => {
		console.log('Updating shininess to:', shininess) // Debug: shows when App.jsx changes shininess
		objectsRef.current.forEach(({ material, wireframeMaterial }, index) => {
			// Update solid material
			if (material) {
				material.shininess = shininess          // Apply new shininess value from App.jsx
				material.needsUpdate = true             // Tell Three.js to re-render material
				console.log(`Updated material ${index} shininess to:`, shininess)
			}
			// Update wireframe material
			if (wireframeMaterial) {
				wireframeMaterial.shininess = shininess // Apply to wireframe material too
				wireframeMaterial.needsUpdate = true
				console.log(`Updated wireframe material ${index} shininess to:`, shininess)
			}
		})
	}, [shininess]) // Run when shininess prop from App.jsx changes

	// SPECULAR COLOR UPDATER - Responds to specularColor prop changes
	useEffect(() => {
		console.log('Updating specular color to:', specularColor) // Debug: shows color changes
		console.log('Number of objects:', objectsRef.current.length)
		
		if (objectsRef.current.length === 0) {
			console.log('No objects available for specular update')
			return
		}
		
		// Convert hex color string from App.jsx (like "#ff0000") to Three.js color number
		const convertedColor = parseInt(specularColor.replace('#', ''), 16)
		console.log('Converted color value:', convertedColor)
		
		objectsRef.current.forEach(({ material, wireframeMaterial }, index) => {
			// Update solid material
			if (material) {
				console.log(`Updating material ${index} specular color`)
				material.specular.setHex(convertedColor) // Apply new specular color from App.jsx
				material.needsUpdate = true              // Tell Three.js to re-render material
			} else {
				console.log(`Material ${index} is null`)
			}
			// Update wireframe material
			if (wireframeMaterial) {
				console.log(`Updating wireframe material ${index} specular color`)
				wireframeMaterial.specular.setHex(convertedColor) // Apply to wireframe material too
				wireframeMaterial.needsUpdate = true
			}
		})
	}, [specularColor]) // Run when specularColor prop from App.jsx changes

	// SPECULAR INTENSITY UPDATER - Responds to specularIntensity prop changes
	useEffect(() => {
		console.log('Updating specular intensity to:', specularIntensity)
		
		objectsRef.current.forEach(({ material, wireframeMaterial }, index) => {
			// Update solid material
			if (material) {
				material.reflectivity = specularIntensity // Apply new intensity from App.jsx
				material.needsUpdate = true               // Tell Three.js to re-render material
				console.log(`Updated material ${index} specular intensity to:`, specularIntensity)
			} else {
				console.log(`Material ${index} is null`)
			}
			// Update wireframe material
			if (wireframeMaterial) {
				wireframeMaterial.reflectivity = specularIntensity // Apply to wireframe material too
				wireframeMaterial.needsUpdate = true
				console.log(`Updated wireframe material ${index} specular intensity to:`, specularIntensity)
			}
		})
	}, [specularIntensity]) // Run when specularIntensity prop from App.jsx changes

	// BASE COLOR UPDATER - Responds to baseColor prop changes
	useEffect(() => {
		console.log('Updating base color to:', baseColor)
		// Convert hex color string from App.jsx to Three.js color number
		const convertedColor = parseInt(baseColor.replace('#', ''), 16)
		console.log('Converted base color value:', convertedColor)
		
		objectsRef.current.forEach(({ material, wireframeMaterial }, index) => {
			// Update solid material
			if (material) {
				material.color.setHex(convertedColor) // Apply new base color from App.jsx
				material.needsUpdate = true           // Tell Three.js to re-render material
				console.log(`Updated material ${index} base color`)
			}
			// Update wireframe material
			if (wireframeMaterial) {
				wireframeMaterial.color.setHex(convertedColor) // Apply to wireframe material too
				wireframeMaterial.needsUpdate = true
				console.log(`Updated wireframe material ${index} base color`)
			}
		})
	}, [baseColor]) // Run when baseColor prop from App.jsx changes

	// Debugging: Ensure objectsRef is populated and baseColor updates correctly
	useEffect(() => {
		console.log('Base color change detected:', baseColor);
		console.log('Objects in objectsRef:', objectsRef.current);

		const convertedColor = parseInt(baseColor.replace('#', ''), 16);
		console.log('Converted base color value:', convertedColor);

		objectsRef.current.forEach(({ material, wireframeMaterial }, index) => {
			if (material) {
				material.color.setHex(convertedColor);
				material.needsUpdate = true;
				console.log(`Updated material ${index} base color to:`, material.color);
			} else {
				console.log(`Material ${index} is null`);
			}

			if (wireframeMaterial) {
				wireframeMaterial.color.setHex(convertedColor);
				wireframeMaterial.needsUpdate = true;
				console.log(`Updated wireframe material ${index} base color to:`, wireframeMaterial.color);
			} else {
				console.log(`Wireframe material ${index} is null`);
			}
		});
	}, [baseColor]);

	// WIREFRAME INTENSITY UPDATER - Responds to wireframeIntensity prop changes
	useEffect(() => {
		const intensity = wireframeIntensity / 100 // Convert 0-100 range to 0-1 range
		
		console.log(`Updating wireframe intensity to ${wireframeIntensity}% (${intensity}) for ${objectsRef.current.length} objects`)
		
		objectsRef.current.forEach(({ material, wireframeMaterial, centerLinesMaterial, curvedLinesMaterial }, index) => {
			console.log(`Updating object ${index}:`, {
				hasMaterial: !!material,
				hasWireframeMaterial: !!wireframeMaterial,
				hasCenterLinesMaterial: !!centerLinesMaterial,
				hasCurvedLinesMaterial: !!curvedLinesMaterial
			})
			
			if (material && wireframeMaterial) {
				// DUAL-MESH BLENDING: Smooth transition between solid and wireframe
				if (intensity === 0) {
					// Full solid: solid mesh visible, wireframe mesh invisible
					material.transparent = false
					material.opacity = 1
					wireframeMaterial.transparent = true
					wireframeMaterial.opacity = 0
				} else if (intensity === 1) {
					// Full wireframe: solid mesh invisible, wireframe mesh visible
					material.transparent = true
					material.opacity = 0
					wireframeMaterial.transparent = true
					wireframeMaterial.opacity = 1
				} else {
					// Blended: both meshes partially visible
					material.transparent = true
					material.opacity = 1 - intensity  // Solid fades out as wireframe increases
					wireframeMaterial.transparent = true
					wireframeMaterial.opacity = intensity  // Wireframe fades in as intensity increases
				}
				
				// UPDATE INTRICATE WIREFRAME ELEMENTS
				if (centerLinesMaterial) {
					centerLinesMaterial.opacity = 0.8 // Keep bright red lines visible
					centerLinesMaterial.needsUpdate = true
				}
				
				if (curvedLinesMaterial) {
					curvedLinesMaterial.opacity = 0.8 // Keep bright green lines visible
					curvedLinesMaterial.needsUpdate = true
				}
				
				material.needsUpdate = true
				wireframeMaterial.needsUpdate = true
				
				console.log(`Wireframe intensity ${wireframeIntensity}%: solid opacity = ${material.opacity}, wireframe opacity = ${wireframeMaterial.opacity}`)
			} else if (material) {
				// Legacy single-mesh fallback (old wireframe behavior)
				if (intensity === 0) {
					material.wireframe = false
					material.transparent = false
					material.opacity = 1
				} else {
					material.wireframe = true
					material.transparent = true
					material.opacity = 0.3 + (intensity * 0.7)
				}
				material.needsUpdate = true
			}
		})
	}, [wireframeIntensity]) // Run when wireframeIntensity prop from App.jsx changes

	// ===============================================
	// INTRICATE WIREFRAME COLOR UPDATERS - RESPOND TO INTRICATE WIREFRAME PROPS
	// ===============================================
	// These useEffects update intricate wireframe colors when App.jsx changes the color controls

	// INTRICATE WIREFRAME SPIRAL COLOR UPDATER - Responds to spiral color prop changes
	useEffect(() => {
		console.log('Updating intricate wireframe spiral color to:', intricateWireframeSpiralColor)
		const convertedColor = new THREE.Color(intricateWireframeSpiralColor)
		
		objectsRef.current.forEach(({ centerLinesMaterial }, index) => {
			if (centerLinesMaterial) {
				centerLinesMaterial.color.copy(convertedColor)
				centerLinesMaterial.needsUpdate = true
				console.log(`Updated center lines material ${index} color`)
			}
		})
	}, [intricateWireframeSpiralColor]) // Run when spiral color prop from App.jsx changes

	// INTRICATE WIREFRAME EDGE COLOR UPDATER - Responds to edge color prop changes
	useEffect(() => {
		console.log('Updating intricate wireframe edge color to:', intricateWireframeEdgeColor)
		const convertedColor = new THREE.Color(intricateWireframeEdgeColor)
		
		objectsRef.current.forEach(({ curvedLinesMaterial }, index) => {
			if (curvedLinesMaterial) {
				curvedLinesMaterial.color.copy(convertedColor)
				curvedLinesMaterial.needsUpdate = true
				console.log(`Updated curved lines material ${index} color`)
			}
		})
	}, [intricateWireframeEdgeColor]) // Run when edge color prop from App.jsx changes

	// ===============================================
	// LIGHTING UPDATERS - RESPOND TO LIGHTING PROPS
	// ===============================================
	// These useEffects update the lights when App.jsx changes lighting properties

	// AMBIENT LIGHT UPDATER - Responds to ambient light prop changes
	useEffect(() => {
		if (ambientLightRef.current) {
			// Convert hex color from App.jsx to Three.js color number
			const convertedColor = parseInt(ambientLightColor.replace('#', ''), 16)
			ambientLightRef.current.color.setHex(convertedColor)     // Apply new color from App.jsx
			ambientLightRef.current.intensity = ambientLightIntensity // Apply new intensity from App.jsx
			console.log('Updated ambient light:', ambientLightColor, ambientLightIntensity)
		}
	}, [ambientLightColor, ambientLightIntensity]) // Run when ambient light props from App.jsx change

	// DIRECTIONAL LIGHT UPDATER - Responds to directional light prop changes
	useEffect(() => {
			if (directionalLightRef.current) {
				// Clamp intensity to a minimum value
				const safeIntensity = Math.max(0.05, directionalLightIntensity);
				// Clamp position to a reasonable range
				const clamp = (val, min, max) => Math.max(min, Math.min(max, val));
				const safeX = clamp(directionalLightX, -50, 50);
				const safeY = clamp(directionalLightY, -50, 50);
				const safeZ = clamp(directionalLightZ, -50, 50);
				// Convert hex color from App.jsx to Three.js color number
				const convertedColor = parseInt(directionalLightColor.replace('#', ''), 16)
				directionalLightRef.current.color.setHex(convertedColor)        // Apply new color from App.jsx
				directionalLightRef.current.intensity = safeIntensity // Apply clamped intensity
				// Position the light using clamped X, Y, Z coordinates
				directionalLightRef.current.position.set(safeX, safeY, safeZ)
				console.log('[ThreeScene] Updated directional light:', directionalLightColor, safeIntensity, 'position:', safeX, safeY, safeZ, '| prop Y:', directionalLightY);
			}
	}, [directionalLightColor, directionalLightIntensity, directionalLightX, directionalLightY, directionalLightZ]) 
	// ↑ Run when any directional light props from App.jsx change

	// Add pulse glow effect to meshes
	const clock = new THREE.Clock();

	function animatePulseGlow() {
		const time = clock.getElapsedTime();

		objectsRef.current.forEach(({ solidMesh }) => {
			if (solidMesh) {
				const intensity = (Math.sin(time * 2) + 1) / 2; // Oscillates between 0 and 1
				const color = solidMesh.material.color;
				const hsl = {};
				color.getHSL(hsl);
				color.setHSL(hsl.h, 0.9 + 0.2 * intensity, 0.1 + 0.3 * intensity); // Adjust saturation and brightness
			}
		});

		requestAnimationFrame(animatePulseGlow);
	}

	animatePulseGlow();

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