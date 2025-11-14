/**
 * Manifolds Geometries Barrel Export
 *
 * This file provides centralized exports for all manifold geometry modules.
 * Manifolds are geometries with special topological properties like
 * non-orientable surfaces (Klein bottles, Möbius strips).
 */

export { createQuantumManifold, metadata as quantumManifoldMetadata } from './quantumManifold.js';
export {
  createCompoundQuantumManifold,
  metadata as compoundQuantumManifoldMetadata,
} from './compoundQuantumManifold.js';
export { createMobiusSphere, metadata as mobiusSphereMetadata } from './mobiusSphere.js';
