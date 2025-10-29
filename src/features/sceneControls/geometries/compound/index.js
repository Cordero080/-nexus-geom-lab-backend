/**
 * Compound Geometries Barrel Export
 *
 * This file provides centralized exports for all compound geometry modules.
 * Compound geometries are built from multiple merged simple geometries.
 */

export { createSphere, metadata as sphereMetadata } from "./sphere.js";
export {
  createCompoundSphere,
  metadata as compoundSphereMetadata,
} from "./compoundSphere.js";
