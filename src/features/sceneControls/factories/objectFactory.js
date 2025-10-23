import * as THREE from 'three';
import { createGeometryByType } from '../geometryCreation';
import { createSolidMaterial, createWireframeMaterial } from './materialFactory';
import { createSphereWireframe } from './wireframeBuilders/sphereWireframe';
import { createBoxWireframe } from './wireframeBuilders/boxWireframe';
import { createOctahedronWireframe } from './wireframeBuilders/octahedronWireframe';
import { 
	createTetrahedronWireframe, 
	createIcosahedronWireframe, 
	createCommonWireframe 
} from './wireframeBuilders/commonWireframe';
import { createTetrahedronIntricateWireframe } from './intricateWireframeBuilders/tetrahedronIntricate';
import { createBoxIntricateWireframe } from './intricateWireframeBuilders/boxIntricate';
import { createOctahedronIntricateWireframe } from './intricateWireframeBuilders/octahedronIntricate';
import { createIcosahedronIntricateWireframe } from './intricateWireframeBuilders/icosahedronIntricate';

/**
 * Creates a complete 3D object with all components:
 * - Solid mesh
 * - Thick wireframe cylinders
 * - Intricate inner wireframes (center lines)
 * - Connecting rods (curved lines)
 * 
 * @param {Object} config - Configuration object
 * @param {string} config.objectType - Type of geometry to create (if single object)
 * @param {number} config.objectCount - Total number of objects being created
 * @param {number} config.objectIndex - Index of this specific object
 * @param {string} config.baseColor - Base color for materials
 * @param {string} config.specularColor - Specular color for materials
 * @param {number} config.shininess - Shininess value for materials
 * @param {number} config.specularIntensity - Specular intensity value
 * @param {number} config.wireframeIntensity - Wireframe opacity intensity
 * @param {string} config.intricateWireframeSpiralColor - Color for spiral center lines
 * @param {string} config.intricateWireframeEdgeColor - Color for edge connections
 * @returns {Object} Object containing all mesh components and metadata
 */
