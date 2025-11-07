/**
 * Polytopes Geometries Barrel Export
 *
 * This file provides centralized exports for all polytope geometry modules.
 * Polytopes are multi-dimensional geometric shapes including:
 * - 3D polytopes: icosahedron, octahedron, tetrahedron
 * - 4D polytopes: tesseracts, 120-cell, 24-cell, 16-cell, 600-cell
 */

export {
  createIcosahedron,
  metadata as icosahedronMetadata,
} from "./icosahedron.js";
export { createHypercube, metadata as hypercubeMetadata } from "./hypercube.js";
export {
  createSimpleCompoundHypercube,
  metadata as simpleCompoundHypercubeMetadata,
} from "./simpleCompoundHypercube.js";
export {
  createCompoundHypercube,
  metadata as compoundHypercubeMetadata,
} from "./compoundHypercube.js";
export {
  createOctahedron,
  metadata as octahedronMetadata,
} from "./octahedron.js";
export {
  createTetrahedron,
  metadata as tetrahedronMetadata,
} from "./tetrahedron.js";
export {
  createCompoundTesseract,
  metadata as compoundTesseractMetadata,
} from "./compoundTesseract.js";
export {
  createMegaTesseract,
  metadata as megaTesseractMetadata,
} from "./megaTesseract.js";
export {
  createCompoundMegaTesseract,
  metadata as compoundMegaTesseractMetadata,
} from "./compoundMegaTesseract.js";
export {
  createCompoundMegaTesseractNested,
  metadata as compoundMegaTesseractNestedMetadata,
} from "./compoundMegaTesseract2.js";
export {
  createCompoundMegaTesseractExperimental,
  metadata as compoundMegaTesseractExperimentalMetadata,
} from "./compoundMegaTesseract3.js";
export {
  createCompoundMegaTesseractAxisShift,
  metadata as compoundMegaTesseractAxisShiftMetadata,
} from "./compoundMegaTesseract4.js";
export {
  createHessianPolychoron,
  metadata as hessianPolychoronMetadata,
} from "./hessianPolychoron.js";
export { create120Cell, metadata as cell120Metadata } from "./cell120.js";
export {
  createCompound120Cell,
  metadata as compoundCell120Metadata,
} from "./compoundCell120.js";
export { create24Cell, metadata as cell24Metadata } from "./cell24.js";
export {
  createCompound24Cell,
  metadata as compoundCell24Metadata,
} from "./compoundCell24.js";
export { create16Cell, metadata as cell16Metadata } from "./cell16.js";
export { create600Cell, metadata as cell600Metadata } from "./cell600.js";
export {
  createCompound600Cell,
  metadata as compoundCell600Metadata,
} from "./compoundCell600.js";
