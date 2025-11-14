import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils';
import { createTesseractWithFaces } from '../../utils/geometryHelpers';

// Cache built geometries to avoid recomputing the expensive sweep on reselection.
const geometryCache = new Map();
const CACHE_LABEL = 'compoundMegaTesseractExperimental';

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

export function createCompoundMegaTesseractExperimental(options = {}) {
  const { cpdMega3TranslationStep, cpdMega3LayerGap, cpdMega3BaseOffset } = options || {};

  const translationStep =
    typeof cpdMega3TranslationStep === 'number' ? Math.max(0.0001, cpdMega3TranslationStep) : 0.01;
  const layerGap = typeof cpdMega3LayerGap === 'number' ? Math.max(0, cpdMega3LayerGap) : 0.065;
  const baseOffset =
    typeof cpdMega3BaseOffset === 'number' ? Math.max(0, cpdMega3BaseOffset) : 0.01;

  const normalizedOptions = { translationStep, layerGap, baseOffset };
  const cacheKey = createCacheKey(normalizedOptions);
  const cachedGeometry = cacheKey ? geometryCache.get(cacheKey) : null;
  if (cachedGeometry) return cloneWithUserData(cachedGeometry);

  const basePrimary = createTesseractWithFaces(2.0, 1.5, Math.PI / 8);
  const baseRotated = createTesseractWithFaces(2.0, 1.5, Math.PI / 8 + Math.PI / 4);

  const sweepOffset = Math.PI / 6; // 30° phased rotation cadence

  const sweepScales = [1.0, 0.72, 0.52];

  const sweeps = [];

  const addSweep = (scale, startOffset) => {
    const scaledPrimary = basePrimary.clone();
    const scaledRotated = baseRotated.clone();
    scaledPrimary.scale(scale, scale, scale);
    scaledRotated.scale(scale, scale, scale);

    const sweepGeoms = [];

    const pushGeom = (geom, translateUnits) => {
      const instance = geom.clone();
      instance.translate(0, startOffset + translateUnits * translationStep, 0);
      sweepGeoms.push(instance);
    };

    // Base orientation pair
    pushGeom(scaledPrimary, 0);
    pushGeom(scaledRotated, 1);

    // Positive phase pair
    const posPrimary = scaledPrimary.clone();
    posPrimary.rotateY(sweepOffset);
    pushGeom(posPrimary, 2);

    const posRotated = scaledRotated.clone();
    posRotated.rotateY(sweepOffset);
    pushGeom(posRotated, 3);

    // Negative phase pair
    const negPrimary = scaledPrimary.clone();
    negPrimary.rotateY(-sweepOffset);
    pushGeom(negPrimary, 4);

    const negRotated = scaledRotated.clone();
    negRotated.rotateY(-sweepOffset);
    pushGeom(negRotated, 5);

    sweeps.push(...sweepGeoms);
  };

  const sweepOffsets = [baseOffset, baseOffset + layerGap, baseOffset + layerGap * 2];

  sweepScales.forEach((scale, index) => {
    addSweep(scale, sweepOffsets[index]);
  });

  const mergedCompoundMega = mergeGeometries(sweeps, false);

  mergedCompoundMega.computeVertexNormals();

  mergedCompoundMega.userData.isCompound = true;
  mergedCompoundMega.userData.isCpdTesseract = true;
  mergedCompoundMega.userData.baseType = 'BoxGeometry';
  mergedCompoundMega.userData.isMegaTesseract = true;
  mergedCompoundMega.userData.isCompoundMegaTesseract = true;
  mergedCompoundMega.userData.componentCount = sweeps.length;
  mergedCompoundMega.userData.variant = 'experimental-nested';
  mergedCompoundMega.userData.sweepScales = sweepScales;
  mergedCompoundMega.userData.sweepOffsets = sweepOffsets;
  mergedCompoundMega.userData.translationStep = translationStep;
  mergedCompoundMega.userData.layerGap = layerGap;
  mergedCompoundMega.userData.baseOffset = baseOffset;
  mergedCompoundMega.userData.optionSignature = normalizedOptions;

  if (cacheKey) geometryCache.set(cacheKey, mergedCompoundMega);

  return cloneWithUserData(mergedCompoundMega);
}

export const metadata = {
  name: 'cpd-megatesseract-3',
  displayName: '💎💎💎 Compound Mega-Tesseract III',
  category: 'polytopes',
  description: 'Recursive phased sweeps nested at multiple scales for concentric resonance',
  isCompound: true,
  isSuperCompound: true,
  isUltraCompound: true,
  defaultOptions: {},
};
