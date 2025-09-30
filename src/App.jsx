import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import ThreeScene from './ThreeScene/ThreeScene';
import Controls from './Controls/Controls';
import HomePage from './HomePage/HomePage';
import NavBar from './nav/NavBar';
import QuantumCursor from "./QuantumCursor";

// Updated default colors for psychedelic theme
const defaultBaseColor = '#ff00ff'; // Vibrant magenta
const defaultSpecularColor = '#00ffff'; // Bright cyan
const defaultWireframeColor = '#ffff00'; // Bright yellow
const defaultIntricateWireframeSpiralColor = '#ff4500'; // Vivid orange-red
const defaultIntricateWireframeEdgeColor = '#00ff00'; // Bright green

function Playground() {
  // MATERIAL PROPERTIES STATE
  const [shininess, setShininess] = useState(100)
  const [specularColor, setSpecularColor] = useState(defaultSpecularColor)
  const [specularIntensity, setSpecularIntensity] = useState(1.0)
  const [baseColor, setBaseColor] = useState(defaultBaseColor)
  const [wireframeIntensity, setWireframeIntensity] = useState(50)
  
  // INTRICATE WIREFRAME STATE
  const [intricateWireframeSpiralColor, setIntricateWireframeSpiralColor] = useState(defaultIntricateWireframeSpiralColor)
  const [intricateWireframeEdgeColor, setIntricateWireframeEdgeColor] = useState(defaultIntricateWireframeEdgeColor)
  
  // SCENE BEHAVIOR STATE
  const [cameraView, setCameraView] = useState('free')
  const [environment, setEnvironment] = useState('purple')
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
  const [directionalLightZ, setDirectionalLightZ] = useState(5)
  const [scale, setScale] = useState(1)

  return (
    <>
      <NavBar />
      <ThreeScene
        scale={scale}
        shininess={shininess}
        specularColor={specularColor}
        specularIntensity={specularIntensity}
        baseColor={baseColor}
        wireframeIntensity={wireframeIntensity}
        intricateWireframeSpiralColor={intricateWireframeSpiralColor}
        intricateWireframeEdgeColor={intricateWireframeEdgeColor}
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
        shininess={shininess}
        onShininessChange={setShininess}
        specularColor={specularColor}
        onSpecularColorChange={setSpecularColor}
        specularIntensity={specularIntensity}
        onSpecularIntensityChange={setSpecularIntensity}
        baseColor={baseColor}
        onBaseColorChange={setBaseColor}
        wireframeIntensity={wireframeIntensity}
        onWireframeIntensityChange={setWireframeIntensity}
        intricateWireframeSpiralColor={intricateWireframeSpiralColor}
        onIntricateWireframeSpiralColorChange={setIntricateWireframeSpiralColor}
        intricateWireframeEdgeColor={intricateWireframeEdgeColor}
        onIntricateWireframeEdgeColorChange={setIntricateWireframeEdgeColor}
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
  
  const handleEnter = () => {
    console.log('handleEnter called');
    console.log('Attempting to navigate to /playground');
    navigate('/playground');
    console.log('navigate() executed');
  };
  
  return (
    <>
      <NavBar />
      <HomePage onEnter={handleEnter} />
    </>
  );
}

function App() {
  return (
    <>
      <QuantumCursor />
      <Routes>
        <Route path="/" element={<HomePageWithNav />} />
        <Route path="/playground" element={<Playground />} />
      </Routes>
    </>
  );
}

export default App;