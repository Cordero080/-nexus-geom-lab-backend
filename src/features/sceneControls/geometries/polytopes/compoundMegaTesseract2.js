import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils";

// Cache built geometries to avoid recomputing the expensive sweep on reselection.
const geometryCache = new Map();
const CACHE_LABEL = "compoundMegaTesseractNested";

function stableStringify(value) {
  if (value === null) return "null";
  const type = typeof value;
  if (type === "number" || type === "boolean") return JSON.stringify(value);
  if (type === "string") return JSON.stringify(value);
  if (type === "undefined") return '"__undefined__"';
  if (type === "function") return '"__function__"';
  if (Array.isArray(value)) {
    return `[${value.map((item) => stableStringify(item)).join(",")}]`;
  }
  if (value instanceof Date) {
    return JSON.stringify(value.toISOString());
  }
  if (value && typeof value === "object") {
    const keys = Object.keys(value).sort();
    const entries = keys.map(
      (key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`
    );
    return `{${entries.join(",")}}`;
  }
  return JSON.stringify(value);
}

function createCacheKey(options) {
  if (!options || typeof options !== "object") return "default";
  try {
    const signature = stableStringify(options);
    return signature === "{}" ? "default" : `opts:${signature}`;
  } catch (error) {
    console.warn(
      `${CACHE_LABEL}: failed to stringify options for cache`,
      error
    );
    return null;
  }
}

function cloneUserData(data = {}) {
  const cloned = { ...data };
  for (const key of Object.keys(cloned)) {
    const value = cloned[key];
    if (Array.isArray(value)) cloned[key] = value.slice();
  }
  return cloned;
}

function cloneWithUserData(source) {
  const geometryClone = source.clone();
  geometryClone.userData = cloneUserData(source.userData);
  return geometryClone;
}

function createTesseractWithFaces(outerSize, innerSize, rotation = null) {
  const geometries = [];

  const outer = new THREE.BoxGeometry(outerSize, outerSize, outerSize);
  if (rotation) outer.rotateY(rotation);
  geometries.push(outer);

  const inner = new THREE.BoxGeometry(innerSize, innerSize, innerSize);
  if (rotation) inner.rotateY(rotation);
  inner.translate(0, 0.01, 0);
  geometries.push(inner);

  const halfOuter = outerSize / 2;
  const halfInner = innerSize / 2;
  const depth = (outerSize - innerSize) / 2;

  const topFrustum = new THREE.CylinderGeometry(halfInner, halfOuter, depth, 4);
  topFrustum.rotateY(Math.PI / 4);
  topFrustum.translate(0, halfOuter + depth / 2, 0);
  if (rotation) topFrustum.rotateY(rotation);
  geometries.push(topFrustum);

  const bottomFrustum = new THREE.CylinderGeometry(
    halfOuter,
    halfInner,
    depth,
    4
  );
  bottomFrustum.rotateY(Math.PI / 4);
  bottomFrustum.translate(0, -(halfOuter + depth / 2), 0);
  if (rotation) bottomFrustum.rotateY(rotation);
  geometries.push(bottomFrustum);

  const frontFrustum = new THREE.CylinderGeometry(
    halfInner,
    halfOuter,
    depth,
    4
  );
  frontFrustum.rotateY(Math.PI / 4);
  frontFrustum.rotateX(Math.PI / 2);
  frontFrustum.translate(0, 0, halfOuter + depth / 2);
  if (rotation) frontFrustum.rotateY(rotation);
  geometries.push(frontFrustum);

  const backFrustum = new THREE.CylinderGeometry(
    halfOuter,
    halfInner,
    depth,
    4
  );
  backFrustum.rotateY(Math.PI / 4);
  backFrustum.rotateX(Math.PI / 2);
  backFrustum.translate(0, 0, -(halfOuter + depth / 2));
  if (rotation) backFrustum.rotateY(rotation);
  geometries.push(backFrustum);

  const rightFrustum = new THREE.CylinderGeometry(
    halfInner,
    halfOuter,
    depth,
    4
  );
  rightFrustum.rotateY(Math.PI / 4);
  rightFrustum.rotateZ(Math.PI / 2);
  rightFrustum.translate(halfOuter + depth / 2, 0, 0);
  if (rotation) rightFrustum.rotateY(rotation);
  geometries.push(rightFrustum);

  const leftFrustum = new THREE.CylinderGeometry(
    halfOuter,
    halfInner,
    depth,
    4
  );
  leftFrustum.rotateY(Math.PI / 4);
  leftFrustum.rotateZ(Math.PI / 2);
  leftFrustum.translate(-(halfOuter + depth / 2), 0, 0);
  if (rotation) leftFrustum.rotateY(rotation);
  geometries.push(leftFrustum);

  return mergeGeometries(geometries, false);
}

export function createCompoundMegaTesseractNested(options = {}) {
  const cacheKey = createCacheKey(options);
  const cachedGeometry = cacheKey ? geometryCache.get(cacheKey) : null;
  if (cachedGeometry) return cloneWithUserData(cachedGeometry);

  const primaryTesseract = createTesseractWithFaces(2.0, 1.5, Math.PI / 8);
  primaryTesseract.translate(0, 0.01, 0);

  const rotatedTesseract = createTesseractWithFaces(
    2.0,
    1.5,
    Math.PI / 8 + Math.PI / 4
  );
  rotatedTesseract.translate(0, 0.02, 0);

  const innerScale = 0.85;

  const innerPrimary = primaryTesseract.clone();
  innerPrimary.scale(innerScale, innerScale, innerScale);
  innerPrimary.translate(0, 0.03, 0);

  const innerRotated = rotatedTesseract.clone();
  innerRotated.scale(innerScale, innerScale, innerScale);
  innerRotated.translate(0, 0.04, 0);

  const mergedCompoundMega = mergeGeometries(
    [primaryTesseract, rotatedTesseract, innerPrimary, innerRotated],
    false
  );

  mergedCompoundMega.computeVertexNormals();

  mergedCompoundMega.userData.isCompound = true;
  mergedCompoundMega.userData.isCpdTesseract = true;
  mergedCompoundMega.userData.baseType = "BoxGeometry";
  mergedCompoundMega.userData.isMegaTesseract = true;
  mergedCompoundMega.userData.isCompoundMegaTesseract = true;
  mergedCompoundMega.userData.componentCount = 4;
  mergedCompoundMega.userData.variant = "nested";

  if (cacheKey) geometryCache.set(cacheKey, mergedCompoundMega);

  return cloneWithUserData(mergedCompoundMega);
}

export const metadata = {
  name: "cpd-megatesseract-2",
  displayName: "💎💎 Compound Mega-Tesseract II",
  category: "polytopes",
  description:
    "Layered mega tesseract with a scaled inner pair for nested depth",
  isCompound: true,
  isSuperCompound: true,
  isUltraCompound: true,
  defaultOptions: {},
};
