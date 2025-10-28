/**
 * Curved Geometries Barrel Export
 *
 * This file provides centralized exports for all curved geometry modules.
 * Curved geometries use smooth surfaces like spheres, tori, and capsules.
 */

export { createTorus, metadata as torusMetadata } from "./torus.js";
export {
  createFloatingCity,
  metadata as floatingCityMetadata,
} from "./floatingCity.js";
export {
  createCompoundFloatingCity,
  metadata as compoundFloatingCityMetadata,
} from "./compoundFloatingCity.js";
export { createCapsule, metadata as capsuleMetadata } from "./capsule.js";
