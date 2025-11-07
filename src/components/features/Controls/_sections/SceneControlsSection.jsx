import React, { useState } from 'react';
import styles from '../Controls.module.scss';
import CustomSelect from '../../../ui/CustomSelect/CustomSelect';

/**
 * SceneControlsSection Component
 * 
 * Handles all scene and camera-related controls including:
 * - Scale
 * - Camera view mode
 * - Environment settings
 * - Environment hue
 * - Object count
 * 
 * Props received from Controls.jsx which come from App.jsx
 */
function SceneControlsSection({
  scale,
  onScaleChange,
  cameraView,
  onCameraViewChange,
  environment,
  onEnvironmentChange,
  environmentHue,
  onEnvironmentHueChange,
  objectCount,
  onObjectCountChange,
  
  // Handler functions (already created in Controls.jsx)
  handleScaleChange,
  handleEnvironmentHueChange,
  handleObjectCountChange,
}) {
  // Local state for section toggle
  const [sceneOpen, setSceneOpen] = useState(false);

  return (
    <>
      {/* SCENE CONTROLS SECTION */}
      <div 
        className={`${styles.sectionHeader} ${sceneOpen ? styles.sectionHeaderSceneOpen : styles.sectionHeaderSceneClosed}`}
        onClick={() => setSceneOpen(!sceneOpen)}
      >
        <span>🎬 CAMERA/SCENE</span>
        <span>{sceneOpen ? '▼' : '▶'}</span>
      </div>
      
      <div className={`${styles.sectionContent} ${sceneOpen ? `${styles.sectionContentSceneOpen} ${styles.sectionContentOpen}` : styles.sectionContentClosed}`}>
        {/* Scale Control */}
        <label>
          Scale: <span className={styles.valueDisplay}>{scale.toFixed(1)}</span>
        </label>
        <input
          type="range"
          min="0.1"
          max="3"
          step="0.1"
          value={scale}
          onChange={handleScaleChange}
        />

        {/* Camera View Control */}
        <label>
          Camera View:
        </label>
        <CustomSelect
          value={cameraView}
          onChange={onCameraViewChange}
          options={[
            { value: 'free', label: 'Free Camera' },
            { value: 'orbit', label: 'Orbit View' },
            { value: 'top', label: 'Top Down' },
          ]}
        />

        {/* Environment Control */}
        <label>
          Environment:
        </label>
        <CustomSelect
          value={environment}
          onChange={onEnvironmentChange}
          options={[
            { value: 'nebula', label: 'Nebula' },
            { value: 'space', label: 'Space Scene' },
            { value: 'sunset', label: 'Sunset Sky' },
            { value: 'matrix', label: 'Matrix Code' },
          ]}
        />

        {/* Environment Hue Shift Control */}
        <label>
          Environment Hue: <span className={styles.valueDisplay}>{environmentHue}°</span>
        </label>
        <input 
          type="range" 
          min="0" 
          max="360" 
          value={environmentHue}
          onChange={handleEnvironmentHueChange}
        />

        {/* Object Count Control */}
        <label>
          Object Count: <span className={styles.valueDisplay}>{objectCount}</span>
        </label>
        <input 
          type="range" 
          min="1" 
          max="10" 
          value={objectCount}
          onChange={handleObjectCountChange}
        />
      </div>
    </>
  );
}

export default SceneControlsSection;
