import React, { useState } from 'react';
import styles from '../Controls.module.scss';
import CustomSelect from '../../../ui/CustomSelect/CustomSelect';

/**
 * MaterialPropertiesSection Component
 * 
 * Handles all material-related controls including:
 * - Surface properties (base color, emissive intensity, metalness)
 * - Geometry & effects (wireframe, hyperframe colors, object type, animation style, speeds)
 * 
 * Props received from Controls.jsx which come from App.jsx
 */
function MaterialPropertiesSection({
  // Surface properties (values only)
  baseColor,
  emissiveIntensity,
  metalness,
  
  // Geometry & effects (values only)
  wireframeIntensity,
  hyperframeColor,
  hyperframeLineColor,
  objectType,
  animationStyle,
  objectSpeed,
  orbSpeed,
  
  // Handler functions (already created in Controls.jsx)
  handleBaseColorChange,
  handleEmissiveIntensityChange,
  handleMetalnessChange,
  handleWireframeIntensityChange,
  handleWireframeToggle,
  handleHyperframeColorChange,
  handleHyperframeLineColorChange,
  handleObjectTypeChange,
  handleAnimationStyleChange,
  handleObjectSpeedChange,
  handleOrbSpeedChange,
}) {
  // Local state for subsection toggles
  const [materialOpen, setMaterialOpen] = useState(false);
  const [surfaceOpen, setSurfaceOpen] = useState(true);
  const [geometryOpen, setGeometryOpen] = useState(true);

  return (
    <>
      {/* COLLAPSIBLE SECTION: MATERIAL PROPERTIES */}
      <div 
        className={`${styles.sectionHeader} ${materialOpen ? styles.sectionHeaderMaterialOpen : styles.sectionHeaderMaterialClosed}`}
        onClick={() => setMaterialOpen(!materialOpen)}
      >
        <span>🎨 MATERIAL PROPERTIES</span>
        <span>{materialOpen ? '▼' : '▶'}</span>
      </div>
      
      <div className={`${styles.sectionContent} ${materialOpen ? `${styles.sectionContentMaterialOpen} ${styles.sectionContentOpen}` : styles.sectionContentClosed}`}>
        
        {/* NESTED SUBSECTION: SURFACE PROPERTIES */}
        <div 
          className={`${styles.subSectionHeader} ${surfaceOpen ? styles.subSectionHeaderOpen : styles.subSectionHeaderClosed}`}
          onClick={(e) => { e.stopPropagation(); setSurfaceOpen(!surfaceOpen); }}
        >
          <span>✨ Surface</span>
          <span>{surfaceOpen ? '▼' : '▶'}</span>
        </div>
        
        <div className={`${styles.subSectionContent} ${surfaceOpen ? styles.subSectionContentOpen : styles.subSectionContentClosed}`}>
          {/* BASE COLOR PICKER */}
          <label>
            Base Color:
          </label>
          <input 
            type="color" 
            value={baseColor ? baseColor.slice(0, 7) : '#000000'}                      
            onChange={handleBaseColorChange}
            onMouseDown={(e) => e.stopPropagation()}
            onMouseMove={(e) => e.stopPropagation()}
          />
          
          {/* EMISSIVE INTENSITY SLIDER */}
          <label>
            Emissive Intensity: <span className={styles.valueDisplay}>{emissiveIntensity.toFixed(1)}</span>
          </label>
          <input 
            type="range" 
            min="0" 
            max="2" 
            step="0.1"
            value={emissiveIntensity}                   
            onChange={handleEmissiveIntensityChange}    
          />
          
          {/* METALNESS SLIDER */}
          <label>
            Metalness: <span className={styles.valueDisplay}>{metalness.toFixed(2)}</span>
          </label>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01"
            value={metalness}
            onChange={handleMetalnessChange}
          />
        </div>

        {/* NESTED SUBSECTION: GEOMETRY & EFFECTS */}
        <div 
          className={`${styles.subSectionHeader} ${geometryOpen ? styles.subSectionHeaderOpen : styles.subSectionHeaderClosed}`}
          onClick={(e) => { e.stopPropagation(); setGeometryOpen(!geometryOpen); }}
        >
          <span>🔷 Geometry & Effects</span>
          <span>{geometryOpen ? '▼' : '▶'}</span>
        </div>
        
        <div className={`${styles.subSectionContent} ${geometryOpen ? styles.subSectionContentOpen : styles.subSectionContentClosed}`}>
          {/* Wireframe visibility toggle */}
          <label className={styles.futuristicCheckboxLabel}>
            <input
              type="checkbox"
              checked={wireframeIntensity > 0}
              onChange={handleWireframeToggle}
              className={styles.futuristicCheckbox}
            />
            <span className={styles.futuristicCustomCheckbox}></span>
            <span className={styles.futuristicCheckboxText}>Wireframe</span>
          </label>
          
          {/* Wireframe intensity slider */}
          <label>
            Wireframe Intensity: <span className={styles.valueDisplay}>{wireframeIntensity}%</span>
          </label>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={wireframeIntensity}
            onChange={handleWireframeIntensityChange}
          />

          {/* Hyperframe color picker */}
          <label>
            Hyperframe Color:
          </label>
          <input 
            type="color" 
            value={hyperframeColor}
            onChange={handleHyperframeColorChange}
            onMouseDown={(e) => e.stopPropagation()}
            onMouseMove={(e) => e.stopPropagation()}
          />

          {/* Hyperframe lines color picker */}
          <label>
            Hyperframe Lines Color:
          </label>
          <input 
            type="color" 
            value={hyperframeLineColor}
            onChange={handleHyperframeLineColorChange}
            onMouseDown={(e) => e.stopPropagation()}
            onMouseMove={(e) => e.stopPropagation()}
          />

          {/* Object Type Control */}
          <label>
            Object Type:
          </label>
          <CustomSelect
            value={objectType}
            onChange={handleObjectTypeChange}
            options={[
              { value: 'quantummanifold', label: '∞ Quantum Manifold (Klein+)' },
              { value: 'compoundquantummanifold', label: '◈ Cpd-Quantum Manifold' },
              { value: 'icosahedron', label: '⬢ Cpd-Icosahedron' },
              { value: 'sphere', label: '● Cpd-Sphere' },
              { value: 'compoundsphere', label: '◉ Super-Cpd-Sphere' },
              { value: 'compoundfloatingcity', label: '∿ Compound Curves' },
              { value: 'hessianpolychoron', label: '✦ Hessian Polychoron' },
              { value: 'mobiussphere', label: '⟲ Möbius Sphere' },
              { value: 'simplecpdhypercube', label: '◻ Cpd-Hypercube' },
              { value: 'cube', label: '■ 9Cpd-Hypercube' },
              { value: 'box', label: '▦ Cpd-Tesseract' },
              { value: 'cpdtesseract', label: '◆ Mega-Tesseract' },
              { value: 'cpd-megatesseract', label: '◇ Cpd-Mega-Tesseract' },
              { value: 'cpd-megatesseract-2', label: '◈ Cpd-Mega-Tesseract II' },
              { value: 'cpd-megatesseract-3', label: '⬙ Cpd-Mega-Tesseract III' },
              { value: 'cpd-megatesseract-4', label: '⬥ Cpd-Mega-Tesseract IV' },
              { value: 'octahedron', label: '◇ Cpd-Octahedron' },
              { value: 'tetrahedron', label: '▲ Cpd-Tetrahedron' },
              { value: '120cell', label: '⬡ 120-Cell' },
              { value: 'compound120cell', label: '⬢ Cpd-120-Cell' },
              { value: '600cell', label: '⬣ 600-Cell' },
              { value: 'compound600cell', label: '⬤ Cpd-600-Cell' },
              { value: '24cell', label: '⬟ 24-Cell' },
              { value: 'compound24cell', label: '⬠ Cpd-24-Cell' },
              { value: '16cell', label: '◆ 16-Cell' },
            ]}
          />

          {/* Animation Style Control */}
          <label>
            Animation Style:
          </label>
          <CustomSelect
            value={animationStyle}
            onChange={handleAnimationStyleChange}
            options={[
              { value: 'rotate', label: 'Simple Rotation' },
              { value: 'float', label: 'Floating Dance' },
              { value: 'omniIntel', label: 'Omni-Intel' },
            ]}
          />

          {/* Object Speed Control */}
          <label>
            Object Speed: <span className={styles.valueDisplay}>{(objectSpeed || 1.0).toFixed(1)}x</span>
          </label>
          <input
            type="range"
            min="0.1"
            max="10"
            step="0.1"
            value={objectSpeed || 1.0}
            onChange={handleObjectSpeedChange}
          />

          {/* Particle Speed Control (affects spectral orbs & nebula particles) */}
          <label>
            Particle Speed: <span className={styles.valueDisplay}>{(orbSpeed || 1.0).toFixed(1)}x</span>
          </label>
          <input
            type="range"
            min="0.1"
            max="10"
            step="0.1"
            value={orbSpeed || 1.0}
            onChange={handleOrbSpeedChange}
          />
        </div>
      </div>
    </>
  );
}

export default MaterialPropertiesSection;