export function createSceneObject(config) {
	const {
		objectType,
		objectCount,
		objectIndex,
		baseColor,
		specularColor,
		shininess,
		specularIntensity,
		wireframeIntensity,
		intricateWireframeSpiralColor,
		intricateWireframeEdgeColor
	} = config;

	// ========================================
	// 1. GEOMETRY SELECTION
	// ========================================
	let geometry;
	if (objectCount === 1) {
		// Single object: use the selected objectType
		geometry = createGeometryByType(objectType);
	} else {
		// Multiple objects: cycle through different types for variety
		const geometryTypes = [
			() => new THREE.IcosahedronGeometry(),
			() => new THREE.SphereGeometry(1, 16, 16),
			() => new THREE.BoxGeometry(1.5, 1.5, 1.5),
			() => new THREE.OctahedronGeometry(),
			() => new THREE.TetrahedronGeometry(1.2),
			() => new THREE.TorusKnotGeometry(1, 0.2, 150, 16),
		];
		geometry = geometryTypes[objectIndex % geometryTypes.length]();
	}

	// Store original vertex positions for advanced animations
	const originalPositions = geometry.attributes.position.array.slice();

	// ========================================
	// 2. MATERIAL CREATION
	// ========================================
	const materialConfig = {
		baseColor,
		specularColor,
		shininess,
		specularIntensity,
		wireframeIntensity,
	};

	const solidMaterial = createSolidMaterial(materialConfig);

	// ========================================
	// 3. SOLID MESH CREATION
	// ========================================
	const solidMesh = new THREE.Mesh(geometry, solidMaterial);

	// ========================================
	// 4. WIREFRAME CREATION (GEOMETRY-SPECIFIC)
	// ========================================
	let wireframeMesh;
	let wireframeMaterial;

	// Create appropriate wireframe based on geometry type
	if (geometry.type === 'SphereGeometry') {
		wireframeMaterial = createWireframeMaterial(materialConfig);
		wireframeMesh = createSphereWireframe(geometry, wireframeMaterial);
	} else if (geometry.type === 'BoxGeometry') {
		wireframeMaterial = createWireframeMaterial(materialConfig);
		wireframeMesh = createBoxWireframe(geometry, wireframeMaterial);
	} else if (geometry.type === 'OctahedronGeometry') {
		wireframeMaterial = createWireframeMaterial(materialConfig);
		wireframeMesh = createOctahedronWireframe(geometry, wireframeMaterial);
	} else if (geometry.type === 'TetrahedronGeometry') {
		wireframeMaterial = createWireframeMaterial(materialConfig);
		wireframeMesh = createTetrahedronWireframe(geometry, wireframeMaterial);
	} else if (geometry.type === 'IcosahedronGeometry') {
		wireframeMaterial = createWireframeMaterial(materialConfig);
		wireframeMesh = createIcosahedronWireframe(geometry, wireframeMaterial);
	} else {
		// Standard thin wireframe for other geometries (TorusKnot, etc.)
		wireframeMaterial = createWireframeMaterial({ 
			...materialConfig, 
			isStandardWireframe: true 
		});
		wireframeMesh = createCommonWireframe(geometry, wireframeMaterial);
	}

	// ========================================
	// 5. INTRICATE WIREFRAME CREATION
	// ========================================
	let centerLines, centerLinesMaterial, curvedLines, curvedLinesMaterial;

	if (geometry.type === 'TetrahedronGeometry' || geometry.constructor.name === 'TetrahedronGeometry') {
		const result = createTetrahedronIntricateWireframe(
			geometry, 
			intricateWireframeSpiralColor, 
			intricateWireframeEdgeColor
		);
		({ centerLines, centerLinesMaterial, curvedLines, curvedLinesMaterial } = result);
	} else if (geometry.type === 'BoxGeometry') {
		const result = createBoxIntricateWireframe(
			geometry, 
			intricateWireframeSpiralColor, 
			intricateWireframeEdgeColor
		);
		({ centerLines, centerLinesMaterial, curvedLines, curvedLinesMaterial } = result);
	} else if (geometry.type === 'OctahedronGeometry') {
		const result = createOctahedronIntricateWireframe(
			geometry, 
			intricateWireframeSpiralColor, 
			intricateWireframeEdgeColor
		);
		({ centerLines, centerLinesMaterial, curvedLines, curvedLinesMaterial } = result);
	} else if (geometry.type === 'IcosahedronGeometry') {
		const result = createIcosahedronIntricateWireframe(
			geometry, 
			intricateWireframeSpiralColor, 
			intricateWireframeEdgeColor
		);
		({ centerLines, centerLinesMaterial, curvedLines, curvedLinesMaterial } = result);
	} else {
		// OTHER GEOMETRIES: Create generic intricate wireframes
		const result = createGenericIntricateWireframe(
			geometry,
			intricateWireframeSpiralColor,
			intricateWireframeEdgeColor
		);
		({ centerLines, centerLinesMaterial, curvedLines, curvedLinesMaterial } = result);
	}

	// ========================================
	// 6. POSITIONING
	// ========================================
	if (objectCount === 1) {
		// Single object at center
		solidMesh.position.set(0, 0, 0);
		wireframeMesh.position.set(0, 0, 0);
		centerLines.position.set(0, 0, 0);
		curvedLines.position.set(0, 0, 0);
	} else {
		// Multiple objects arranged in a circle
		const angle = (objectIndex / objectCount) * Math.PI * 2;
		const radius = 3;
		const x = Math.cos(angle) * radius;
		const y = (Math.random() - 0.9) * 1; // Random Y position for variety
		const z = Math.sin(angle) * radius;

		solidMesh.position.set(x, y, z);
		wireframeMesh.position.set(x, y, z);
		centerLines.position.set(x, y, z);
		curvedLines.position.set(x, y, z);
	}

	// ========================================
	// 7. SHADOW CONFIGURATION
	// ========================================
	solidMesh.castShadow = true;
	solidMesh.receiveShadow = true;
	wireframeMesh.castShadow = true;
	wireframeMesh.receiveShadow = true;

	// ========================================
	// 8. RETURN COMPLETE OBJECT DATA
	// ========================================
	return {
		solidMesh,
		wireframeMesh,
		centerLines,
		curvedLines,
		material: solidMaterial,
		wireframeMaterial,
		centerLinesMaterial,
		curvedLinesMaterial,
		geometry,
		originalPositions,
		// Extract thick cylinders data for vertex deformation animations
		thickCylinders: (wireframeMesh && wireframeMesh.isGroup) 
			? wireframeMesh.children.filter(m => m.isMesh) 
			: null,
		edgePairs: (wireframeMesh && wireframeMesh.userData && wireframeMesh.userData.edgePairs) 
			? wireframeMesh.userData.edgePairs 
			: null,
		// Store original position for animations
		originalPosition: solidMesh.position.clone(),
		// Random phase for varied animations
		phase: Math.random() * Math.PI * 2,
		// Magnetic points for magnetic field animation effect
		magneticPoints: [
			{ 
				x: Math.random() * 4 - 2, 
				y: Math.random() * 4 - 2, 
				z: Math.random() * 4 - 2, 
				strength: Math.random() + 0.5 
			},
			{ 
				x: Math.random() * 4 - 2, 
				y: Math.random() * 4 - 2, 
				z: Math.random() * 4 - 2, 
				strength: Math.random() + 0.5 
			},
			{ 
				x: Math.random() * 4 - 2, 
				y: Math.random() * 4 - 2, 
				z: Math.random() * 4 - 2, 
				strength: Math.random() + 0.5 
			}
		]
	};
}

