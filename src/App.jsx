import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import ThreeScene from './features/sceneControls/ThreeScene';
import Controls from './components/Controls/Controls';
import HomePage from './HomePage/HomePage';
import NavBar from './nav/NavBar';
import ShowcaseGallery from './Showcase/ShowcaseGallery';
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
  const isHomePage = window.location.pathname === '/' || window.location.pathname === '';
  
  // Set cursor style and body class based on current route
  useEffect(() => {
    console.log(`App route change detected - path: ${window.location.pathname}, isHomePage: ${isHomePage}`);
    
    if (isHomePage) {
      // On homepage, hide the default cursor to allow quantum cursor to work
      console.log('Homepage mode active - quantum cursor enabled');
      document.body.classList.remove('playground-page');
    } else {
      // On playground, use default cursor for better control interaction
      document.body.classList.add('playground-page');
      console.log('Playground mode active - normal cursor enabled');
    }
  }, [window.location.pathname, isHomePage]);
  
  return (
    <>
      {/* Only render QuantumCursor on the homepage */}
      {isHomePage && <QuantumCursor />}
      <Routes>
        <Route path="/" element={<HomePageWithNav />} />
        <Route path="/playground" element={<Playground />} />
        <Route path="/showcase" element={<><NavBar /><ShowcaseGallery /></>} />
      </Routes>
    </>
  );
}

export default App;