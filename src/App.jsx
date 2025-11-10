import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom';
import ThreeScene from './features/sceneControls/ThreeScene';
import Controls from './components/features/Controls/Controls';
import SaveControls from './components/features/SaveButton/SaveControls';
import ExitButton from './components/features/Controls/ExitButton/ExitButton';
import ScrambleButton from './components/ui/ScrambleButton/ScrambleButton';
import HomePage from './components/pages/HomePage/HomePage';
import NavBar from './components/layout/NavBar/NavBar';
import ShowcaseGallery from './components/features/Showcase/ShowcaseGallery';
import MyScenesPage from './components/pages/MyScenesPage/MyScenesPage';
import SignUpPage from './features/auth/pages/SignUpPage/SignUpPage';
import LoginPage from './features/auth/pages/LoginPage/LoginPage';
import { SceneProvider, useScene } from './context/SceneContext';
import { AuthProvider, useAuth } from './features/auth/context/AuthContext';
import { QuantumCursor } from "./components/ui/Effects";
import Footer from './components/layout/Footer/Footer';
import './cursor-override.module.scss';
import sharedStyles from './styles/shared.module.scss';

// Updated default colors for psychedelic theme and used in geom-lab state = these are the initial colors when user starts a new scene
const defaultBaseColor = '#9e1c50ff'; // Vibrant magenta 
const defaultHyperframeColor = '#65d708ff'; // Vivid orange-red
const defaultHyperframeLineColor = '#00ccffff'; // Bright green