/**
 * Creates generic intricate wireframes for non-standard geometries (TorusKnot, etc.)
 * Includes spiral center lines and edge connections
 */
function createGenericIntricateWireframe(geometry, spiralColor, edgeColor) {
	const edgesGeometry = new THREE.EdgesGeometry(geometry);
	const edgeVertices = edgesGeometry.attributes.position.array;

	// ========================================
	// 1. CREATE CENTER LINES (Spiral connections)
	// ========================================
	const centerLinesGeometry = new THREE.BufferGeometry();
	const centerLinesPositions = [];

	// Determine if this geometry type should have center lines
	let createCenterLines = true;
	if (geometry.type === 'TorusKnotGeometry') {
		createCenterLines = false; // No center lines for torus
	}

	if (createCenterLines) {
		// Use actual wireframe edge endpoints for connections
		for (let j = 0; j < edgeVertices.length; j += 12) { // Every other edge
			const endX = edgeVertices[j + 3]; // End point of edge
			const endY = edgeVertices[j + 4];
			const endZ = edgeVertices[j + 5];

			// Create spiral path from center to edge endpoint
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
				const normalizer = Math.sqrt(endX * endX + endY * endY + endZ * endZ);
				const x1 = Math.cos(angle1) * radius1 * (endX / normalizer);
				const y1 = Math.sin(angle1) * radius1 * (endY / normalizer) + t1 * endY;
				const z1 = t1 * endZ;

				const x2 = Math.cos(angle2) * radius2 * (endX / normalizer);
				const y2 = Math.sin(angle2) * radius2 * (endY / normalizer) + t2 * endY;
				const z2 = t2 * endZ;

				centerLinesPositions.push(x1, y1, z1, x2, y2, z2);
			}
		}
	}

	// Create center lines mesh
	let centerLines, centerLinesMaterial;
	if (centerLinesPositions.length > 0) {
		centerLinesGeometry.setAttribute(
			'position', 
			new THREE.Float32BufferAttribute(centerLinesPositions, 3)
		);

		centerLinesMaterial = new THREE.LineBasicMaterial({
			color: new THREE.Color(spiralColor),
			transparent: true,
			opacity: 0.6,
		});

		centerLines = new THREE.LineSegments(centerLinesGeometry, centerLinesMaterial);
	} else {
		centerLines = new THREE.Object3D();
		centerLinesMaterial = null;
	}

	// ========================================
	// 2. CREATE CURVED LINES (Edge connections)
	// ========================================
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
				(edge1End[0] - edge2Start[0]) ** 2 +
				(edge1End[1] - edge2Start[1]) ** 2 +
				(edge1End[2] - edge2Start[2]) ** 2
			);

			const dist2 = Math.sqrt(
				(edge1End[0] - edge2End[0]) ** 2 +
				(edge1End[1] - edge2End[1]) ** 2 +
				(edge1End[2] - edge2End[2]) ** 2
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

	// Create curved lines mesh
	let curvedLines, curvedLinesMaterial;
	if (curvedLinesPositions.length > 0) {
		curvedLinesGeometry.setAttribute(
			'position', 
			new THREE.Float32BufferAttribute(curvedLinesPositions, 3)
		);

		curvedLinesMaterial = new THREE.LineBasicMaterial({
			color: new THREE.Color(edgeColor),
			transparent: true,
			opacity: 0.4,
		});

		curvedLines = new THREE.LineSegments(curvedLinesGeometry, curvedLinesMaterial);
	} else {
		curvedLines = new THREE.Object3D();
		curvedLinesMaterial = null;
	}

	return { centerLines, centerLinesMaterial, curvedLines, curvedLinesMaterial };
}
