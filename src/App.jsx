import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import ThreeScene from './features/sceneControls/ThreeScene';
import Controls from './components/Controls/Controls';
import HomePage from './HomePage/HomePage';
import NavBar from './nav/NavBar';
import ShowcaseGallery from './Showcase/ShowcaseGallery';
import MyScenesPage from './pages/MyScenesPage/MyScenesPage';
import SignUpPage from './pages/SignUpPage/SignUpPage';
import LoginPage from './pages/LoginPage/LoginPage';
import { SceneProvider } from './context/SceneContext';
import { AuthProvider } from './context/AuthContext';
import { QuantumCursor } from "./components/Effects";
import './cursor-override.css';

// Updated default colors for psychedelic theme
const defaultBaseColor = '#ff00ff'; // Vibrant magenta
const defaultWireframeColor = '#ffff00'; // Bright yellow
const defaultHyperframeColor = '#ff4500'; // Vivid orange-red
const defaultHyperframeLineColor = '#00ff00'; // Bright green

function Playground() {
  // MATERIAL PROPERTIES STATE
  const [metalness, setMetalness] = useState(0.5) // 0 = plastic, 1 = full metal
  const [emissiveIntensity, setEmissiveIntensity] = useState(0) // 0 = no glow, 2 = bright glow
  const [baseColor, setBaseColor] = useState(defaultBaseColor)
  const [wireframeIntensity, setWireframeIntensity] = useState(50)
  
  // INTRICATE WIREFRAME STATE
  const [hyperframeColor, setHyperframeColor] = useState(defaultHyperframeColor)
  const [hyperframeLineColor, setHyperframeLineColor] = useState(defaultHyperframeLineColor)
  
  // SCENE BEHAVIOR STATE
  const [cameraView, setCameraView] = useState('free')
  const [environment, setEnvironment] = useState('nebula')
  const [environmentHue, setEnvironmentHue] = useState(0) // Hue rotation for environment (0-360)
  const [objectCount, setObjectCount] = useState(1)
  const [animationStyle, setAnimationStyle] = useState('rotate')
  const [objectType, setObjectType] = useState('icosahedron')

  // LIGHTING STATE
  const [ambientLightColor, setAmbientLightColor] = useState('#ffffff')
  const [ambientLightIntensity, setAmbientLightIntensity] = useState(0.5)
  const [directionalLightColor, setDirectionalLightColor] = useState('#ffffff')
  const [directionalLightIntensity, setDirectionalLightIntensity] = useState(1.0)
  const [directionalLightX, setDirectionalLightX] = useState(10)
  const [directionalLightY, setDirectionalLightY] = useState(10)

  // Debug: log when directionalLightY changes
  React.useEffect(() => {
    console.log('[App] directionalLightY state changed:', directionalLightY);
  }, [directionalLightY]);
  const [directionalLightZ, setDirectionalLightZ] = useState(5)
  const [scale, setScale] = useState(1)

  return (
    <>
      <NavBar />
      <ThreeScene
        scale={scale}
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
      />
    </>
  );
}

function HomePageWithNav() {
  const navigate = useNavigate();
  
  console.log('HomePageWithNav rendered, navigate:', navigate);
  
  // Direct navigation handler
  const handleEnter = () => {
    console.log('Navigating to /playground');
    navigate('/playground');
  };
  
  return (
    <>
      <NavBar />
      <HomePage onEnter={handleEnter} />
    </>
  );
}

function App() {
  // Use location hook from react-router-dom to track route changes reliably
  const location = useNavigate();
  const currentPath = window.location.pathname;
  const isHomePage = currentPath === '/' || currentPath === '';
  const isPlaygroundPage = currentPath === '/playground' || currentPath === '/geometry-lab';
  
  // Set cursor style and body class based on current route
  useEffect(() => {
    console.log(`App route change detected - path: ${currentPath}, isHomePage: ${isHomePage}, isPlaygroundPage: ${isPlaygroundPage}`);
    
    if (isPlaygroundPage) {
      // On playground/geometry-lab, use default cursor for better control interaction
      document.body.classList.add('playground-page');
      console.log('Playground mode active - normal cursor enabled');
    } else {
      // On all other pages, hide the default cursor to allow quantum cursor to work
      console.log('Quantum cursor mode active - custom cursor enabled');
      document.body.classList.remove('playground-page');
    }
  }, [currentPath, isHomePage, isPlaygroundPage]);
  
  return (
    <AuthProvider>
      <SceneProvider>
        {/* Render QuantumCursor on all pages EXCEPT playground/geometry-lab */}
        {!isPlaygroundPage && <QuantumCursor />}
        <Routes>
          <Route path="/" element={<HomePageWithNav />} />
          <Route path="/playground" element={<Playground />} />
          <Route path="/geometry-lab" element={<Playground />} />
          <Route path="/showcase" element={<><NavBar /><ShowcaseGallery /></>} />
          <Route path="/gallery" element={<MyScenesPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </SceneProvider>
    </AuthProvider>
  );
}

export default App;