function GeomLab() {
  const { loadedConfig, resetScene } = useScene(); // CUSTOM HOOK: Get loaded config from context
  const { token } = useAuth(); // CUSTOM HOOK: Get auth for save functionality
  const navigate = useNavigate(); // For navigation is usNavigate 
  const location = useLocation(); // Current location
  
  // Save prompt modal state
  const [showSavePrompt, setShowSavePrompt] = useState(false);
  const [showNameInput, setShowNameInput] = useState(false);
  const [sceneName, setSceneName] = useState('');
  const [nextPath, setNextPath] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [allowNavigation, setAllowNavigation] = useState(false);
  
  // MATERIAL PROPERTIES STATE
  const [metalness, setMetalness] = useState(0.5) // 0 = plastic, 1 = full metal
  const [emissiveIntensity, setEmissiveIntensity] = useState(0) // 0 = no glow, 2 = bright glow
  
  const [baseColor, setBaseColor] = useState(defaultBaseColor)

  const [wireframeIntensity, setWireframeIntensity] = useState(50)
  
  // HYPERFRAME STATE
  const [hyperframeColor, setHyperframeColor] = useState(defaultHyperframeColor)
  const [hyperframeLineColor, setHyperframeLineColor] = useState(defaultHyperframeLineColor)
  
  // SCENE BEHAVIOR STATE
  const [cameraView, setCameraView] = useState('free')
  const [environment, setEnvironment] = useState('matrix')
  const [environmentHue, setEnvironmentHue] = useState(0) // Hue rotation for environment (0-360)
  const [objectCount, setObjectCount] = useState(1)
  const [animationStyle, setAnimationStyle] = useState('rotate')
  const [objectType, setObjectType] = useState('icosahedron')

  // LIGHTING STATE
  const [ambientLightColor, setAmbientLightColor] = useState('#ffffff')
  const [ambientLightIntensity, setAmbientLightIntensity] = useState(1.2)
  const [directionalLightColor, setDirectionalLightColor] = useState('#ffffff')
  const [directionalLightIntensity, setDirectionalLightIntensity] = useState(1.0)
  const [directionalLightX, setDirectionalLightX] = useState(10)
  const [directionalLightY, setDirectionalLightY] = useState(10)
  const [directionalLightZ, setDirectionalLightZ] = useState(5)
  const [scale, setScale] = useState(1)
  const [objectSpeed, setObjectSpeed] = useState(1.0)
  const [orbSpeed, setOrbSpeed] = useState(1.0)



  // Track changes to mark as unsaved
  useEffect(() => {
    setHasUnsavedChanges(true);
  }, [metalness, emissiveIntensity, baseColor, wireframeIntensity, hyperframeColor,
      hyperframeLineColor, cameraView, environment, environmentHue, objectCount,
  animationStyle, objectType, ambientLightColor, ambientLightIntensity,
  directionalLightColor, directionalLightIntensity, directionalLightX,
  directionalLightY, directionalLightZ, scale, objectSpeed, orbSpeed]);

  // Intercept link clicks for navigation blocking
  useEffect(() => {
    const handleClick = (e) => {
      if (!hasUnsavedChanges || allowNavigation) return;
      
      const link = e.target.closest('a');
      if (link && link.href) {
        const url = new URL(link.href);
        const targetPath = url.pathname;
        
        // Only block internal navigation to different routes
        if (targetPath !== location.pathname && url.origin === window.location.origin) {
          e.preventDefault();
          e.stopPropagation();
          setNextPath(targetPath);
          setShowSavePrompt(true);
        }
      }
    };

    // Use capture phase to intercept before React Router
    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [hasUnsavedChanges, allowNavigation, location.pathname]);

  // Execute pending navigation after user approves
  useEffect(() => {
    if (allowNavigation && nextPath) {
      navigate(nextPath);
      setAllowNavigation(false);
      setNextPath(null);
    }
  }, [allowNavigation, nextPath, navigate]);

  // Apply loaded config when it changes
  useEffect(() => {
    if (loadedConfig) {
      // Apply material properties
      if (loadedConfig.metalness !== undefined) setMetalness(loadedConfig.metalness);
      if (loadedConfig.emissiveIntensity !== undefined) setEmissiveIntensity(loadedConfig.emissiveIntensity);
      if (loadedConfig.baseColor) setBaseColor(loadedConfig.baseColor);
      if (loadedConfig.wireframeIntensity !== undefined) setWireframeIntensity(loadedConfig.wireframeIntensity);
      
      // Apply hyperframe
      if (loadedConfig.hyperframeColor) setHyperframeColor(loadedConfig.hyperframeColor);
      if (loadedConfig.hyperframeLineColor) setHyperframeLineColor(loadedConfig.hyperframeLineColor);
      
      // Apply scene behavior
      if (loadedConfig.cameraView) setCameraView(loadedConfig.cameraView);
      if (loadedConfig.environment) setEnvironment(loadedConfig.environment);
      if (loadedConfig.environmentHue !== undefined) setEnvironmentHue(loadedConfig.environmentHue);
      if (loadedConfig.objectCount !== undefined) setObjectCount(loadedConfig.objectCount);
      if (loadedConfig.animationStyle) setAnimationStyle(loadedConfig.animationStyle);
      if (loadedConfig.objectType) setObjectType(loadedConfig.objectType);
      
      // Apply lighting
      if (loadedConfig.ambientLightColor) setAmbientLightColor(loadedConfig.ambientLightColor);
      if (loadedConfig.ambientLightIntensity !== undefined) setAmbientLightIntensity(loadedConfig.ambientLightIntensity);
      if (loadedConfig.directionalLightColor) setDirectionalLightColor(loadedConfig.directionalLightColor);
      if (loadedConfig.directionalLightIntensity !== undefined) setDirectionalLightIntensity(loadedConfig.directionalLightIntensity);
      if (loadedConfig.directionalLightX !== undefined) setDirectionalLightX(loadedConfig.directionalLightX);
      if (loadedConfig.directionalLightY !== undefined) setDirectionalLightY(loadedConfig.directionalLightY);
      if (loadedConfig.directionalLightZ !== undefined) setDirectionalLightZ(loadedConfig.directionalLightZ);
      if (loadedConfig.scale !== undefined) setScale(loadedConfig.scale);
      
      // Clear the loaded config so it doesn't re-apply
      // We'll do this after a short delay to ensure it's applied
      setTimeout(() => resetScene, 100);
    }
  }, [loadedConfig]);

  // Prevent browser navigation (close tab, refresh, back button)
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges && !allowNavigation) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges, allowNavigation]);

  
  // Handle save from modal
  const handleSaveFromModal = () => {
    setShowSavePrompt(false);
    setShowNameInput(true);
  };

  // Handle save scene with name
  const handleSaveScene = async () => {
    if (sceneName && sceneName.trim() !== '') {
      try {
        const { saveScene } = await import('./services/sceneApi');
        
        const sceneData = {
          name: sceneName.trim(),
          description: '',
          config: sceneConfig
        };
        
        await saveScene(sceneData, token);
        alert(`"${sceneName}" saved successfully!`);
        setHasUnsavedChanges(false); // Mark as saved
        setShowNameInput(false);
        setSceneName('');
        setAllowNavigation(true);
      } catch (error) {
        alert(`Failed to save scene: ${error.message}`);
      }
    }
  };

  // Handle cancel name input
  const handleCancelNameInput = () => {
    setShowNameInput(false);
    setSceneName('');
    setShowSavePrompt(true); // Go back to save prompt
  };


  // Handle exit without saving from modal
  const handleExitWithoutSaving = () => {
    setShowSavePrompt(false);
    setAllowNavigation(true);
    setHasUnsavedChanges(false);
  };

  // Handle cancel exit from modal
  const handleCancelExit = () => {
    setShowSavePrompt(false);
    setNextPath(null);
  };

  // Handle exit button click
