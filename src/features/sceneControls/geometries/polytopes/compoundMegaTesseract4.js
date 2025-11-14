import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils';

// Cache built geometries to avoid recomputing the expensive sweep on reselection.
const geometryCache = new Map();
const CACHE_LABEL = 'compoundMegaTesseractAxisShift';

function stableStringify(value) {
  if (value === null) return 'null';
  const type = typeof value;
  if (type === 'number' || type === 'boolean') return JSON.stringify(value);
  if (type === 'string') return JSON.stringify(value);
  if (type === 'undefined') return '"__undefined__"';
  if (type === 'function') return '"__function__"';
  if (Array.isArray(value)) {
    return `[${value.map((item) => stableStringify(item)).join(',')}]`;
  }
  if (value instanceof Date) {
    return JSON.stringify(value.toISOString());
  }
  if (value && typeof value === 'object') {
    const keys = Object.keys(value).sort();
    const entries = keys.map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`);
    return `{${entries.join(',')}}`;
  }
  return JSON.stringify(value);
}

function createCacheKey(options) {
  if (!options || typeof options !== 'object') return 'default';
  try {
    const signature = stableStringify(options);
    return signature === '{}' ? 'default' : `opts:${signature}`;
  } catch (error) {
    // Failed to stringify options for cache
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

  const bottomFrustum = new THREE.CylinderGeometry(halfOuter, halfInner, depth, 4);
  bottomFrustum.rotateY(Math.PI / 4);
  bottomFrustum.translate(0, -(halfOuter + depth / 2), 0);
  if (rotation) bottomFrustum.rotateY(rotation);
  geometries.push(bottomFrustum);

  const frontFrustum = new THREE.CylinderGeometry(halfInner, halfOuter, depth, 4);
  frontFrustum.rotateY(Math.PI / 4);
  frontFrustum.rotateX(Math.PI / 2);
  frontFrustum.translate(0, 0, halfOuter + depth / 2);
  if (rotation) frontFrustum.rotateY(rotation);
  geometries.push(frontFrustum);

  const backFrustum = new THREE.CylinderGeometry(halfOuter, halfInner, depth, 4);
  backFrustum.rotateY(Math.PI / 4);
  backFrustum.rotateX(Math.PI / 2);
  backFrustum.translate(0, 0, -(halfOuter + depth / 2));
  if (rotation) backFrustum.rotateY(rotation);
  geometries.push(backFrustum);

  const rightFrustum = new THREE.CylinderGeometry(halfInner, halfOuter, depth, 4);
  rightFrustum.rotateY(Math.PI / 4);
  rightFrustum.rotateZ(Math.PI / 2);
  rightFrustum.translate(halfOuter + depth / 2, 0, 0);
  if (rotation) rightFrustum.rotateY(rotation);
  geometries.push(rightFrustum);

  const leftFrustum = new THREE.CylinderGeometry(halfOuter, halfInner, depth, 4);
  leftFrustum.rotateY(Math.PI / 4);
  leftFrustum.rotateZ(Math.PI / 2);
  leftFrustum.translate(-(halfOuter + depth / 2), 0, 0);
  if (rotation) leftFrustum.rotateY(rotation);
  geometries.push(leftFrustum);

  return mergeGeometries(geometries, false);
}

export function createCompoundMegaTesseractAxisShift(options = {}) {
  const axisKey = options.cpdMega4Axis || 'x';
  const translationStep =
    typeof options.cpdMega4TranslationStep === 'number'
      ? Math.max(0.0005, options.cpdMega4TranslationStep)
      : 0.012;
  const layerGap =
    typeof options.cpdMega4LayerGap === 'number' ? Math.max(0, options.cpdMega4LayerGap) : 0.075;
  const baseOffset =
    typeof options.cpdMega4BaseOffset === 'number'
      ? Math.max(0, options.cpdMega4BaseOffset)
      : 0.015;
  const twistStep =
    typeof options.cpdMega4TwistStep === 'number' ? options.cpdMega4TwistStep : Math.PI / 9;
  const radialStep =
    typeof options.cpdMega4RadialStep === 'number' ? Math.max(0, options.cpdMega4RadialStep) : 0.05;
  const sweepScales =
    Array.isArray(options.cpdMega4Scales) && options.cpdMega4Scales.length >= 2
      ? options.cpdMega4Scales
      : [1.0, 0.82, 0.64, 0.46];

  const normalizedOptions = {
    axisKey,
    translationStep,
    layerGap,
    baseOffset,
    twistStep,
    radialStep,
    sweepScales,
  };
  const cacheKey = createCacheKey(normalizedOptions);
  const cachedGeometry = cacheKey ? geometryCache.get(cacheKey) : null;
  if (cachedGeometry) return cloneWithUserData(cachedGeometry);

  const axisMap = {
    x: new THREE.Vector3(1, 0, 0),
    y: new THREE.Vector3(0, 1, 0),
    z: new THREE.Vector3(0, 0, 1),
  };
  const translationAxis = (axisMap[axisKey] || axisMap.z).clone().normalize();

  const upVector = new THREE.Vector3(0, 1, 0);
  const fallback = new THREE.Vector3(1, 0, 0);
  let radialBasis = new THREE.Vector3().crossVectors(translationAxis, upVector);
  if (radialBasis.lengthSq() < 1e-5) {
    radialBasis = new THREE.Vector3().crossVectors(translationAxis, fallback);
  }
  radialBasis.normalize();

  const basePrimary = createTesseractWithFaces(2.0, 1.5, Math.PI / 8);
  const baseRotated = createTesseractWithFaces(2.0, 1.5, Math.PI / 8 + Math.PI / 4);

  const sweepOffset = Math.PI / 5;
  const diagonalTilt = Math.PI / 6;

  const sweeps = [];

  const addSweep = (scale, startOffset) => {
    const scaledPrimary = basePrimary.clone();
    const scaledRotated = baseRotated.clone();
    scaledPrimary.scale(scale, scale, scale);
    scaledRotated.scale(scale, scale, scale);

    const sweepGeoms = [];

    const pushGeom = (geom, patternStep) => {
      const instance = geom.clone();

      const twistAngle = patternStep * twistStep;
      if (twistAngle !== 0) {
        const twistQuat = new THREE.Quaternion().setFromAxisAngle(translationAxis, twistAngle);
        instance.applyQuaternion(twistQuat);
      }

      const radialMagnitude = startOffset * 0.6 + Math.abs(patternStep) * radialStep;
      if (radialMagnitude > 0.0001) {
        const radialDirection = radialBasis.clone().applyAxisAngle(translationAxis, twistAngle);
        if (patternStep < 0) radialDirection.negate();
        instance.translate(
          radialDirection.x * radialMagnitude,
          radialDirection.y * radialMagnitude,
          radialDirection.z * radialMagnitude
        );
      }

      const axialMagnitude = startOffset + Math.abs(patternStep) * translationStep;
      const axialDirection = patternStep >= 0 ? 1 : -1;
      instance.translate(
        translationAxis.x * axialMagnitude * axialDirection,
        translationAxis.y * axialMagnitude * axialDirection,
        translationAxis.z * axialMagnitude * axialDirection
      );

      sweepGeoms.push(instance);
    };

    pushGeom(scaledPrimary, 0);

    const tiltedRotated = scaledRotated.clone();
    tiltedRotated.rotateX(diagonalTilt);
    pushGeom(tiltedRotated, 1);

    const posPrimary = scaledPrimary.clone();
    posPrimary.rotateZ(sweepOffset);
    pushGeom(posPrimary, -1);

    const posRotated = scaledRotated.clone();
    posRotated.rotateZ(sweepOffset);
    pushGeom(posRotated, 2);

    const negPrimary = scaledPrimary.clone();
    negPrimary.rotateZ(-sweepOffset);
    pushGeom(negPrimary, -2);

    const negRotated = scaledRotated.clone();
    negRotated.rotateZ(-sweepOffset);
    pushGeom(negRotated, 3);

    sweeps.push(...sweepGeoms);
  };

  const sweepOffsets = sweepScales.map((_, index) => baseOffset + layerGap * index);

  sweepScales.forEach((scale, index) => {
    addSweep(scale, sweepOffsets[index]);
  });

  const mergedCompoundMega = mergeGeometries(sweeps, false);
  mergedCompoundMega.scale(0.8, 0.8, 0.8);
  mergedCompoundMega.computeVertexNormals();

  mergedCompoundMega.userData.isCompound = true;
  mergedCompoundMega.userData.isCpdTesseract = true;
  mergedCompoundMega.userData.baseType = 'BoxGeometry';
  mergedCompoundMega.userData.isMegaTesseract = true;
  mergedCompoundMega.userData.isCompoundMegaTesseract = true;
  mergedCompoundMega.userData.componentCount = sweeps.length;
  mergedCompoundMega.userData.variant = 'axis-radial-twist';
  mergedCompoundMega.userData.translationStep = translationStep;
  mergedCompoundMega.userData.layerGap = layerGap;
  mergedCompoundMega.userData.baseOffset = baseOffset;
  mergedCompoundMega.userData.translationAxis = axisKey;
  mergedCompoundMega.userData.sweepScales = sweepScales;
  mergedCompoundMega.userData.twistStep = twistStep;
  mergedCompoundMega.userData.radialStep = radialStep;
  mergedCompoundMega.userData.optionSignature = normalizedOptions;

  if (cacheKey) geometryCache.set(cacheKey, mergedCompoundMega);

  return cloneWithUserData(mergedCompoundMega);
}

export const metadata = {
  name: 'cpd-megatesseract-4',
  displayName: '💎💎💎 Compound Mega-Tesseract IV',
  category: 'polytopes',
  description: 'Radial step sweep with axial twist for spiral resonance bands',
  isCompound: true,
  isSuperCompound: true,
  isUltraCompound: true,
  defaultOptions: {},
};
