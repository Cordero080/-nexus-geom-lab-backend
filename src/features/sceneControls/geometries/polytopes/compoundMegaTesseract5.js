import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils';
import { createTesseractWithFaces } from '../../utils/geometryHelpers';

const baseGeometryCache = new Map();
const finalGeometryCache = new Map();
const BASE_CACHE_LABEL = 'compoundMegaTesseractFive:base';
const FINAL_CACHE_LABEL = 'compoundMegaTesseractFive';

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

function createCacheKey(options, label) {
  if (!options || typeof options !== 'object') return 'default';
  try {
    const signature = stableStringify(options);
    return signature === '{}' ? 'default' : `opts:${signature}`;
  } catch (error) {
    return null;
  }
}

function cloneUserData(data = {}) {
  const cloned = { ...data };
  for (const key of Object.keys(cloned)) {
    const value = cloned[key];
    if (Array.isArray(value)) cloned[key] = value.slice();
    else if (value && typeof value === 'object') cloned[key] = { ...value };
  }
  return cloned;
}

function cloneWithUserData(source) {
  const geometryClone = source.clone();
  geometryClone.userData = cloneUserData(source.userData);
  return geometryClone;
}

function createCompoundMegaBase(options = {}) {
  const axisKey = options.cpdMega5Axis || 'x';
  const axisMap = {
    x: new THREE.Vector3(1, 0, 0),
    y: new THREE.Vector3(0, 1, 0),
    z: new THREE.Vector3(0, 0, 1),
  };
  const translationAxis = (axisMap[axisKey] || axisMap.z).clone().normalize();

  const translationStep =
    typeof options.cpdMega5TranslationStep === 'number'
      ? Math.max(0.0005, options.cpdMega5TranslationStep)
      : 0.0115;
  const layerGap =
    typeof options.cpdMega5LayerGap === 'number' ? Math.max(0, options.cpdMega5LayerGap) : 0.07;
  const baseOffset =
    typeof options.cpdMega5BaseOffset === 'number'
      ? Math.max(0, options.cpdMega5BaseOffset)
      : 0.014;
  const twistStep =
    typeof options.cpdMega5TwistStep === 'number' ? options.cpdMega5TwistStep : Math.PI / 8;
  const radialStep =
    typeof options.cpdMega5RadialStep === 'number'
      ? Math.max(0, options.cpdMega5RadialStep)
      : 0.048;
  const sweepScalesSource =
    Array.isArray(options.cpdMega5Scales) && options.cpdMega5Scales.length >= 2
      ? options.cpdMega5Scales
      : null;
  const sweepScales = sweepScalesSource ? sweepScalesSource.slice() : [1.0, 0.78, 0.58, 0.42];

  const normalizedOptions = {
    axisKey,
    translationStep,
    layerGap,
    baseOffset,
    twistStep,
    radialStep,
    sweepScales: sweepScales.slice(),
  };

  const cacheKey = createCacheKey(normalizedOptions, BASE_CACHE_LABEL);
  const cachedGeometry = cacheKey ? baseGeometryCache.get(cacheKey) : null;
  if (cachedGeometry) return cloneWithUserData(cachedGeometry);

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

    const pushGeom = (geom, patternStep) => {
      const instance = geom.clone();

      const twistAngle = patternStep * twistStep;
      if (twistAngle !== 0) {
        const twistQuat = new THREE.Quaternion().setFromAxisAngle(translationAxis, twistAngle);
        instance.applyQuaternion(twistQuat);
      }

      const radialMagnitude = startOffset * 0.58 + Math.abs(patternStep) * radialStep;
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

      sweeps.push(instance);
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
  };

  const sweepOffsets = sweepScales.map((_, index) => baseOffset + layerGap * index);

  sweepScales.forEach((scale, index) => {
    addSweep(scale, sweepOffsets[index]);
  });

  const mergedCompoundMega = mergeGeometries(sweeps, false);
  mergedCompoundMega.scale(0.78, 0.78, 0.78);
  mergedCompoundMega.computeVertexNormals();

  mergedCompoundMega.userData.isCompound = true;
  mergedCompoundMega.userData.isCpdTesseract = true;
  mergedCompoundMega.userData.baseType = 'BoxGeometry';
  mergedCompoundMega.userData.isMegaTesseract = true;
  mergedCompoundMega.userData.isCompoundMegaTesseract = true;
  mergedCompoundMega.userData.componentCount = sweeps.length;
  mergedCompoundMega.userData.variant = 'cpd-megatesseract-5-base';
  mergedCompoundMega.userData.translationStep = translationStep;
  mergedCompoundMega.userData.layerGap = layerGap;
  mergedCompoundMega.userData.baseOffset = baseOffset;
  mergedCompoundMega.userData.translationAxis = axisKey;
  mergedCompoundMega.userData.sweepScales = sweepScales.slice();
  mergedCompoundMega.userData.twistStep = twistStep;
  mergedCompoundMega.userData.radialStep = radialStep;
  mergedCompoundMega.userData.optionSignature = {
    axisKey,
    translationStep,
    layerGap,
    baseOffset,
    twistStep,
    radialStep,
    sweepScales: sweepScales.slice(),
  };

  if (cacheKey) baseGeometryCache.set(cacheKey, mergedCompoundMega);

  return cloneWithUserData(mergedCompoundMega);
}