// these are 20 states passed down to ThreeScene as props
  // Create sceneConfig object for SaveButton
  const sceneConfig = {
    metalness,
    emissiveIntensity,
    baseColor,
    wireframeIntensity,
    hyperframeColor,
    hyperframeLineColor,
    cameraView,
    environment,
    environmentHue,
    objectCount,
    animationStyle,
    objectType,
    ambientLightColor,
    ambientLightIntensity,
    directionalLightColor,
    directionalLightIntensity,
    directionalLightX,
    directionalLightY,
    directionalLightZ,
    scale,
    objectSpeed,
    orbSpeed
  };

  // Handle exit with save prompt
  const handleExit = async () => {
    setShowSavePrompt(true);
    setNextPath('/');
  };

  return (
    <>
      <NavBar />
      <SaveControls sceneConfig={sceneConfig} />
      <ExitButton onClick={handleExit} />
      
      {/* Save Prompt Modal */}
      {showSavePrompt && (
        <div className="save-modal-overlay" onClick={handleCancelExit}>
          <div className="save-modal" onClick={(e) => e.stopPropagation()}>
            <button className="save-modal__close" onClick={handleCancelExit}>
              ✕
            </button>
            
            <h2 className="save-modal__title">Save Scene?</h2>
            
            <p className="save-modal__message">
              Your creation hasn't been saved yet.
            </p>
            
            <div className="save-modal__actions">
              <ScrambleButton
                onClick={handleSaveFromModal}
                variant="primary"
                className="save-modal__btn"
              >
                Save & Exit
              </ScrambleButton>
              
              <ScrambleButton
                onClick={handleExitWithoutSaving}
                variant="danger"
                className="save-modal__btn"
              >
                Exit Without Saving
              </ScrambleButton>
              
              <ScrambleButton
                onClick={handleCancelExit}
                variant="secondary"
                className="save-modal__btn"
              >
                Cancel
              </ScrambleButton>
            </div>
          </div>
        </div>
      )}

      {/* Name Input Modal */}
      {showNameInput && (
        <div className="save-modal-overlay" onClick={handleCancelNameInput}>
          <div className="save-modal" onClick={(e) => e.stopPropagation()}>
            <button className="save-modal__close" onClick={handleCancelNameInput}>
              ✕
            </button>
            
            <h2 className="save-modal__title">Name Your Masterpiece</h2>
            
            <input
              type="text"
              className={`save-modal__input holographic-input ${sharedStyles.angledCorners}`}
              placeholder="Enter scene name..."
              value={sceneName}
              onChange={(e) => setSceneName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSaveScene();
                }
              }}
              autoFocus
            />
            
            <div className="save-modal__actions">
              <ScrambleButton
                onClick={handleSaveScene}
                variant="primary"
                className="save-modal__btn"
                disabled={!sceneName.trim()}
              >
                Save
              </ScrambleButton>
              
              <ScrambleButton
                onClick={handleCancelNameInput}
                variant="secondary"
                className="save-modal__btn"
              >
                Back
              </ScrambleButton>
            </div>
          </div>
        </div>
      )}
      
      // App.jsx says to ThreeScene: Hey kid, here are 21 props I want you to know about. But u know what ain't one. 
      <ThreeScene
        scale={scale}
        objectSpeed={objectSpeed}
        orbSpeed={orbSpeed}
        metalness={metalness}
        emissiveIntensity={emissiveIntensity}
        baseColor={baseColor}
        wireframeIntensity={wireframeIntensity}
        hyperframeColor={hyperframeColor}
        hyperframeLineColor={hyperframeLineColor}
        cameraView={cameraView}
        environment={environment}
        environmentHue={environmentHue}
        objectCount={objectCount}
        animationStyle={animationStyle}
        objectType={objectType}
        ambientLightColor={ambientLightColor}
        ambientLightIntensity={ambientLightIntensity}
        directionalLightColor={directionalLightColor}
        directionalLightIntensity={directionalLightIntensity}
        directionalLightX={directionalLightX}
        directionalLightY={directionalLightY}
        directionalLightZ={directionalLightZ}
      />
      <Controls
        scale={scale}
        onScaleChange={setScale}
        metalness={metalness}
        onMetalnessChange={setMetalness}
        emissiveIntensity={emissiveIntensity}
        onEmissiveIntensityChange={setEmissiveIntensity}
        baseColor={baseColor}
        onBaseColorChange={setBaseColor}
        wireframeIntensity={wireframeIntensity}
        onWireframeIntensityChange={setWireframeIntensity}
        hyperframeColor={hyperframeColor}
        onHyperframeColorChange={setHyperframeColor}
        hyperframeLineColor={hyperframeLineColor}
        onHyperframeLineColorChange={setHyperframeLineColor}
        cameraView={cameraView}
        onCameraViewChange={setCameraView}
        environment={environment}
        onEnvironmentChange={setEnvironment}
        environmentHue={environmentHue}
        onEnvironmentHueChange={setEnvironmentHue}
        objectCount={objectCount}
        onObjectCountChange={setObjectCount}
        animationStyle={animationStyle}
        onAnimationStyleChange={setAnimationStyle}
        objectType={objectType}
        onObjectTypeChange={setObjectType}
        ambientLightColor={ambientLightColor}
        onAmbientLightColorChange={setAmbientLightColor}
        ambientLightIntensity={ambientLightIntensity}
        onAmbientLightIntensityChange={setAmbientLightIntensity}
        directionalLightColor={directionalLightColor}
        onDirectionalLightColorChange={setDirectionalLightColor}
        directionalLightIntensity={directionalLightIntensity}
        onDirectionalLightIntensityChange={setDirectionalLightIntensity}
        directionalLightX={directionalLightX}
        onDirectionalLightXChange={setDirectionalLightX}
        directionalLightY={directionalLightY}
        onDirectionalLightYChange={setDirectionalLightY}
        directionalLightZ={directionalLightZ}
        onDirectionalLightZChange={setDirectionalLightZ}
        objectSpeed={objectSpeed}
        onObjectSpeedChange={setObjectSpeed}
        orbSpeed={orbSpeed}
        onOrbSpeedChange={setOrbSpeed}
      />
    </>
  );
}

function HomePageWithNav() {
  const navigate = useNavigate();
  
  // Direct navigation handler
  const handleEnter = () => {
    navigate('/geom-lab');
  };
  
  return (
    <>
      <HomePage onEnter={handleEnter} />
    </>
  );
}

function AppContent() {
  // Get authentication status from AuthContext 
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  const currentPath = location.pathname;
  const isHomePage = currentPath === '/' || currentPath === '';
  const isGeomLabPage = currentPath === '/geom-lab' || currentPath === '/geometry-lab';
  
  // Set cursor style and body class based on current route
  useEffect(() => {
    if (isGeomLabPage) {
      // On geom-lab, use default cursor for better control interaction
      document.body.classList.add('geom-lab-page');
    } else {
      // On all other pages, hide the default cursor to allow quantum cursor to work
      document.body.classList.remove('geom-lab-page');
    }
  }, [currentPath, isHomePage, isGeomLabPage]);
  
  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: '#000',
        color: '#fff',
        fontSize: '24px'
      }}>
        Loading...
      </div>
    );
  }
  
  return (
    <SceneProvider>
      {/* Render QuantumCursor on all pages EXCEPT geom-lab */}
      {!isGeomLabPage && <QuantumCursor />}
      
      {/* Footer only on homepage bottom */}
      {currentPath === '/' && <Footer />}
      
      <Routes>
        {/* PUBLIC ROUTE - anyone can access */}
        <Route path="/" element={<HomePageWithNav />} />
        
        {/* PROTECTED ROUTES - redirect to login if not authenticated */}
        <Route 
          path="/geom-lab" 
          element={isAuthenticated ? <GeomLab /> : <Navigate to="/login" />}
        />
        <Route 
          path="/geometry-lab" 
          element={isAuthenticated ? <GeomLab /> : <Navigate to="/login" />}
        />
        <Route 
          path="/showcase" 
          element={isAuthenticated ? <><NavBar /><ShowcaseGallery /></> : <Navigate to="/login" />} 
        />
        <Route 
          path="/scenes" 
          element={isAuthenticated ? <MyScenesPage /> : <Navigate to="/login" />} 
        />
        
        {/* PUBLIC AUTH ROUTES - anyone can access */}
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </SceneProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;