export function createCompoundMegaTesseractFive(options = {}) {
  const baseCompound = createCompoundMegaBase(options);
  const baseSignature = baseCompound.userData?.optionSignature || null;

  const primary = baseCompound;
  const duplicate = cloneWithUserData(baseCompound);

  const duplicateScale =
    typeof options.cpdMega5DuplicateScale === 'number'
      ? Math.max(0.1, options.cpdMega5DuplicateScale)
      : 0.9;
  duplicate.scale(duplicateScale, duplicateScale, duplicateScale);

  const rotationInput = options.cpdMega5DuplicateRotation || {};
  const duplicateRotation = {
    x: typeof rotationInput.x === 'number' ? rotationInput.x : Math.PI / 6,
    y: typeof rotationInput.y === 'number' ? rotationInput.y : Math.PI / 4,
    z: typeof rotationInput.z === 'number' ? rotationInput.z : Math.PI / 3,
  };
  if (duplicateRotation.x) duplicate.rotateX(duplicateRotation.x);
  if (duplicateRotation.y) duplicate.rotateY(duplicateRotation.y);
  if (duplicateRotation.z) duplicate.rotateZ(duplicateRotation.z);

  const offsetMagnitude =
    typeof options.cpdMega5DuplicateOffset === 'number' ? options.cpdMega5DuplicateOffset : 0.32;
  const offsetY =
    typeof options.cpdMega5DuplicateOffsetY === 'number'
      ? options.cpdMega5DuplicateOffsetY
      : offsetMagnitude * 0.45;
  const offsetZ =
    typeof options.cpdMega5DuplicateOffsetZ === 'number'
      ? options.cpdMega5DuplicateOffsetZ
      : -offsetMagnitude * 0.82;
  duplicate.translate(offsetMagnitude, offsetY, offsetZ);

  const mirrorEnabled = options.cpdMega5MirrorDuplicate !== false;
  const mirrorScale =
    typeof options.cpdMega5MirrorScale === 'number'
      ? Math.max(0.1, options.cpdMega5MirrorScale)
      : 0.84;
  const mirrorOffset =
    typeof options.cpdMega5MirrorOffset === 'number'
      ? options.cpdMega5MirrorOffset
      : -offsetMagnitude * 0.85;

  const signature = {
    base: baseSignature,
    duplicateScale,
    duplicateRotation,
    duplicateOffset: {
      magnitude: offsetMagnitude,
      y: offsetY,
      z: offsetZ,
    },
    mirrorEnabled,
    mirrorScale: mirrorEnabled ? mirrorScale : null,
    mirrorOffset: mirrorEnabled ? mirrorOffset : null,
  };

  const cacheKey = createCacheKey(signature, FINAL_CACHE_LABEL);
  const cachedGeometry = cacheKey ? finalGeometryCache.get(cacheKey) : null;
  if (cachedGeometry) return cloneWithUserData(cachedGeometry);

  let mirrored = null;
  if (mirrorEnabled) {
    mirrored = cloneWithUserData(baseCompound);
    mirrored.scale(mirrorScale, mirrorScale, mirrorScale);
    mirrored.rotateX(-(duplicateRotation.x || 0) * 0.8);
    mirrored.rotateY(-(duplicateRotation.y || 0));
    mirrored.rotateZ((duplicateRotation.z || 0) * 0.5);
    mirrored.translate(mirrorOffset, -offsetY * 0.9, -offsetZ * 0.6);
  }

  const geometries = mirrorEnabled ? [primary, duplicate, mirrored] : [primary, duplicate];

  const merged = mergeGeometries(geometries, false);
  merged.computeVertexNormals();

  const baseComponentCount = baseCompound.userData?.componentCount || 0;

  merged.userData.isCompound = true;
  merged.userData.isCpdTesseract = true;
  merged.userData.baseType = 'BoxGeometry';
  merged.userData.isMegaTesseract = true;
  merged.userData.isCompoundMegaTesseract = true;
  merged.userData.componentCount = baseComponentCount * geometries.length || geometries.length;
  merged.userData.variant = 'self-merged-duplicate';
  merged.userData.duplicateScale = duplicateScale;
  merged.userData.duplicateRotation = duplicateRotation;
  merged.userData.duplicateOffset = {
    x: offsetMagnitude,
    y: offsetY,
    z: offsetZ,
  };
  merged.userData.mirrorEnabled = mirrorEnabled;
  merged.userData.mirrorScale = mirrorEnabled ? mirrorScale : null;
  merged.userData.mirrorOffset = mirrorEnabled ? mirrorOffset : null;
  merged.userData.baseTranslationStep = baseCompound.userData?.translationStep ?? null;
  merged.userData.baseLayerGap = baseCompound.userData?.layerGap ?? null;
  merged.userData.baseOffset = baseCompound.userData?.baseOffset ?? null;
  merged.userData.baseSweepScales = baseCompound.userData?.sweepScales ?? null;
  merged.userData.baseTranslationAxis = baseCompound.userData?.translationAxis ?? null;
  merged.userData.optionSignature = signature;
  merged.userData.baseSignature = baseSignature;

  if (cacheKey) finalGeometryCache.set(cacheKey, merged);

  return cloneWithUserData(merged);
}

export const metadata = {
  name: 'cpd-megatesseract-5',
  displayName: '💎💎💎💎 Compound Mega-Tesseract V',
  category: 'polytopes',
  description: 'Self-merged compound mega tesseract with mirrored duplicate overlays',
  isCompound: true,
  isSuperCompound: true,
  isUltraCompound: true,
  defaultOptions: {},
};
