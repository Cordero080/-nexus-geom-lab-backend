import { use, useEffect, useRef } from 'react'
import * as THREE from 'three'

// ========================================================================
// THREESCENE.JSX - THE 3D RENDERER (RECEIVES PROPS FROM APP.JSX)
// ========================================================================
// This component ONLY receives data - it doesn't manage any state itself.
// All the values come from App.jsx as props, and when App.jsx changes them,
// this component automatically re-renders the 3D scene with new values.

function ThreeScene({ 
  // MATERIAL PROPS - How the 3D objects should look (FROM App.jsx state)
  scale,                 // Current scale value → will update Three.js object scale
  shininess,           // Current shininess value → will update Three.js material.shininess
  specularColor,       // Current specular color → will update Three.js material.specular
  specularIntensity,   // Current specular intensity → will update Three.js material.reflectivity
  baseColor,           // Current base color → will update Three.js material.color
  wireframeIntensity,  // Current wireframe intensity → will update Three.js material.wireframe
  
  // INTRICATE WIREFRAME PROPS - How the intricate wireframe should look (FROM App.jsx state)
  intricateWireframeSpiralColor,  // Current spiral color → will update intricate wireframe spiral lines
  intricateWireframeEdgeColor,    // Current edge color → will update intricate wireframe edge connections
  
  // SCENE BEHAVIOR PROPS - How the scene should behave (FROM App.jsx state)
  cameraView,          // Current camera view → will position/animate camera
  environment,         // Current environment → will change background/lighting
  objectCount,         // Current object count → will create this many objects
  animationStyle,      // Current animation → will control how objects move
  objectType,          // Current object type → will determine which 3D shape to show
  
  // LIGHTING PROPS - How the scene should be lit (FROM App.jsx state)
  ambientLightColor,       // Current ambient light color → will update ambient light
  ambientLightIntensity,   // Current ambient light intensity → will update ambient light
  directionalLightColor,   // Current directional light color → will update directional light
  directionalLightIntensity, // Current directional light intensity → will update directional light
  directionalLightX,       // Current light X position → will position directional light
  directionalLightY,       // Current light Y position → will position directional light
  directionalLightZ        // Current light Z position → will position directional light
}) {
  // ========================================
  // REFS - STORING THREE.JS OBJECTS
  // ========================================
  // useRef lets us store Three.js objects that persist between re-renders
  // These are NOT React state - they're just containers for Three.js objects
  
  const mountRef = useRef(null)              // Where to attach the 3D canvas to the DOM
  const sceneRef = useRef(null)              // The Three.js scene object
  const materialRef = useRef(null)           // Reference to main material for debugging
  const cameraRef = useRef(null)             // The Three.js camera object
  const rendererRef = useRef(null)           // The Three.js renderer object
  const objectsRef = useRef([])              // Array of all 3D objects in the scene
  const animationIdRef = useRef(null)        // ID for the animation loop (so we can cancel it)
  const ambientLightRef = useRef(null)       // Reference to ambient light (so we can update it)
  const directionalLightRef = useRef(null)   // Reference to directional light (so we can update it)

  // =============================================
  // INITIAL SETUP - RUNS ONCE WHEN COMPONENT MOUNTS
  // =============================================
  // This useEffect has an empty dependency array [], so it only runs once
  // It sets up the basic Three.js scene structure that won't change
  
  useEffect(() => {
    // 1. CREATE SCENE - The 3D world container
    const scene = new THREE.Scene()
    sceneRef.current = scene

    // 2. CREATE CAMERA - The viewpoint into the 3D world
    const camera = new THREE.PerspectiveCamera(
      40,                                    // Field of view (how wide the view is)
      window.innerWidth / window.innerHeight, // Aspect ratio (screen shape)
      0.1,                                   // Near clipping plane (closest visible distance)
      1000                                   // Far clipping plane (farthest visible distance)
    )
    camera.position.set(0, 0, 6)             // Start camera position
    cameraRef.current = camera

    // 3. CREATE RENDERER - Converts 3D scene to 2D pixels on screen
    const renderer = new THREE.WebGLRenderer({ antialias: true }) // Smooth edges
    renderer.setSize(window.innerWidth, window.innerHeight)       // Match screen size
    renderer.shadowMap.enabled = true                             // Enable shadows
    renderer.shadowMap.type = THREE.PCFSoftShadowMap             // Soft shadow type
    renderer.setClearColor(0x000000, 1)                          // Black background
    rendererRef.current = renderer
    mountRef.current.appendChild(renderer.domElement)             // Add canvas to DOM

    // 4. CREATE LIGHTS - Using current prop values from App.jsx
    // Convert hex color strings (like "#ff0000") to Three.js color numbers
    const ambientLightColorHex = parseInt(ambientLightColor.replace('#', ''), 16)
    const directionalLightColorHex = parseInt(directionalLightColor.replace('#', ''), 16)
    
    // Create lights with current App.jsx values
    const ambientLight = new THREE.AmbientLight(ambientLightColorHex, ambientLightIntensity)
    const directionalLight = new THREE.DirectionalLight(directionalLightColorHex, directionalLightIntensity)
    directionalLight.position.set(directionalLightX, directionalLightY, directionalLightZ)
    directionalLight.castShadow = true
    
    // Store lights in refs so we can update them later when App.jsx props change
    ambientLightRef.current = ambientLight
    directionalLightRef.current = directionalLight
    
    // Add lights to the scene
    scene.add(ambientLight)
    scene.add(directionalLight)

    // 5. START ANIMATION LOOP - Continuously render the scene
    function animate() {
      animationIdRef.current = requestAnimationFrame(animate) // Schedule next frame
      renderer.render(scene, camera)                          // Draw the current frame
    }
    animate() // Start the loop

    // 6. HANDLE WINDOW RESIZE - Keep canvas matching screen size
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', handleResize)

    // 7. CLEANUP FUNCTION - Runs when component unmounts
    // Important: Clean up Three.js objects to prevent memory leaks
    return () => {
      window.removeEventListener('resize', handleResize)
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, []) // Empty dependency array = run once on mount

  // ===============================================
  // GEOMETRY CREATION HELPER FUNCTION
  // ===============================================
  // This function converts the objectType prop from App.jsx into actual Three.js geometry
  
  const createGeometryByType = (type) => {
    switch(type) {
      case 'icosahedron':
        return new THREE.IcosahedronGeometry()           // 20-sided polyhedron
      case 'sphere':
        return new THREE.SphereGeometry(1, 16, 16)       // Round ball
      case 'box':
        return new THREE.BoxGeometry(1.5, 1.5, 1.5)     // Cube
      case 'octahedron':
        return new THREE.OctahedronGeometry()            // 8-sided polyhedron
      case 'tetrahedron':
        return new THREE.TetrahedronGeometry(1.2)        // 4-sided pyramid
      case 'torusknot':
        return new THREE.TorusKnotGeometry(1, .2, 150, 16) // Twisted donut shape
      default:
        return new THREE.IcosahedronGeometry()           // Default fallback
    }
  }

  // ===============================================
  // ENVIRONMENT UPDATER - RESPONDS TO environment PROP
  // ===============================================
  // When App.jsx changes the environment prop, this useEffect runs
  // and updates the scene background accordingly
  
  // Scale updater - responds to scale prop changes
  useEffect(() => {
    objectsRef.current.forEach(({ solidMesh, wireframeMesh, centerLines, curvedLines, mesh }) => {
      // Handle dual-mesh objects
      if (solidMesh) {
        solidMesh.scale.setScalar(scale)
      }
      if (wireframeMesh) {
        wireframeMesh.scale.setScalar(scale)
      }
      // Handle intricate wireframe elements
      if (centerLines) {
        centerLines.scale.setScalar(scale)
      }
      if (curvedLines) {
        curvedLines.scale.setScalar(scale)
      }
      // Handle legacy single mesh objects
      if (mesh) {
        mesh.scale.setScalar(scale)
      }
    })
  }, [scale])


  useEffect(() => {
    if (!sceneRef.current) return // Safety check: make sure scene exists

    const scene = sceneRef.current

    // CREATE DIFFERENT BACKGROUNDS based on environment prop from App.jsx
    const createEnvironment = (envType) => {
      switch(envType) {
        case 'purple':
          // Create purple gradient background using HTML5 canvas
          const canvas = document.createElement('canvas')
          const context = canvas.getContext('2d')
          canvas.width = 512
          canvas.height = 512
          const gradient = context.createLinearGradient(0, 0, 0, canvas.height)
          gradient.addColorStop(0, '#1a0033')
          gradient.addColorStop(0.3, '#320059')
          gradient.addColorStop(0.7, '#4a0e6b')
          gradient.addColorStop(1, '#0f0520')
          context.fillStyle = gradient
          context.fillRect(0, 0, canvas.width, canvas.height)
          scene.background = new THREE.CanvasTexture(canvas) // Convert canvas to Three.js texture
          break

        case 'space':
          // Create northern lights aurora effect
          const spaceCanvas = document.createElement('canvas')
          const spaceCtx = spaceCanvas.getContext('2d')
          spaceCanvas.width = 1024
          spaceCanvas.height = 1024
          
          // Base dark night sky gradient
          const baseGrad = spaceCtx.createLinearGradient(0, 0, 0, spaceCanvas.height)
          baseGrad.addColorStop(0, '#0a0f1c')    // Dark blue top
          baseGrad.addColorStop(0.3, '#1a1a2e')  // Deeper blue
          baseGrad.addColorStop(0.7, '#16213e')  // Navy blue
          baseGrad.addColorStop(1, '#0f0f23')    // Almost black bottom
          spaceCtx.fillStyle = baseGrad
          spaceCtx.fillRect(0, 0, spaceCanvas.width, spaceCanvas.height)
          
          // Aurora curtain layers with different colors
          const aurora1 = spaceCtx.createLinearGradient(0, 200, 0, 600)
          aurora1.addColorStop(0, 'transparent')
          aurora1.addColorStop(0.2, '#00ff8880')  // Bright green
          aurora1.addColorStop(0.4, '#00e6ff90')  // Bright cyan
          aurora1.addColorStop(0.6, '#0080ff70')  // Bright blue
          aurora1.addColorStop(0.8, '#00408050')  // Dark blue
          aurora1.addColorStop(1, 'transparent')
          spaceCtx.fillStyle = aurora1
          spaceCtx.fillRect(0, 200, spaceCanvas.width, 400)
          
          // Additional aurora layers for complex effect...
          const aurora2 = spaceCtx.createLinearGradient(0, 100, 0, 700)
          aurora2.addColorStop(0, 'transparent')
          aurora2.addColorStop(0.15, '#8000ff60') // Bright purple
          aurora2.addColorStop(0.35, '#ff00ff80') // Bright magenta
          aurora2.addColorStop(0.55, '#ff006070') // Bright pink
          aurora2.addColorStop(0.75, '#80004050') // Dark purple
          aurora2.addColorStop(1, 'transparent')
          spaceCtx.fillStyle = aurora2
          spaceCtx.fillRect(0, 100, spaceCanvas.width, 600)
          
          const aurora3 = spaceCtx.createLinearGradient(0, 150, 0, 450)
          aurora3.addColorStop(0, 'transparent')
          aurora3.addColorStop(0.25, '#80ff0060') // Yellow-green
          aurora3.addColorStop(0.45, '#00ff4080') // Bright green
          aurora3.addColorStop(0.65, '#00804060') // Dark green
          aurora3.addColorStop(1, 'transparent')
          spaceCtx.fillStyle = aurora3
          spaceCtx.fillRect(0, 150, spaceCanvas.width, 300)
          
          // Add stars scattered across the sky
          for(let i = 0; i < 150; i++) {
            const x = Math.random() * spaceCanvas.width
            const y = Math.random() * spaceCanvas.height
            const brightness = Math.random() * 0.6 + 0.2
            const size = Math.random() * 1.5
            
            spaceCtx.fillStyle = `rgba(255,255,255,${brightness})`
            spaceCtx.fillRect(x, y, size, size)
          }
          
          scene.background = new THREE.CanvasTexture(spaceCanvas)
          break

        case 'sunset':
          // Create sunset gradient
          const sunsetCanvas = document.createElement('canvas')
          const sunsetCtx = sunsetCanvas.getContext('2d')
          sunsetCanvas.width = 512
          sunsetCanvas.height = 512
          const sunsetGrad = sunsetCtx.createLinearGradient(0, 0, 0, sunsetCanvas.height)
          sunsetGrad.addColorStop(0, '#362aa3ff')
          sunsetGrad.addColorStop(0.3, '#f7931e')
          sunsetGrad.addColorStop(0.7, '#d1a907ff')
          sunsetGrad.addColorStop(1, '#62445eff')
          sunsetCtx.fillStyle = sunsetGrad
          sunsetCtx.fillRect(0, 0, sunsetCanvas.width, sunsetCanvas.height)
          scene.background = new THREE.CanvasTexture(sunsetCanvas)
          break

        case 'matrix':
          // Create matrix-style blue gradient
          const matrixCanvas = document.createElement('canvas')
          const matrixCtx = matrixCanvas.getContext('2d')
          matrixCanvas.width = 512
          matrixCanvas.height = 512
          const matrixGrad = matrixCtx.createLinearGradient(0, 0, 0, matrixCanvas.height)
          matrixGrad.addColorStop(1, '#3d1642ff')
          matrixGrad.addColorStop(.3, '#572a95ff')
          matrixGrad.addColorStop(0.5, '#083cd6ff')
          matrixGrad.addColorStop(1, '#120101ff')
          matrixCtx.fillStyle = matrixGrad
          matrixCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height)
          scene.background = new THREE.CanvasTexture(matrixCanvas)
          break

        default:
          scene.background = new THREE.Color(0x000000) // Plain black
      }
    }

    createEnvironment(environment) // Use current environment prop from App.jsx
  }, [environment]) // Run this effect when environment prop changes

  // ===============================================
  // OBJECTS CREATOR - RESPONDS TO MULTIPLE PROPS
  // ===============================================
  // When App.jsx changes objectCount, baseColor, specularColor, etc., this useEffect runs
  // and recreates all the 3D objects with the new values
  
  useEffect(() => {
    if (!sceneRef.current) return // Safety check

    const scene = sceneRef.current
    
    // REMOVE OLD OBJECTS from scene and clear our reference array
    objectsRef.current.forEach(obj => {
      // Remove solid and wireframe meshes
      if (obj.solidMesh) scene.remove(obj.solidMesh)
      if (obj.wireframeMesh) scene.remove(obj.wireframeMesh)
      // Remove intricate wireframe elements
      if (obj.centerLines) scene.remove(obj.centerLines)
      if (obj.curvedLines) scene.remove(obj.curvedLines)
      // Also handle legacy single mesh objects
      if (obj.mesh) scene.remove(obj.mesh)
    })
    objectsRef.current = []

    // CREATE NEW OBJECTS using current App.jsx prop values
    for (let i = 0; i < objectCount; i++) { // Use objectCount prop from App.jsx
      
      // CHOOSE GEOMETRY based on objectType prop from App.jsx
      let geometry
      if (objectCount === 1) {
        // Single object: use the selected objectType from App.jsx
        geometry = createGeometryByType(objectType)
      } else {
        // Multiple objects: cycle through different types for variety
        const geometryTypes = [
          () => new THREE.IcosahedronGeometry(),
          () => new THREE.SphereGeometry(1, 16, 16),
          () => new THREE.BoxGeometry(1.5, 1.5, 1.5),
          () => new THREE.OctahedronGeometry(),
          () => new THREE.TetrahedronGeometry(1.2),
          () => new THREE.TorusKnotGeometry(1, .2, 150, 16),
        ]
        geometry = geometryTypes[i % geometryTypes.length]()
      }
      
      // Store original vertex positions for advanced animations
      const originalPositions = geometry.attributes.position.array.slice()
      
      // CREATE SOLID MATERIAL using current App.jsx prop values
      const currentBaseColor = new THREE.Color(baseColor)           // Convert App.jsx baseColor prop
      const currentSpecularColor = new THREE.Color(specularColor)   // Convert App.jsx specularColor prop
      
      const material = new THREE.MeshPhongMaterial({
        color: currentBaseColor,                    // Use baseColor prop from App.jsx
        specular: currentSpecularColor,             // Use specularColor prop from App.jsx
        shininess: shininess,                       // Use shininess prop from App.jsx
        wireframe: false,                           // Solid material is NEVER wireframe
        transparent: true,                          // Always transparent for blending
        opacity: 1 - (wireframeIntensity / 100),   // Start with inverse of wireframe intensity
        flatShading: false,
        reflectivity: specularIntensity,            // Use specularIntensity prop from App.jsx
      })

      console.log(`Created object ${i} with specular color:`, currentSpecularColor, 'from state:', specularColor)

      // CREATE TWO MESHES - One solid, one wireframe for blending
      const solidMesh = new THREE.Mesh(geometry, material)
      
      let wireframeMesh
      let wireframeMaterial // Make sure this is available for all geometry types
      
      if (geometry.type === 'BoxGeometry') {
        // CUSTOM THICK WIREFRAME for BoxGeometry
        wireframeMaterial = new THREE.MeshPhongMaterial({
          color: currentBaseColor,
          specular: currentSpecularColor,
          shininess: shininess,
          transparent: true,
          opacity: wireframeIntensity / 100,
          flatShading: false,
          reflectivity: specularIntensity,
        })
        
        // Create thick wireframe using cylinders for cube edges
        const cubeWireframeGroup = new THREE.Group()
        
        // Get the 8 corners of the cube
        const size = 0.75 // Half of 1.5
        const cubeCorners = [
          [-size, -size, -size], [size, -size, -size], [size, size, -size], [-size, size, -size], // Back face
          [-size, -size, size], [size, -size, size], [size, size, size], [-size, size, size]   // Front face
        ]
        
        // Define the 12 edges of the cube
        const cubeEdges = [
          // Back face edges
          [0, 1], [1, 2], [2, 3], [3, 0],
          // Front face edges  
          [4, 5], [5, 6], [6, 7], [7, 4],
          // Connecting edges between front and back
          [0, 4], [1, 5], [2, 6], [3, 7]
        ]
        
        // Create cylinder for each cube edge
        cubeEdges.forEach(([i, j]) => {
          const start = new THREE.Vector3(...cubeCorners[i])
          const end = new THREE.Vector3(...cubeCorners[j])
          const distance = start.distanceTo(end)
          
          // Create thick cylinder for cube edge - ADJUST 0.012 TO CHANGE MAIN WIREFRAME THICKNESS
          const cylinderGeom = new THREE.CylinderGeometry(0.012, 0.012, distance, 8)
          const cylinderMesh = new THREE.Mesh(cylinderGeom, wireframeMaterial)
          
          // Position cylinder between start and end points
          cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5))
          cylinderMesh.lookAt(end)
          cylinderMesh.rotateX(Math.PI / 2)
          
          cubeWireframeGroup.add(cylinderMesh)
        })
        
        wireframeMesh = cubeWireframeGroup
        console.log('Created thick wireframe for cube with', cubeEdges.length, 'cylinder edges')
        
      } else if (geometry.type === 'OctahedronGeometry') {
        // CUSTOM THICK WIREFRAME for OctahedronGeometry
        wireframeMaterial = new THREE.MeshPhongMaterial({
          color: currentBaseColor,
          specular: currentSpecularColor,
          shininess: shininess,
          transparent: true,
          opacity: wireframeIntensity / 100,
          flatShading: false,
          reflectivity: specularIntensity,
        })
        
        // Create thick wireframe using cylinders for octahedron edges
        const octahedronWireframeGroup = new THREE.Group()
        
        // Get the 6 vertices from the octahedron geometry (like tetrahedron does)
        // Use canonical octahedron vertices for consistent wireframe
        const octaVertices = [
          [0, 1, 0],    // 0: Top vertex
          [0, -1, 0],   // 1: Bottom vertex
          [1, 0, 0],    // 2: Right vertex
          [-1, 0, 0],   // 3: Left vertex
          [0, 0, 1],    // 4: Front vertex
          [0, 0, -1]    // 5: Back vertex
        ]
        
        // Define the 12 edges of the octahedron
        const octahedronMainEdges = [
          // Top pyramid edges
          [0, 2], [0, 3], [0, 4], [0, 5],
          // Bottom pyramid edges
          [1, 2], [1, 3], [1, 4], [1, 5],
          // Middle ring edges
          [2, 4], [4, 3], [3, 5], [5, 2]
        ]
        
        // Create cylinder for each octahedron edge
        octahedronMainEdges.forEach(([i, j]) => {
          const start = new THREE.Vector3(...octaVertices[i])
          const end = new THREE.Vector3(...octaVertices[j])
          const distance = start.distanceTo(end)
          
          // Create thick cylinder for octahedron edge - ADJUST 0.012 TO CHANGE MAIN WIREFRAME THICKNESS
          const cylinderGeom = new THREE.CylinderGeometry(0.012, 0.012, distance, 8)
          const cylinderMesh = new THREE.Mesh(cylinderGeom, wireframeMaterial)
          
          // Position cylinder between start and end points
          cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5))
          cylinderMesh.lookAt(end)
          cylinderMesh.rotateX(Math.PI / 2)
          
          octahedronWireframeGroup.add(cylinderMesh)
        })
        
        wireframeMesh = octahedronWireframeGroup
        console.log('Created thick wireframe for octahedron with', octahedronMainEdges.length, 'cylinder edges')
        
      } else if (geometry.type === 'TetrahedronGeometry') {
        // CUSTOM THICK WIREFRAME for TetrahedronGeometry
        wireframeMaterial = new THREE.MeshPhongMaterial({
          color: currentBaseColor,
          specular: currentSpecularColor,
          shininess: shininess,
          transparent: true,
          opacity: wireframeIntensity / 100,
          flatShading: false,
          reflectivity: specularIntensity,
        })
        
        // Create thick wireframe using cylinders for tetrahedron edges
        const tetrahedronWireframeGroup = new THREE.Group()
        
        // Get the 4 vertices from the tetrahedron geometry
        const vertices = geometry.attributes.position.array
        const tetraVertices = []
        for (let v = 0; v < 4; v++) {
          tetraVertices.push([
            vertices[v * 3],
            vertices[v * 3 + 1], 
            vertices[v * 3 + 2]
          ])
        }
        
        // Define the 6 edges of the tetrahedron
        const tetrahedronMainEdges = [
          [0, 1], [0, 2], [0, 3],  // From vertex 0 to others
          [1, 2], [1, 3],          // From vertex 1 to remaining 
          [2, 3]                   // From vertex 2 to 3
        ]
        
        // Create cylinder for each main tetrahedron edge
        tetrahedronMainEdges.forEach(([i, j]) => {
          const start = new THREE.Vector3(...tetraVertices[i])
          const end = new THREE.Vector3(...tetraVertices[j])
          const distance = start.distanceTo(end)
          
          // Create thick cylinder for main tetrahedron edge
          const cylinderGeom = new THREE.CylinderGeometry(0.006, 0.006, distance, 8)
          const cylinderMesh = new THREE.Mesh(cylinderGeom, wireframeMaterial)
          
          // Position cylinder between start and end points
          cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5))
          cylinderMesh.lookAt(end)
          cylinderMesh.rotateX(Math.PI / 2)
          
          tetrahedronWireframeGroup.add(cylinderMesh)
        })
        
        wireframeMesh = tetrahedronWireframeGroup
        console.log('Created thick wireframe for tetrahedron with', tetrahedronMainEdges.length, 'cylinder edges')
        } else if (geometry.type === 'IcosahedronGeometry') {
  // === ICOSAHEDRON MAIN WIREFRAME ===
  // This block creates the thick wireframe for the icosahedron using cylinders for each edge.
  // To control the wireframe thickness, adjust the value below:
  //   const cylinderGeom = new THREE.CylinderGeometry(0.012, 0.012, distance, 8)
  // Change 0.012 to your desired radius (e.g. 0.008 for thinner, 0.02 for thicker)
          // CUSTOM THICK WIREFRAME for IcosahedronGeometry
          wireframeMaterial = new THREE.MeshPhongMaterial({
            color: currentBaseColor,
            specular: currentSpecularColor,
            shininess: shininess,
            transparent: true,
            opacity: wireframeIntensity / 100,
            flatShading: false,
            reflectivity: specularIntensity,
          })
          // Canonical icosahedron vertices
          const phi = (1 + Math.sqrt(5)) / 2;
          const rawVertices = [
            [-1, phi, 0], [1, phi, 0], [-1, -phi, 0], [1, -phi, 0],
            [0, -1, phi], [0, 1, phi], [0, -1, -phi], [0, 1, -phi],
            [phi, 0, -1], [phi, 0, 1], [-phi, 0, -1], [-phi, 0, 1]
          ];
          const vertices = rawVertices.map(v => {
            const vec = new THREE.Vector3(...v);
            return vec.normalize().toArray();
          });
          // Find all edges: connect vertices that are distance ≈ 2.0 apart
          const edgeThreshold = 2.1;
          let icosahedronEdges = [];
          for (let i = 0; i < vertices.length; i++) {
            for (let j = i + 1; j < vertices.length; j++) {
              const v1 = new THREE.Vector3(...vertices[i]);
              const v2 = new THREE.Vector3(...vertices[j]);
              if (v1.distanceTo(v2) < edgeThreshold) {
                icosahedronEdges.push([i, j]);
              }
            }
          }
          const icosahedronWireframeGroup = new THREE.Group();
          icosahedronEdges.forEach(([i, j]) => {
            const start = new THREE.Vector3(...vertices[i]);
            const end = new THREE.Vector3(...vertices[j]);
            const distance = start.distanceTo(end);
            // Use thick cylinder for main wireframe
            const cylinderGeom = new THREE.CylinderGeometry(0.012, 0.012, distance, 8);
            const cylinderMesh = new THREE.Mesh(cylinderGeom, wireframeMaterial);
            cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5));
            cylinderMesh.lookAt(end);
            cylinderMesh.rotateX(Math.PI / 2);
            icosahedronWireframeGroup.add(cylinderMesh);
          });
          wireframeMesh = icosahedronWireframeGroup;
          console.log('Created thick wireframe for icosahedron with', icosahedronEdges.length, 'cylinder edges');
        
      } else {
        // Standard thin wireframe for other geometries
        wireframeMaterial = new THREE.MeshPhongMaterial({
          color: currentBaseColor,
          specular: currentSpecularColor,
          shininess: shininess,
          wireframe: true,           // This one is always wireframe
          transparent: true,
          opacity: wireframeIntensity / 100, // Start with current wireframe intensity
          flatShading: false,
          reflectivity: specularIntensity,
        })
        
        wireframeMesh = new THREE.Mesh(geometry, wireframeMaterial)
      }
      
      // CREATE INTRICATE WIREFRAME DETAILS
      console.log(`Creating intricate wireframe for object ${i}, geometry type:`, geometry.type)
      console.log('Available geometry types check:', geometry.type === 'TetrahedronGeometry')
      console.log('Geometry constructor:', geometry.constructor.name)
      console.log('All geometry properties:', Object.getOwnPropertyNames(geometry))
      
      // Create simple center-to-vertex wireframes for tetrahedron only
      let centerLines, centerLinesMaterial, curvedLines, curvedLinesMaterial
      
      if (geometry.type === 'TetrahedronGeometry' || geometry.constructor.name === 'TetrahedronGeometry') {
        // TETRAHEDRON: Create hyper-tetrahedron like hypercube but with LineSegments
        console.log('*** ENTERING TETRAHEDRON SECTION ***')
        console.log('Creating hyper-tetrahedron with inner tetrahedron and vertex connections')
        
        // Get the 4 vertices from the tetrahedron geometry
        const vertices = geometry.attributes.position.array
        const outerVertices = []
        for (let v = 0; v < 4; v++) {
          outerVertices.push([
            vertices[v * 3],     // x
            vertices[v * 3 + 1], // y  
            vertices[v * 3 + 2]  // z
          ])
        }
        
        console.log('Outer tetrahedron vertices:', outerVertices)
        
        // Create inner tetrahedron vertices (scaled down by 0.5 from center)
        const innerVertices = outerVertices.map(vertex => [
          vertex[0] * 0.5,
          vertex[1] * 0.5,
          vertex[2] * 0.5
        ])
        
        console.log('Inner tetrahedron vertices:', innerVertices)
        
        // 1. Create inner tetrahedron wireframe using thick cylinders
        centerLinesMaterial = new THREE.MeshBasicMaterial({
          color: new THREE.Color(intricateWireframeSpiralColor), // USE SPIRAL COLOR CONTROL!
          transparent: false,
          opacity: 1.0,
        })
        
        const innerTetrahedronGroup = new THREE.Group()
        
        // Tetrahedron edges: connect every vertex to every other vertex (6 edges total)
        const edges = [
          [0, 1], [0, 2], [0, 3],  // From vertex 0 to others
          [1, 2], [1, 3],          // From vertex 1 to remaining 
          [2, 3]                   // From vertex 2 to 3
        ]
        
        // Create cylinder for each inner tetrahedron edge
        edges.forEach(([i, j]) => {
          const start = new THREE.Vector3(...innerVertices[i])
          const end = new THREE.Vector3(...innerVertices[j])
          const distance = start.distanceTo(end)
          
          // Create thick cylinder for inner tetrahedron edge - ADJUST 0.004 TO CHANGE THICKNESS
          const cylinderGeom = new THREE.CylinderGeometry(0.004, 0.004, distance, 8)
          const cylinderMesh = new THREE.Mesh(cylinderGeom, centerLinesMaterial)
          
          // Position cylinder between start and end points
          cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5))
          cylinderMesh.lookAt(end)
          cylinderMesh.rotateX(Math.PI / 2)
          
          innerTetrahedronGroup.add(cylinderMesh)
        })
        
        centerLines = innerTetrahedronGroup
        console.log(`Created inner tetrahedron: 6 thick cylinder edges`)
        
        // 2. Create hyper-tetrahedron connections (vertex to vertex) using thick cylinders
        curvedLinesMaterial = new THREE.MeshBasicMaterial({
          color: new THREE.Color(intricateWireframeEdgeColor), // USE EDGE COLOR CONTROL!
          transparent: false,
          opacity: 1.0,
        })
        
        // Create thick connection lines using cylinder geometry
        const tetrahedronConnectionGroup = new THREE.Group()
        
        // Connect each outer vertex to corresponding inner vertex (4 connections going INWARD)
        for (let v = 0; v < 4; v++) {
          const start = new THREE.Vector3(...outerVertices[v])
          const end = new THREE.Vector3(...innerVertices[v])
          const distance = start.distanceTo(end)
          
          // Create cylinder for each connection line - ADJUST 0.003 TO CHANGE THICKNESS
          const cylinderGeom = new THREE.CylinderGeometry(0.003, 0.003, distance, 6)
          const cylinderMesh = new THREE.Mesh(cylinderGeom, curvedLinesMaterial)
          
          // Position cylinder between start and end points
          cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5))
          cylinderMesh.lookAt(end)
          cylinderMesh.rotateX(Math.PI / 2)
          
          tetrahedronConnectionGroup.add(cylinderMesh)
        }
        
        curvedLines = tetrahedronConnectionGroup
        console.log(`Created hyper-tetrahedron connections: 4 thick vertex-to-vertex connections`)
        
      } else if (geometry.type === 'BoxGeometry') {
        // CUBE/BOX: Create hypercube-style inner cube with corner-to-corner connections
        console.log('Creating hypercube wireframe for BoxGeometry')
        
        // Get the 8 corners of the outer cube (BoxGeometry 1.5x1.5x1.5)
        const size = 0.75 // Half of 1.5
        const outerCorners = [
          [-size, -size, -size], // 0: bottom-back-left
          [size, -size, -size],  // 1: bottom-back-right  
          [size, size, -size],   // 2: top-back-right
          [-size, size, -size],  // 3: top-back-left
          [-size, -size, size],  // 4: bottom-front-left
          [size, -size, size],   // 5: bottom-front-right
          [size, size, size],    // 6: top-front-right
          [-size, size, size]    // 7: top-front-left
        ]
        
        // Create inner cube (scaled down to be INSIDE the outer cube)
        const innerScale = 0.5
        const innerCorners = outerCorners.map(corner => [
          corner[0] * innerScale,
          corner[1] * innerScale, 
          corner[2] * innerScale
        ])
        
        // 1. Create inner cube wireframe using thick cylinders
        const centerLinesGeometry = new THREE.BufferGeometry() // Keep for compatibility
        
        // Inner cube edges - proper cube wireframe structure
        const innerEdges = [
          // Back face (z = -size)
          [0, 1], [1, 2], [2, 3], [3, 0],
          // Front face (z = +size)  
          [4, 5], [5, 6], [6, 7], [7, 4],
          // Connecting edges between front and back
          [0, 4], [1, 5], [2, 6], [3, 7]
        ]
        
        centerLinesMaterial = new THREE.MeshBasicMaterial({
          color: new THREE.Color('#ff0000'), // Bright red for inner cube
          transparent: false,
          opacity: 1.0,
        })
        
        // Create thick visible lines using cylinder geometry
        const innerCubeGroup = new THREE.Group()
        
        innerEdges.forEach(([i, j]) => {
          const start = new THREE.Vector3(...innerCorners[i])
          const end = new THREE.Vector3(...innerCorners[j])
          const distance = start.distanceTo(end)
          
          // Create cylinder for each edge
          const cylinderGeom = new THREE.CylinderGeometry(0.003, 0.008, distance, 8)
          const cylinderMesh = new THREE.Mesh(cylinderGeom, centerLinesMaterial)
          
          // Position cylinder between start and end points
          cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5))
          cylinderMesh.lookAt(end)
          cylinderMesh.rotateX(Math.PI / 2)
          
          innerCubeGroup.add(cylinderMesh)
        })
        
        centerLines = innerCubeGroup
        console.log(`Created hypercube inner cube with ${innerEdges.length} cylinder edges`)
        
        // 2. Create hypercube connections (corner to corner) using thick cylinders
        curvedLinesMaterial = new THREE.MeshBasicMaterial({
          color: new THREE.Color('#00ff00'), // Bright green for connections
          transparent: false,
          opacity: 1.0,
        })
        
        // Create thick connection lines using cylinder geometry
        const connectionGroup = new THREE.Group()
        
        // Connect each inner corner to corresponding outer corner
        for (let i = 0; i < 8; i++) {
          const start = new THREE.Vector3(...innerCorners[i])
          const end = new THREE.Vector3(...outerCorners[i])
          const distance = start.distanceTo(end)
          
          // Create cylinder for each connection line - ADJUST 0.005 TO CHANGE THICKNESS
          const cylinderGeom = new THREE.CylinderGeometry(0.003, 0.005, distance, 6)
          const cylinderMesh = new THREE.Mesh(cylinderGeom, curvedLinesMaterial)
          
          // Position cylinder between start and end points
          cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5))
          cylinderMesh.lookAt(end)
          cylinderMesh.rotateX(Math.PI / 2)
          
          connectionGroup.add(cylinderMesh)
        }
        
        curvedLines = connectionGroup
        console.log(`Created hypercube connections: 8 thick cylinder connections`)
        
      } else if (geometry.type === 'OctahedronGeometry') {
        // OCTAHEDRON: Create hyper-octahedron with inner octahedron and connections
        console.log('Creating hyper-octahedron wireframe for OctahedronGeometry')
        
        // Get the 6 vertices of the octahedron (top, bottom, and 4 around the middle)
        const size = 1.0 // Octahedron radius
        const outerVertices = [
          [0, size, 0],    // 0: Top vertex
          [0, -size, 0],   // 1: Bottom vertex
          [size, 0, 0],    // 2: Right vertex
          [-size, 0, 0],   // 3: Left vertex
          [0, 0, size],    // 4: Front vertex
          [0, 0, -size]    // 5: Back vertex
        ]
        
        // Create inner octahedron (scaled down)
        const innerScale = 0.5
        const innerVertices = outerVertices.map(vertex => [
          vertex[0] * innerScale,
          vertex[1] * innerScale,
          vertex[2] * innerScale
        ])
        
        // 1. Create inner octahedron wireframe using thick cylinders
        centerLinesMaterial = new THREE.MeshBasicMaterial({
          color: new THREE.Color('#ff0000'), // Bright red for inner octahedron
          transparent: false,
          opacity: 1.0,
        })
        
        const innerOctahedronGroup = new THREE.Group()
        
        // Define the 12 edges of the octahedron
        const octahedronEdges = [
          // Top pyramid edges (from top vertex to middle ring)
          [0, 2], [0, 3], [0, 4], [0, 5],
          // Bottom pyramid edges (from bottom vertex to middle ring)
          [1, 2], [1, 3], [1, 4], [1, 5],
          // Middle ring edges (connecting the 4 middle vertices)
          [2, 4], [4, 3], [3, 5], [5, 2]
        ]
        
        // Create cylinder for each inner octahedron edge
       
        
        
        
        // Create thick connection lines using cylinder geometry
        const octahedronConnectionGroup = new THREE.Group()
        
        // Connect each inner vertex to corresponding outer vertex
        for (let i = 0; i < 6; i++) {
          const start = new THREE.Vector3(...innerVertices[i])
          const end = new THREE.Vector3(...outerVertices[i])
          const distance = start.distanceTo(end)
          
          // Create cylinder for each connection line - ADJUST 0.003 TO CHANGE THICKNESS
          const cylinderGeom = new THREE.CylinderGeometry(0.003, 0.003, distance, 6)
          const cylinderMesh = new THREE.Mesh(cylinderGeom, curvedLinesMaterial)
          
          // Position cylinder between start and end points
          cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5))
          cylinderMesh.lookAt(end)
          cylinderMesh.rotateX(Math.PI / 2)
          
          octahedronConnectionGroup.add(cylinderMesh)
        }
        
        curvedLines = octahedronConnectionGroup
        console.log(`Created hyper-octahedron connections: 6 vertex-to-vertex connections`)

        } else if (geometry.type === 'IcosahedronGeometry') {
          // ICOSAHEDRON: Create hyper-icosahedron with inner icosahedron and connections
          console.log('Creating hyper-icosahedron wireframe for IcosahedronGeometry')

          // Golden ratio for icosahedron construction
          const phi = (1 + Math.sqrt(5)) / 2;
          // Canonical vertices
          const rawVertices = [
            [-1, phi, 0], [1, phi, 0], [-1, -phi, 0], [1, -phi, 0],
            [0, -1, phi], [0, 1, phi], [0, -1, -phi], [0, 1, -phi],
            [phi, 0, -1], [phi, 0, 1], [-phi, 0, -1], [-phi, 0, 1]
          ];
          // Normalize all vertices to radius 1
          const outerVertices = rawVertices.map(v => {
            const vec = new THREE.Vector3(...v);
            return vec.normalize().toArray();
          });
          // Create inner icosahedron (scaled down)
          const innerScale = 0.5;
          const innerVertices = outerVertices.map(vertex => [
            vertex[0] * innerScale,
            vertex[1] * innerScale,
            vertex[2] * innerScale
          ]);

          // 1. Create inner icosahedron wireframe using thick cylinders
          centerLinesMaterial = new THREE.MeshBasicMaterial({
            color: intricateWireframeSpiralColor,
            transparent: false,
            opacity: 1.0,
          });
          const innerIcosahedronGroup = new THREE.Group();
          // Find all edges: connect vertices that are distance ≈ 2.0 apart
          const edgeThreshold = 2.1;
          let icosahedronEdges = [];
          for (let i = 0; i < innerVertices.length; i++) {
            for (let j = i + 1; j < innerVertices.length; j++) {
              const v1 = new THREE.Vector3(...innerVertices[i]);
              const v2 = new THREE.Vector3(...innerVertices[j]);
              if (v1.distanceTo(v2) < edgeThreshold) {
                icosahedronEdges.push([i, j]);
              }
            }
          }
          icosahedronEdges.forEach(([i, j]) => {
            const start = new THREE.Vector3(...innerVertices[i]);
            const end = new THREE.Vector3(...innerVertices[j]);
            const distance = start.distanceTo(end);
            const cylinderGeom = new THREE.CylinderGeometry(0.004, 0.004, distance, 8);
            const cylinderMesh = new THREE.Mesh(cylinderGeom, centerLinesMaterial);
            cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5));
            cylinderMesh.lookAt(end);
            cylinderMesh.rotateX(Math.PI / 2);
            innerIcosahedronGroup.add(cylinderMesh);
          });
          centerLines = innerIcosahedronGroup;
          console.log(`Created hyper-icosahedron inner wireframe with ${icosahedronEdges.length} cylinder edges`);

          // 2. Create hyper-icosahedron connections (vertex to vertex) using thick cylinders
          curvedLinesMaterial = new THREE.MeshBasicMaterial({
            color: intricateWireframeEdgeColor,
            transparent: false,
            opacity: 1.0,
          });
          const icosahedronConnectionGroup = new THREE.Group();
          for (let i = 0; i < 12; i++) {
            const start = new THREE.Vector3(...outerVertices[i]);
            const end = new THREE.Vector3(...innerVertices[i]);
            const distance = start.distanceTo(end);
            const cylinderGeom = new THREE.CylinderGeometry(0.003, 0.003, distance, 6);
            const cylinderMesh = new THREE.Mesh(cylinderGeom, curvedLinesMaterial);
            cylinderMesh.position.copy(start.clone().add(end).multiplyScalar(0.5));
            cylinderMesh.lookAt(end);
            cylinderMesh.rotateX(Math.PI / 2);
            icosahedronConnectionGroup.add(cylinderMesh);
          }
          curvedLines = icosahedronConnectionGroup;
          console.log(`Created hyper-icosahedron connections: 12 vertex-to-vertex connections`);
        
      } else {
        // OTHER GEOMETRIES: Use existing complex wireframe logic
        const edgesGeometry = new THREE.EdgesGeometry(geometry)
        const edgeVertices = edgesGeometry.attributes.position.array
        
        console.log(`Object ${i} has ${edgeVertices.length / 6} wireframe edges`)
        
        // 1. Spiral connections to wireframe vertices
        const centerLinesGeometry = new THREE.BufferGeometry()
        const centerLinesPositions = []
        
        // Create spiral paths from center to actual wireframe edge points
        let createCenterLines = true
        if (geometry.type === 'TorusKnotGeometry') {
          createCenterLines = false // No center lines for torus
        }
        
        if (createCenterLines) {
          // Use actual wireframe edge endpoints for connections
          for (let j = 0; j < edgeVertices.length; j += 12) { // Every other edge
            const endX = edgeVertices[j + 3] // End point of edge
            const endY = edgeVertices[j + 4]
            const endZ = edgeVertices[j + 5]
            
            // Create spiral path from center to edge endpoint
            const steps = 8 // Number of spiral steps
            for (let step = 0; step < steps; step++) {
              const t1 = step / steps
              const t2 = (step + 1) / steps
              
              // Spiral parameters
              const radius1 = t1 * 0.8 // Gradually increase radius
              const radius2 = t2 * 0.8
              const angle1 = t1 * Math.PI * 2 // One full rotation
              const angle2 = t2 * Math.PI * 2
              
              // Interpolate toward the actual edge point
              const x1 = Math.cos(angle1) * radius1 * (endX / Math.sqrt(endX*endX + endY*endY + endZ*endZ))
              const y1 = Math.sin(angle1) * radius1 * (endY / Math.sqrt(endX*endX + endY*endY + endZ*endZ)) + t1 * endY
              const z1 = t1 * endZ
              
              const x2 = Math.cos(angle2) * radius2 * (endX / Math.sqrt(endX*endX + endY*endY + endZ*endZ))
              const y2 = Math.sin(angle2) * radius2 * (endY / Math.sqrt(endX*endX + endY*endY + endZ*endZ)) + t2 * endY
              const z2 = t2 * endZ
              
              centerLinesPositions.push(x1, y1, z1, x2, y2, z2)
            }
          }
        }
        
        // Only create center lines if we have valid positions
        if (centerLinesPositions.length > 0) {
          centerLinesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(centerLinesPositions, 3))
          
          centerLinesMaterial = new THREE.LineBasicMaterial({
            color: new THREE.Color(intricateWireframeSpiralColor), // Use the new spiral color control
            transparent: true,
            opacity: 0.6,
          })
          
          centerLines = new THREE.LineSegments(centerLinesGeometry, centerLinesMaterial)
          console.log(`Created spiral center lines for object ${i} with ${centerLinesPositions.length / 6} segments`)
        } else {
          centerLines = new THREE.Object3D()
          centerLinesMaterial = null
          console.log(`No center lines created for object ${i}`)
        }
        
        // 2. Enhanced wireframe edge connections
        const curvedLinesGeometry = new THREE.BufferGeometry()
        const curvedLinesPositions = []
        
        // Connect wireframe edges to create enhanced patterns
        for (let j = 0; j < edgeVertices.length; j += 6) {
          const edge1Start = [edgeVertices[j], edgeVertices[j + 1], edgeVertices[j + 2]]
          const edge1End = [edgeVertices[j + 3], edgeVertices[j + 4], edgeVertices[j + 5]]
          
          // Find nearby edges to connect to
          for (let k = j + 6; k < edgeVertices.length && k < j + 36; k += 6) {
            const edge2Start = [edgeVertices[k], edgeVertices[k + 1], edgeVertices[k + 2]]
            const edge2End = [edgeVertices[k + 3], edgeVertices[k + 4], edgeVertices[k + 5]]
            
            // Calculate distance between edge endpoints
            const dist1 = Math.sqrt(
              (edge1End[0] - edge2Start[0])**2 + 
              (edge1End[1] - edge2Start[1])**2 + 
              (edge1End[2] - edge2Start[2])**2
            )
            
            const dist2 = Math.sqrt(
              (edge1End[0] - edge2End[0])**2 + 
              (edge1End[1] - edge2End[1])**2 + 
              (edge1End[2] - edge2End[2])**2
            )
            
            // Connect to nearby edge points
            const maxDist = geometry.type === 'TorusKnotGeometry' ? 0.6 : 1.2
            
            if (dist1 < maxDist) {
              curvedLinesPositions.push(...edge1End, ...edge2Start)
            } else if (dist2 < maxDist) {
              curvedLinesPositions.push(...edge1End, ...edge2End)
            }
          }
        }
        
        // Only create curved lines if we have valid positions
        if (curvedLinesPositions.length > 0) {
          curvedLinesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(curvedLinesPositions, 3))
          
          curvedLinesMaterial = new THREE.LineBasicMaterial({
            color: new THREE.Color(intricateWireframeEdgeColor), // Use the new edge color control
            transparent: true,
            opacity: 0.4,
          })
          
          curvedLines = new THREE.LineSegments(curvedLinesGeometry, curvedLinesMaterial)
          console.log(`Created edge connections for object ${i} with ${curvedLinesPositions.length / 6} segments`)
        } else {
          curvedLines = new THREE.Object3D()
          curvedLinesMaterial = null
          console.log(`No edge connections created for object ${i}`)
        }
      }
      
      // POSITION ALL OBJECTS in same location
      if (objectCount === 1) {
        solidMesh.position.set(0, 0, 0) // Single object at center
        wireframeMesh.position.set(0, 0, 0) // Same position
        centerLines.position.set(0, 0, 0) // Same position
        curvedLines.position.set(0, 0, 0) // Same position
      } else {
        // Multiple objects arranged in a circle
        const angle = (i / objectCount) * Math.PI * 2
        const radius = 3
        const x = Math.cos(angle) * radius
        const y = (Math.random() - 0.9) * 1 // Random Y position for variety
        const z = Math.sin(angle) * radius
        
        solidMesh.position.set(x, y, z)
        wireframeMesh.position.set(x, y, z) // Same position
        centerLines.position.set(x, y, z) // Same position
        curvedLines.position.set(x, y, z) // Same position
      }
      
      // Enable shadows for both meshes
      solidMesh.castShadow = true
      solidMesh.receiveShadow = true
      wireframeMesh.castShadow = true
      wireframeMesh.receiveShadow = true
      
      // Add all meshes to the scene
      scene.add(solidMesh)
      scene.add(wireframeMesh)
      scene.add(centerLines)
      scene.add(curvedLines)
      
      console.log(`Added object ${i} to scene:`, {
        solidMesh: solidMesh.type,
        wireframeMesh: wireframeMesh.type,
        centerLines: centerLines ? centerLines.type : 'NULL',
        curvedLines: curvedLines ? curvedLines.type : 'NULL',
        centerLinesChildren: centerLines ? centerLines.children?.length : 'N/A',
        curvedLinesChildren: curvedLines ? curvedLines.children?.length : 'N/A',
        position: solidMesh.position
      })

      // STORE OBJECT DATA for later updates and animations
      objectsRef.current.push({
        solidMesh,                  // The solid Three.js object
        wireframeMesh,              // The wireframe Three.js object
        centerLines,                // The center-to-vertex lines
        curvedLines,                // The vertex-to-vertex connections
        material,                   // The solid material (for updating properties)
        wireframeMaterial,          // The wireframe material (for updating properties)
        centerLinesMaterial,        // The center lines material (for updating properties)
        curvedLinesMaterial,        // The curved lines material (for updating properties)
        geometry,                   // The geometry (for vertex animations)
        originalPositions,          // Original vertex positions (for morphing effects)
        originalPosition: solidMesh.position.clone(), // Original object position
        phase: Math.random() * Math.PI * 2,      // Random phase for varied animations
        // Magnetic points for magnetic field animation effect
        magneticPoints: [
          { x: Math.random() * 4 - 2, y: Math.random() * 4 - 2, z: Math.random() * 4 - 2, strength: Math.random() + 0.5 },
          { x: Math.random() * 4 - 2, y: Math.random() * 4 - 2, z: Math.random() * 4 - 2, strength: Math.random() + 0.5 },
          { x: Math.random() * 4 - 2, y: Math.random() * 4 - 2, z: Math.random() * 4 - 2, strength: Math.random() + 0.5 }
        ]
      })
    }

    // Store first material as main reference for debugging
    if (objectsRef.current.length > 0) {
      materialRef.current = objectsRef.current[0].material
      console.log('Set main material reference, specular color:', objectsRef.current[0].material.specular.getHex())
    }
    
    console.log(`Created ${objectsRef.current.length} objects with current React state values`)
  }, [objectCount, baseColor, specularColor, objectType]) 
  // ↑ This effect runs when ANY of these App.jsx props change (removed wireframeIntensity, specularIntensity, and shininess)

  // ===============================================
  // CAMERA CONTROLLER - RESPONDS TO cameraView PROP
  // ===============================================
  // When App.jsx changes cameraView prop, this useEffect runs and repositions the camera
  
  useEffect(() => {
    if (!cameraRef.current) return // Safety check

    const camera = cameraRef.current

    // POSITION CAMERA based on cameraView prop from App.jsx
    switch(cameraView) {
      case 'free':
        camera.position.set(0, 0, 6)     // Standard front view
        break
      case 'orbit':
        camera.position.set(0, 3, 6)     // Elevated view for orbiting
        camera.lookAt(0, 0, 0)           // Look at center
        break
      case 'top':
        camera.position.set(0, 10, 0)    // Directly above
        camera.lookAt(0, 0, 0)           // Look down at center
        break
      case 'side':
        camera.position.set(10, 0, 0)    // Far to the right side
        camera.lookAt(0, 0, 0)           // Look at center
        break
      case 'cinematic':
        camera.position.set(-3, 2, 5)    // Dramatic angle
        camera.lookAt(0, 0, 0)           // Look at center
        break
    }
  }, [cameraView]) // Run when cameraView prop from App.jsx changes

  // ===============================================
  // ANIMATION CONTROLLER - RESPONDS TO animationStyle PROP
  // ===============================================
  // When App.jsx changes animationStyle prop, this useEffect runs and starts a new animation loop
  
  useEffect(() => {
    if (!sceneRef.current || !cameraRef.current) return // Safety checks

    const scene = sceneRef.current
    const camera = cameraRef.current

    // MAIN ANIMATION LOOP - Different styles based on animationStyle prop from App.jsx
    function animate() {
      animationIdRef.current = requestAnimationFrame(animate) // Schedule next frame
      
      const time = performance.now() // Get current time for smooth animations
      const t = time * 0.001         // Convert to seconds

      // ANIMATE EACH OBJECT based on animationStyle prop from App.jsx
      objectsRef.current.forEach((objData, index) => {
        const { solidMesh, wireframeMesh, centerLines, curvedLines, mesh, originalPosition, phase, geometry, originalPositions, magneticPoints } = objData
        
        // Use either the new dual-mesh system or legacy single mesh
        const meshesToAnimate = solidMesh && wireframeMesh ? [solidMesh, wireframeMesh, centerLines, curvedLines] : (mesh ? [mesh] : [])
        
        meshesToAnimate.forEach(currentMesh => {
          switch(animationStyle) { // Use animationStyle prop from App.jsx
            case 'rotate':
              // Simple rotation animation - reset vertices to original positions first
              if (geometry && originalPositions && currentMesh === solidMesh) {
                const positions = geometry.attributes.position.array
                for (let i = 0; i < positions.length; i++) {
                  positions[i] = originalPositions[i]
                }
                geometry.attributes.position.needsUpdate = true
                
                // Also reset wireframe geometry to match original positions
                if (centerLines && centerLines.geometry && geometry.type !== 'TetrahedronGeometry') {
                  // Rebuild spiral wireframe for non-tetrahedron geometries
                  const edgesGeometry = new THREE.EdgesGeometry(geometry)
                  const edgeVertices = edgesGeometry.attributes.position.array
                  
                  const centerLinesGeometry = centerLines.geometry
                  const centerLinesPositions = []
                  
                  // Recreate spiral paths from center to original edge points
                  for (let j = 0; j < edgeVertices.length; j += 12) {
                    const endX = edgeVertices[j + 3]
                    const endY = edgeVertices[j + 4]
                    const endZ = edgeVertices[j + 5]
                    
                    const steps = 8
                    for (let step = 0; step < steps; step++) {
                      const t1 = step / steps
                      const t2 = (step + 1) / steps
                      
                      const radius1 = t1 * 0.8
                      const radius2 = t2 * 0.8
                      const angle1 = t1 * Math.PI * 2
                      const angle2 = t2 * Math.PI * 2
                      
                      const x1 = Math.cos(angle1) * radius1 * (endX / Math.sqrt(endX*endX + endY*endY + endZ*endZ))
                      const y1 = Math.sin(angle1) * radius1 * (endY / Math.sqrt(endX*endX + endY*endY + endZ*endZ)) + t1 * endY
                      const z1 = t1 * endZ
                      
                      const x2 = Math.cos(angle2) * radius2 * (endX / Math.sqrt(endX*endX + endY*endY + endZ*endZ))
                      const y2 = Math.sin(angle2) * radius2 * (endY / Math.sqrt(endX*endX + endY*endY + endZ*endZ)) + t2 * endY
                      const z2 = t2 * endZ
                      
                      centerLinesPositions.push(x1, y1, z1, x2, y2, z2)
                    }
                  }
                  
                  if (centerLinesPositions.length > 0) {
                    centerLinesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(centerLinesPositions, 3))
                  }
                }
              }
              
              currentMesh.rotation.x += 0.01
              currentMesh.rotation.y += 0.01
              currentMesh.rotation.z += 0.01
              currentMesh.position.copy(originalPosition)
              break

            case 'float':
              // Floating/bobbing animation - reset vertices to original positions first
              if (geometry && originalPositions && currentMesh === solidMesh) {
                const positions = geometry.attributes.position.array
                for (let i = 0; i < positions.length; i++) {
                  positions[i] = originalPositions[i]
                }
                geometry.attributes.position.needsUpdate = true
                
                // Also reset wireframe geometry to match original positions
                if (centerLines && centerLines.geometry && geometry.type !== 'TetrahedronGeometry') {
                  // Rebuild spiral wireframe for non-tetrahedron geometries
                  const edgesGeometry = new THREE.EdgesGeometry(geometry)
                  const edgeVertices = edgesGeometry.attributes.position.array
                  
                  const centerLinesGeometry = centerLines.geometry
                  const centerLinesPositions = []
                  
                  // Recreate spiral paths from center to original edge points
                  for (let j = 0; j < edgeVertices.length; j += 12) {
                    const endX = edgeVertices[j + 3]
                    const endY = edgeVertices[j + 4]
                    const endZ = edgeVertices[j + 5]
                    
                    const steps = 8
                    for (let step = 0; step < steps; step++) {
                      const t1 = step / steps
                      const t2 = (step + 1) / steps
                      
                      const radius1 = t1 * 0.8
                      const radius2 = t2 * 0.8
                      const angle1 = t1 * Math.PI * 2
                      const angle2 = t2 * Math.PI * 2
                      
                      const x1 = Math.cos(angle1) * radius1 * (endX / Math.sqrt(endX*endX + endY*endY + endZ*endZ))
                      const y1 = Math.sin(angle1) * radius1 * (endY / Math.sqrt(endX*endX + endY*endY + endZ*endZ)) + t1 * endY
                      const z1 = t1 * endZ
                      
                      const x2 = Math.cos(angle2) * radius2 * (endX / Math.sqrt(endX*endX + endY*endY + endZ*endZ))
                      const y2 = Math.sin(angle2) * radius2 * (endY / Math.sqrt(endX*endX + endY*endY + endZ*endZ)) + t2 * endY
                      const z2 = t2 * endZ
                      
                      centerLinesPositions.push(x1, y1, z1, x2, y2, z2)
                    }
                  }
                  
                  if (centerLinesPositions.length > 0) {
                    centerLinesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(centerLinesPositions, 3))
                  }
                }
              }
              
              currentMesh.rotation.x = t + phase
              currentMesh.rotation.y = t * 0.7 + phase
              currentMesh.position.x = originalPosition.x + Math.sin(t + phase) * 0.5
              currentMesh.position.y = originalPosition.y + Math.cos(t + phase) * 0.5
              currentMesh.position.z = originalPosition.z + Math.sin(t * 0.5 + phase) * 0.3
              break

            case 'spiral':
              // Spiral motion animation - reset vertices to original positions first
              if (geometry && originalPositions && currentMesh === solidMesh) {
                const positions = geometry.attributes.position.array
                for (let i = 0; i < positions.length; i++) {
                  positions[i] = originalPositions[i]
                }
                geometry.attributes.position.needsUpdate = true
                
                // Also reset wireframe geometry to match original positions
                if (centerLines && centerLines.geometry && geometry.type !== 'TetrahedronGeometry') {
                  // Rebuild spiral wireframe for non-tetrahedron geometries
                  const edgesGeometry = new THREE.EdgesGeometry(geometry)
                  const edgeVertices = edgesGeometry.attributes.position.array
                  
                  const centerLinesGeometry = centerLines.geometry
                  const centerLinesPositions = []
                  
                  // Recreate spiral paths from center to original edge points
                  for (let j = 0; j < edgeVertices.length; j += 12) {
                    const endX = edgeVertices[j + 3]
                    const endY = edgeVertices[j + 4]
                    const endZ = edgeVertices[j + 5]
                    
                    const steps = 8
                    for (let step = 0; step < steps; step++) {
                      const t1 = step / steps
                      const t2 = (step + 1) / steps
                      
                      const radius1 = t1 * 0.8
                      const radius2 = t2 * 0.8
                      const angle1 = t1 * Math.PI * 2
                      const angle2 = t2 * Math.PI * 2
                      
                      const x1 = Math.cos(angle1) * radius1 * (endX / Math.sqrt(endX*endX + endY*endY + endZ*endZ))
                      const y1 = Math.sin(angle1) * radius1 * (endY / Math.sqrt(endX*endX + endY*endY + endZ*endZ)) + t1 * endY
                      const z1 = t1 * endZ
                      
                      const x2 = Math.cos(angle2) * radius2 * (endX / Math.sqrt(endX*endX + endY*endY + endZ*endZ))
                      const y2 = Math.sin(angle2) * radius2 * (endY / Math.sqrt(endX*endX + endY*endY + endZ*endZ)) + t2 * endY
                      const z2 = t2 * endZ
                      
                      centerLinesPositions.push(x1, y1, z1, x2, y2, z2)
                    }
                  }
                  
                  if (centerLinesPositions.length > 0) {
                    centerLinesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(centerLinesPositions, 3))
                  }
                }
              }
              
              const spiralRadius = 2 + Math.sin(t + phase) * 1
              const spiralAngle = t + phase + index * 0.5
              currentMesh.position.x = Math.cos(spiralAngle) * spiralRadius
              currentMesh.position.y = Math.sin(t * 2 + phase) * 2
              currentMesh.position.z = Math.sin(spiralAngle) * spiralRadius
              currentMesh.rotation.x = spiralAngle
              currentMesh.rotation.y = spiralAngle * 0.7
              break

            case 'chaos':
              // Chaotic random movement - reset vertices to original positions first
              if (geometry && originalPositions && currentMesh === solidMesh) {
                const positions = geometry.attributes.position.array
                for (let i = 0; i < positions.length; i++) {
                  positions[i] = originalPositions[i]
                }
                geometry.attributes.position.needsUpdate = true
                
                // Also reset wireframe geometry to match original positions
                if (centerLines && centerLines.geometry && geometry.type !== 'TetrahedronGeometry') {
                  // Rebuild spiral wireframe for non-tetrahedron geometries
                  const edgesGeometry = new THREE.EdgesGeometry(geometry)
                  const edgeVertices = edgesGeometry.attributes.position.array
                  
                  const centerLinesGeometry = centerLines.geometry
                  const centerLinesPositions = []
                  
                  // Recreate spiral paths from center to original edge points
                  for (let j = 0; j < edgeVertices.length; j += 12) {
                    const endX = edgeVertices[j + 3]
                    const endY = edgeVertices[j + 4]
                    const endZ = edgeVertices[j + 5]
                    
                    const steps = 8
                    for (let step = 0; step < steps; step++) {
                      const t1 = step / steps
                      const t2 = (step + 1) / steps
                      
                      const radius1 = t1 * 0.8
                      const radius2 = t2 * 0.8
                      const angle1 = t1 * Math.PI * 2
                      const angle2 = t2 * Math.PI * 2
                      
                      const x1 = Math.cos(angle1) * radius1 * (endX / Math.sqrt(endX*endX + endY*endY + endZ*endZ))
                      const y1 = Math.sin(angle1) * radius1 * (endY / Math.sqrt(endX*endX + endY*endY + endZ*endZ)) + t1 * endY
                      const z1 = t1 * endZ
                      
                      const x2 = Math.cos(angle2) * radius2 * (endX / Math.sqrt(endX*endX + endY*endY + endZ*endZ))
                      const y2 = Math.sin(angle2) * radius2 * (endY / Math.sqrt(endX*endX + endY*endY + endZ*endZ)) + t2 * endY
                      const z2 = t2 * endZ
                      
                      centerLinesPositions.push(x1, y1, z1, x2, y2, z2)
                    }
                  }
                  
                  if (centerLinesPositions.length > 0) {
                    centerLinesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(centerLinesPositions, 3))
                  }
                }
              }
              
              currentMesh.position.x = originalPosition.x + Math.sin(t * 3 + phase) * 2
              currentMesh.position.y = originalPosition.y + Math.cos(t * 2 + phase) * 2
              currentMesh.position.z = originalPosition.z + Math.sin(t * 1.5 + phase) * 2
              currentMesh.rotation.x = t * 2 + phase
              currentMesh.rotation.y = t * 1.5 + phase
              currentMesh.rotation.z = t * 2.5 + phase
              break

            case 'dna':
              // DNA Helix: Complex vertex morphing + rotation
              if (geometry && originalPositions) {
                const positions = geometry.attributes.position.array
                for (let i = 0; i < positions.length; i += 3) {
                  const x = originalPositions[i]
                  const y = originalPositions[i + 1]
                  const z = originalPositions[i + 2]
                  
                  const radius = Math.sqrt(x * x + z * z)
                  const angle = Math.atan2(z, x) + t * 0.5 + y * 0.3
                  
                  const helixRadius = radius + Math.sin(t * 2 + y * 2 + phase) * 0.2
                  positions[i] = Math.cos(angle) * helixRadius
                  positions[i + 1] = y + Math.sin(t * 1.5 + angle + phase) * 0.1
                  positions[i + 2] = Math.sin(angle) * helixRadius
                }
                geometry.attributes.position.needsUpdate = true // Tell Three.js to update vertices
                
                // UPDATE INTRICATE WIREFRAME TO FOLLOW MORPHED SURFACE - DNA
                if (currentMesh === solidMesh && centerLines && curvedLines) {
                  if (geometry.type === 'TetrahedronGeometry') {
                    // TETRAHEDRON: Update hyper-tetrahedron wireframes during DNA morphing
                    
                    // Update inner tetrahedron edges (red lines)
                    const centerLinesGeom = centerLines.geometry
                    if (centerLinesGeom && centerLinesGeom.attributes.position) {
                      const centerLinesPos = centerLinesGeom.attributes.position.array
                      
                      // Get current morphed vertices
                      const vertices = []
                      for (let v = 0; v < 4; v++) {
                        vertices.push([
                          positions[v * 3],
                          positions[v * 3 + 1], 
                          positions[v * 3 + 2]
                        ])
                      }
                      
                      // Update inner tetrahedron vertices (scaled 0.5x)
                      const innerVertices = vertices.map(vertex => [
                        vertex[0] * 0.5,
                        vertex[1] * 0.5,
                        vertex[2] * 0.5
                      ])
                      
                      // Update the 6 inner tetrahedron edges
                      const edges = [[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]]
                      edges.forEach(([i, j], edgeIndex) => {
                        const baseIndex = edgeIndex * 6
                        centerLinesPos[baseIndex] = innerVertices[i][0]
                        centerLinesPos[baseIndex + 1] = innerVertices[i][1]
                        centerLinesPos[baseIndex + 2] = innerVertices[i][2]
                        centerLinesPos[baseIndex + 3] = innerVertices[j][0]
                        centerLinesPos[baseIndex + 4] = innerVertices[j][1]
                        centerLinesPos[baseIndex + 5] = innerVertices[j][2]
                      })
                      
                      centerLinesGeom.attributes.position.needsUpdate = true
                    }
                    
                    // Update vertex connections (green lines)
                    const curvedLinesGeom = curvedLines.geometry
                    if (curvedLinesGeom && curvedLinesGeom.attributes.position) {
                      const curvedLinesPos = curvedLinesGeom.attributes.position.array
                      
                      // Update the 4 vertex-to-vertex connections
                      for (let v = 0; v < 4; v++) {
                        const baseIndex = v * 6
                        const innerScale = 0.5
                        
                        // Inner vertex
                        curvedLinesPos[baseIndex] = positions[v * 3] * innerScale
                        curvedLinesPos[baseIndex + 1] = positions[v * 3 + 1] * innerScale
                        curvedLinesPos[baseIndex + 2] = positions[v * 3 + 2] * innerScale
                        
                        // Outer vertex
                        curvedLinesPos[baseIndex + 3] = positions[v * 3]
                        curvedLinesPos[baseIndex + 4] = positions[v * 3 + 1]
                        curvedLinesPos[baseIndex + 5] = positions[v * 3 + 2]
                      }
                      
                      curvedLinesGeom.attributes.position.needsUpdate = true
                    }
                  } else if (geometry.type === 'OctahedronGeometry') {
                    // OCTAHEDRON: Update hyper-octahedron wireframes during DNA morphing
                    
                    // Update inner octahedron edges (red lines)
                    const centerLinesGeom = centerLines.geometry
                    if (centerLinesGeom && centerLinesGeom.attributes.position) {
                      const centerLinesPos = centerLinesGeom.attributes.position.array
                      
                      // Get current morphed vertices (octahedron has 6 vertices)
                      const vertices = []
                      for (let v = 0; v < 6; v++) {
                        vertices.push([
                          positions[v * 3],
                          positions[v * 3 + 1], 
                          positions[v * 3 + 2]
                        ])
                      }
                      
                      // Update inner octahedron vertices (scaled 0.5x)
                      const innerVertices = vertices.map(vertex => [
                        vertex[0] * 0.5,
                        vertex[1] * 0.5,
                        vertex[2] * 0.5
                      ])
                      
                      // Update the 12 inner octahedron edges
                      const edges = [
                        [0,2],[0,3],[0,4],[0,5],  // Top vertex to equatorial vertices
                        [1,2],[1,3],[1,4],[1,5],  // Bottom vertex to equatorial vertices
                        [2,3],[3,4],[4,5],[5,2]   // Equatorial edge loop
                      ]
                      edges.forEach(([i, j], edgeIndex) => {
                        const baseIndex = edgeIndex * 6
                        centerLinesPos[baseIndex] = innerVertices[i][0]
                        centerLinesPos[baseIndex + 1] = innerVertices[i][1]
                        centerLinesPos[baseIndex + 2] = innerVertices[i][2]
                        centerLinesPos[baseIndex + 3] = innerVertices[j][0]
                        centerLinesPos[baseIndex + 4] = innerVertices[j][1]
                        centerLinesPos[baseIndex + 5] = innerVertices[j][2]
                      })
                      
                      centerLinesGeom.attributes.position.needsUpdate = true
                    }
                    
                    // Update vertex connections (green lines)
                    const curvedLinesGeom = curvedLines.geometry
                    if (curvedLinesGeom && curvedLinesGeom.attributes.position) {
                      const curvedLinesPos = curvedLinesGeom.attributes.position.array
                      
                      // Update the 6 vertex-to-vertex connections
                      for (let v = 0; v < 6; v++) {
                        const baseIndex = v * 6
                        const innerScale = 0.5
                        
                        // Inner vertex
                        curvedLinesPos[baseIndex] = positions[v * 3] * innerScale
                        curvedLinesPos[baseIndex + 1] = positions[v * 3 + 1] * innerScale
                        curvedLinesPos[baseIndex + 2] = positions[v * 3 + 2] * innerScale
                        
                        // Outer vertex
                        curvedLinesPos[baseIndex + 3] = positions[v * 3]
                        curvedLinesPos[baseIndex + 4] = positions[v * 3 + 1]
                        curvedLinesPos[baseIndex + 5] = positions[v * 3 + 2]
                      }
                      
                      curvedLinesGeom.attributes.position.needsUpdate = true
                    }
                  }
                }
              }
              
              currentMesh.rotation.y = t * 0.3 + phase
              currentMesh.rotation.x = Math.sin(t * 0.2) * 0.2
              currentMesh.position.copy(originalPosition)
              break

            case 'liquid':
              // Liquid Metal: Flowing waves across surface
              if (geometry && originalPositions) {
                const positions = geometry.attributes.position.array
                for (let i = 0; i < positions.length; i += 3) {
                  const x = originalPositions[i]
                  const y = originalPositions[i + 1]
                  const z = originalPositions[i + 2]
                  
                  // Multiple wave layers for liquid effect
                  const wave1 = Math.sin(t * 2 + x * 3 + phase) * 0.15
                  const wave2 = Math.cos(t * 1.5 + y * 4 + phase) * 0.1
                  const wave3 = Math.sin(t * 3 + z * 2 + phase) * 0.08
                  
                  positions[i] = x + wave1 + Math.sin(t + y * 2) * 0.05
                  positions[i + 1] = y + wave2 + Math.cos(t * 1.2 + x * 2) * 0.05
                  positions[i + 2] = z + wave3 + Math.sin(t * 0.8 + z * 3) * 0.05
                }
                
                // UPDATE INTRICATE WIREFRAME TO FOLLOW MORPHED SURFACE - BEFORE needsUpdate
                if (currentMesh === solidMesh && centerLines && curvedLines) {
                  if (geometry.type === 'TetrahedronGeometry') {
                    // TETRAHEDRON: Update hyper-tetrahedron wireframes during morphing
                    
                    // Update inner tetrahedron edges (red lines)
                    const centerLinesGeom = centerLines.geometry
                    if (centerLinesGeom && centerLinesGeom.attributes.position) {
                      const centerLinesPos = centerLinesGeom.attributes.position.array
                      
                      // Get current morphed vertices using same approach as wireframe creation
                      const vertices = []
                      for (let v = 0; v < 4; v++) {
                        vertices.push([
                          positions[v * 3],
                          positions[v * 3 + 1], 
                          positions[v * 3 + 2]
                        ])
                      }
                      
                      // Calculate the center of the morphed tetrahedron
                      const center = [0, 0, 0]
                      for (let v = 0; v < 4; v++) {
                        center[0] += vertices[v][0]
                        center[1] += vertices[v][1]
                        center[2] += vertices[v][2]
                      }
                      center[0] /= 4
                      center[1] /= 4
                      center[2] /= 4
                      
                      // Update inner tetrahedron vertices (scaled 0.5x from center, not origin)
                      const innerVertices = vertices.map(vertex => [
                        center[0] + (vertex[0] - center[0]) * 0.5,
                        center[1] + (vertex[1] - center[1]) * 0.5,
                        center[2] + (vertex[2] - center[2]) * 0.5
                      ])
                      
                      // Update the 6 inner tetrahedron edges
                      const edges = [[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]]
                      edges.forEach(([i, j], edgeIndex) => {
                        const baseIndex = edgeIndex * 6
                        centerLinesPos[baseIndex] = innerVertices[i][0]
                        centerLinesPos[baseIndex + 1] = innerVertices[i][1]
                        centerLinesPos[baseIndex + 2] = innerVertices[i][2]
                        centerLinesPos[baseIndex + 3] = innerVertices[j][0]
                        centerLinesPos[baseIndex + 4] = innerVertices[j][1]
                        centerLinesPos[baseIndex + 5] = innerVertices[j][2]
                      })
                      
                      centerLinesGeom.attributes.position.needsUpdate = true
                    }
                    
                    // Update vertex connections (green lines)
                    const curvedLinesGeom = curvedLines.geometry
                    if (curvedLinesGeom && curvedLinesGeom.attributes.position) {
                      const curvedLinesPos = curvedLinesGeom.attributes.position.array
                      
                      // Update the 4 vertex-to-vertex connections
                      for (let v = 0; v < 4; v++) {
                        const baseIndex = v * 6
                        const innerScale = 0.5
                        
                        // Inner vertex
                        curvedLinesPos[baseIndex] = positions[v * 3] * innerScale
                        curvedLinesPos[baseIndex + 1] = positions[v * 3 + 1] * innerScale
                        curvedLinesPos[baseIndex + 2] = positions[v * 3 + 2] * innerScale
                        
                        // Outer vertex
                        curvedLinesPos[baseIndex + 3] = positions[v * 3]
                        curvedLinesPos[baseIndex + 4] = positions[v * 3 + 1]
                        curvedLinesPos[baseIndex + 5] = positions[v * 3 + 2]
                      }
                      
                      curvedLinesGeom.attributes.position.needsUpdate = true
                    }
                  } else if (geometry.type === 'OctahedronGeometry') {
                    // OCTAHEDRON: Update hyper-octahedron wireframes during morphing
                    
                    // Update inner octahedron edges (red lines)
                    const centerLinesGeom = centerLines.geometry
                    if (centerLinesGeom && centerLinesGeom.attributes.position) {
                      const centerLinesPos = centerLinesGeom.attributes.position.array
                      
                      // Get current morphed vertices (octahedron has 6 vertices)
                      const vertices = []
                      for (let v = 0; v < 6; v++) {
                        vertices.push([
                          positions[v * 3],
                          positions[v * 3 + 1], 
                          positions[v * 3 + 2]
                        ])
                      }
                      
                      // Update inner octahedron vertices (scaled 0.5x)
                      const innerVertices = vertices.map(vertex => [
                        vertex[0] * 0.5,
                        vertex[1] * 0.5,
                        vertex[2] * 0.5
                      ])
                      
                      // Update the 12 inner octahedron edges
                      const edges = [
                        [0,2],[0,3],[0,4],[0,5],  // Top vertex to equatorial vertices
                        [1,2],[1,3],[1,4],[1,5],  // Bottom vertex to equatorial vertices
                        [2,3],[3,4],[4,5],[5,2]   // Equatorial edge loop
                      ]
                      edges.forEach(([i, j], edgeIndex) => {
                        const baseIndex = edgeIndex * 6
                        centerLinesPos[baseIndex] = innerVertices[i][0]
                        centerLinesPos[baseIndex + 1] = innerVertices[i][1]
                        centerLinesPos[baseIndex + 2] = innerVertices[i][2]
                        centerLinesPos[baseIndex + 3] = innerVertices[j][0]
                        centerLinesPos[baseIndex + 4] = innerVertices[j][1]
                        centerLinesPos[baseIndex + 5] = innerVertices[j][2]
                      })
                      
                      centerLinesGeom.attributes.position.needsUpdate = true
                    }
                    
                    // Update vertex connections (green lines)
                    const curvedLinesGeom = curvedLines.geometry
                    if (curvedLinesGeom && curvedLinesGeom.attributes.position) {
                      const curvedLinesPos = curvedLinesGeom.attributes.position.array
                      
                      // Update the 6 vertex-to-vertex connections
                      for (let v = 0; v < 6; v++) {
                        const baseIndex = v * 6
                        const innerScale = 0.5
                        
                        // Inner vertex
                        curvedLinesPos[baseIndex] = positions[v * 3] * innerScale
                        curvedLinesPos[baseIndex + 1] = positions[v * 3 + 1] * innerScale
                        curvedLinesPos[baseIndex + 2] = positions[v * 3 + 2] * innerScale
                        
                        // Outer vertex
                        curvedLinesPos[baseIndex + 3] = positions[v * 3]
                        curvedLinesPos[baseIndex + 4] = positions[v * 3 + 1]
                        curvedLinesPos[baseIndex + 5] = positions[v * 3 + 2]
                      }
                      
                      curvedLinesGeom.attributes.position.needsUpdate = true
                    }
                  } else {
                    // OTHER GEOMETRIES: Use existing update logic
                    // Update center lines to follow morphed vertices
                    const centerLinesGeom = centerLines.geometry
                    if (centerLinesGeom && centerLinesGeom.attributes.position) {
                      const centerLinesPos = centerLinesGeom.attributes.position.array
                      let lineIndex = 0
                      
                      // Update every other point (the vertex endpoints) to match morphed surface
                    for (let i = 1; i < centerLinesPos.length; i += 6) { // Every second point (vertex endpoints)
                      const vertexIndex = lineIndex * 9 // Match the original vertex stepping
                      if (vertexIndex < positions.length) {
                        centerLinesPos[i] = positions[vertexIndex]     // X
                        centerLinesPos[i + 1] = positions[vertexIndex + 1] // Y  
                        centerLinesPos[i + 2] = positions[vertexIndex + 2] // Z
                      }
                      lineIndex++
                    }
                    centerLinesGeom.attributes.position.needsUpdate = true
                  }
                  
                  // Update curved lines to follow morphed vertices
                  const curvedLinesGeom = curvedLines.geometry
                  if (curvedLinesGeom && curvedLinesGeom.attributes.position) {
                    // Update existing curved line endpoints smoothly every frame with validation
                    const curvedLinesPos = curvedLinesGeom.attributes.position.array
                    
                    // Update each line segment, but validate the connection is still appropriate
                    for (let i = 0; i < curvedLinesPos.length; i += 6) {
                      // Get the vertex indices for this line
                      const vertex1Index = Math.floor((i / 6) * 30)
                      const vertex2Index = vertex1Index + 30
                      
                      if (vertex1Index < positions.length && vertex2Index < positions.length) {
                        const x1 = positions[vertex1Index]
                        const y1 = positions[vertex1Index + 1]
                        const z1 = positions[vertex1Index + 2]
                        const x2 = positions[vertex2Index]
                        const y2 = positions[vertex2Index + 1]
                        const z2 = positions[vertex2Index + 2]
                        
                        // Check if this connection is still valid
                        const distance = Math.sqrt((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1) + (z2-z1)*(z2-z1))
                        let shouldShow = distance < 0.8 && distance > 0.1
                        
                        // For torus, check center distance to avoid cross-hole connections
                        if (geometry.type === 'TorusKnotGeometry' && shouldShow) {
                          const centerDistance1 = Math.sqrt(x1*x1 + z1*z1)
                          const centerDistance2 = Math.sqrt(x2*x2 + z2*z2)
                          const centerDistanceDiff = Math.abs(centerDistance1 - centerDistance2)
                          shouldShow = centerDistanceDiff < 0.5
                        }
                        
                        if (shouldShow) {
                          // Update the line endpoints
                          curvedLinesPos[i] = x1
                          curvedLinesPos[i + 1] = y1
                          curvedLinesPos[i + 2] = z1
                          curvedLinesPos[i + 3] = x2
                          curvedLinesPos[i + 4] = y2
                          curvedLinesPos[i + 5] = z2
                        } else {
                          // Hide invalid connections by collapsing them to a single point
                          curvedLinesPos[i] = 0
                          curvedLinesPos[i + 1] = 0
                          curvedLinesPos[i + 2] = 0
                          curvedLinesPos[i + 3] = 0
                          curvedLinesPos[i + 4] = 0
                          curvedLinesPos[i + 5] = 0
                        }
                      }
                    }
                    curvedLinesGeom.attributes.position.needsUpdate = true
                  }
                  } // Close the else block for non-tetrahedron geometries
                } // Close the wireframe update conditional
                
                // Update main geometry AFTER wireframe updates for perfect sync
                geometry.attributes.position.needsUpdate = true
              } // Close the liquid animation conditional
              
              currentMesh.scale.setScalar(1 + 0.2 * Math.sin(t * 1.5 + phase))
              currentMesh.rotation.x += Math.sin(t * 0.3) * 0.01
              currentMesh.rotation.y += Math.cos(t * 0.4) * 0.01
              currentMesh.position.copy(originalPosition)
              break

            case 'magnetic':
              // Magnetic Field: Vertices attracted/repelled by moving magnetic points
              if (geometry && originalPositions && magneticPoints) {
                const positions = geometry.attributes.position.array
                
                // Move magnetic points around
                magneticPoints.forEach((point, pIndex) => {
                  point.x = Math.sin(t * 0.5 + pIndex * 2) * 3
                  point.y = Math.cos(t * 0.7 + pIndex * 2) * 2
                  point.z = Math.sin(t * 0.3 + pIndex * 3) * 3
                })
                
                for (let i = 0; i < positions.length; i += 3) {
                  const x = originalPositions[i]
                  const y = originalPositions[i + 1]
                  const z = originalPositions[i + 2]
                  
                  let totalForceX = 0, totalForceY = 0, totalForceZ = 0
                  
                  // Calculate magnetic forces from each point
                  magneticPoints.forEach(point => {
                    const dx = x - point.x
                    const dy = y - point.y
                    const dz = z - point.z
                    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz) + 0.1
                    const force = point.strength / (distance * distance)
                    
                    const direction = Math.sin(t + point.x + point.y) > 0 ? -1 : 1
                    
                    totalForceX += (dx / distance) * force * direction
                    totalForceY += (dy / distance) * force * direction
                    totalForceZ += (dz / distance) * force * direction
                  })
                  
                  positions[i] = x + totalForceX * 0.3
                  positions[i + 1] = y + totalForceY * 0.3
                  positions[i + 2] = z + totalForceZ * 0.3
                }
                geometry.attributes.position.needsUpdate = true
                
                // UPDATE INTRICATE WIREFRAME TO FOLLOW MORPHED SURFACE - MAGNETIC
                if (currentMesh === solidMesh && centerLines && curvedLines) {
                  if (geometry.type === 'TetrahedronGeometry') {
                    // TETRAHEDRON: Update hyper-tetrahedron wireframes during magnetic morphing
                    
                    // Update inner tetrahedron edges (red lines)
                    const centerLinesGeom = centerLines.geometry
                    if (centerLinesGeom && centerLinesGeom.attributes.position) {
                      const centerLinesPos = centerLinesGeom.attributes.position.array
                      
                      // Get current morphed vertices
                      const vertices = []
                      for (let v = 0; v < 4; v++) {
                        vertices.push([
                          positions[v * 3],
                          positions[v * 3 + 1], 
                          positions[v * 3 + 2]
                        ])
                      }
                      
                      // Update inner tetrahedron vertices (scaled 0.5x)
                      const innerVertices = vertices.map(vertex => [
                        vertex[0] * 0.5,
                        vertex[1] * 0.5,
                        vertex[2] * 0.5
                      ])
                      
                      // Update the 6 inner tetrahedron edges
                      const edges = [[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]]
                      edges.forEach(([i, j], edgeIndex) => {
                        const baseIndex = edgeIndex * 6
                        centerLinesPos[baseIndex] = innerVertices[i][0]
                        centerLinesPos[baseIndex + 1] = innerVertices[i][1]
                        centerLinesPos[baseIndex + 2] = innerVertices[i][2]
                        centerLinesPos[baseIndex + 3] = innerVertices[j][0]
                        centerLinesPos[baseIndex + 4] = innerVertices[j][1]
                        centerLinesPos[baseIndex + 5] = innerVertices[j][2]
                      })
                      
                      centerLinesGeom.attributes.position.needsUpdate = true
                    }
                    
                    // Update vertex connections (green lines)
                    const curvedLinesGeom = curvedLines.geometry
                    if (curvedLinesGeom && curvedLinesGeom.attributes.position) {
                      const curvedLinesPos = curvedLinesGeom.attributes.position.array
                      
                      // Update the 4 vertex-to-vertex connections
                      for (let v = 0; v < 4; v++) {
                        const baseIndex = v * 6
                        const innerScale = 0.5
                        
                        // Inner vertex
                        curvedLinesPos[baseIndex] = positions[v * 3] * innerScale
                        curvedLinesPos[baseIndex + 1] = positions[v * 3 + 1] * innerScale
                        curvedLinesPos[baseIndex + 2] = positions[v * 3 + 2] * innerScale
                        
                        // Outer vertex
                        curvedLinesPos[baseIndex + 3] = positions[v * 3]
                        curvedLinesPos[baseIndex + 4] = positions[v * 3 + 1]
                        curvedLinesPos[baseIndex + 5] = positions[v * 3 + 2]
                      }
                      
                      curvedLinesGeom.attributes.position.needsUpdate = true
                    }
                  } else if (geometry.type === 'OctahedronGeometry') {
                    // OCTAHEDRON: Update hyper-octahedron wireframes during magnetic morphing
                    
                    // Update inner octahedron edges (red lines)
                    const centerLinesGeom = centerLines.geometry
                    if (centerLinesGeom && centerLinesGeom.attributes.position) {
                      const centerLinesPos = centerLinesGeom.attributes.position.array
                      
                      // Get current morphed vertices (octahedron has 6 vertices)
                      const vertices = []
                      for (let v = 0; v < 6; v++) {
                        vertices.push([
                          positions[v * 3],
                          positions[v * 3 + 1], 
                          positions[v * 3 + 2]
                        ])
                      }
                      
                      // Update inner octahedron vertices (scaled 0.5x)
                      const innerVertices = vertices.map(vertex => [
                        vertex[0] * 0.5,
                        vertex[1] * 0.5,
                        vertex[2] * 0.5
                      ])
                      
                      // Update the 12 inner octahedron edges
                      const edges = [
                        [0,2],[0,3],[0,4],[0,5],  // Top vertex to equatorial vertices
                        [1,2],[1,3],[1,4],[1,5],  // Bottom vertex to equatorial vertices
                        [2,3],[3,4],[4,5],[5,2]   // Equatorial edge loop
                      ]
                      edges.forEach(([i, j], edgeIndex) => {
                        const baseIndex = edgeIndex * 6
                        centerLinesPos[baseIndex] = innerVertices[i][0]
                        centerLinesPos[baseIndex + 1] = innerVertices[i][1]
                        centerLinesPos[baseIndex + 2] = innerVertices[i][2]
                        centerLinesPos[baseIndex + 3] = innerVertices[j][0]
                        centerLinesPos[baseIndex + 4] = innerVertices[j][1]
                        centerLinesPos[baseIndex + 5] = innerVertices[j][2]
                      })
                      
                      centerLinesGeom.attributes.position.needsUpdate = true
                    }
                    
                    // Update vertex connections (green lines)
                    const curvedLinesGeom = curvedLines.geometry
                    if (curvedLinesGeom && curvedLinesGeom.attributes.position) {
                      const curvedLinesPos = curvedLinesGeom.attributes.position.array
                      
                      // Update the 6 vertex-to-vertex connections
                      for (let v = 0; v < 6; v++) {
                        const baseIndex = v * 6
                        const innerScale = 0.5
                        
                        // Inner vertex
                        curvedLinesPos[baseIndex] = positions[v * 3] * innerScale
                        curvedLinesPos[baseIndex + 1] = positions[v * 3 + 1] * innerScale
                        curvedLinesPos[baseIndex + 2] = positions[v * 3 + 2] * innerScale
                        
                        // Outer vertex
                        curvedLinesPos[baseIndex + 3] = positions[v * 3]
                        curvedLinesPos[baseIndex + 4] = positions[v * 3 + 1]
                        curvedLinesPos[baseIndex + 5] = positions[v * 3 + 2]
                      }
                      
                      curvedLinesGeom.attributes.position.needsUpdate = true
                    }
                  }
                }
              }
              
              currentMesh.rotation.x += 0.005
              currentMesh.rotation.y += 0.007
              currentMesh.position.copy(originalPosition)
              break
          }
        }) // Close meshesToAnimate.forEach
      }) // Close objectsRef.current.forEach

      // DYNAMIC CAMERA MOVEMENT for certain views
      if (cameraView === 'orbit') {
        const orbitRadius = 8
        camera.position.x = Math.cos(t * 0.3) * orbitRadius
        camera.position.z = Math.sin(t * 0.3) * orbitRadius
        camera.lookAt(0, 0, 0)
      } else if (cameraView === 'cinematic') {
        camera.position.x = -3 + Math.sin(t * 0.1) * 1
        camera.position.y = 2 + Math.cos(t * 0.15) * 0.5
        camera.lookAt(0, 0, 0)
      }

      // RENDER THE FRAME
      rendererRef.current.render(scene, camera)
    }

    animate() // Start the animation loop

    // CLEANUP - Cancel animation when effect re-runs or component unmounts
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
    }
  }, [animationStyle, cameraView]) // Run when animationStyle or cameraView props from App.jsx change

  // ===============================================
  // MATERIAL PROPERTY UPDATERS - RESPOND TO MATERIAL PROPS
  // ===============================================
  // These useEffects listen for changes to specific material properties from App.jsx
  // and update the existing 3D objects without recreating them entirely

  // SHININESS UPDATER - Responds to shininess prop changes
  useEffect(() => {
    console.log('Updating shininess to:', shininess) // Debug: shows when App.jsx changes shininess
    objectsRef.current.forEach(({ material, wireframeMaterial }, index) => {
      // Update solid material
      if (material) {
        material.shininess = shininess          // Apply new shininess value from App.jsx
        material.needsUpdate = true             // Tell Three.js to re-render material
        console.log(`Updated material ${index} shininess to:`, shininess)
      }
      // Update wireframe material
      if (wireframeMaterial) {
        wireframeMaterial.shininess = shininess // Apply to wireframe material too
        wireframeMaterial.needsUpdate = true
        console.log(`Updated wireframe material ${index} shininess to:`, shininess)
      }
    })
  }, [shininess]) // Run when shininess prop from App.jsx changes

  // SPECULAR COLOR UPDATER - Responds to specularColor prop changes
  useEffect(() => {
    console.log('Updating specular color to:', specularColor) // Debug: shows color changes
    console.log('Number of objects:', objectsRef.current.length)
    
    if (objectsRef.current.length === 0) {
      console.log('No objects available for specular update')
      return
    }
    
    // Convert hex color string from App.jsx (like "#ff0000") to Three.js color number
    const convertedColor = parseInt(specularColor.replace('#', ''), 16)
    console.log('Converted color value:', convertedColor)
    
    objectsRef.current.forEach(({ material, wireframeMaterial }, index) => {
      // Update solid material
      if (material) {
        console.log(`Updating material ${index} specular color`)
        material.specular.setHex(convertedColor) // Apply new specular color from App.jsx
        material.needsUpdate = true              // Tell Three.js to re-render material
      } else {
        console.log(`Material ${index} is null`)
      }
      // Update wireframe material
      if (wireframeMaterial) {
        console.log(`Updating wireframe material ${index} specular color`)
        wireframeMaterial.specular.setHex(convertedColor) // Apply to wireframe material too
        wireframeMaterial.needsUpdate = true
      }
    })
  }, [specularColor]) // Run when specularColor prop from App.jsx changes

  // SPECULAR INTENSITY UPDATER - Responds to specularIntensity prop changes
  useEffect(() => {
    console.log('Updating specular intensity to:', specularIntensity)
    
    objectsRef.current.forEach(({ material, wireframeMaterial }, index) => {
      // Update solid material
      if (material) {
        material.reflectivity = specularIntensity // Apply new intensity from App.jsx
        material.needsUpdate = true               // Tell Three.js to re-render material
        console.log(`Updated material ${index} specular intensity to:`, specularIntensity)
      } else {
        console.log(`Material ${index} is null`)
      }
      // Update wireframe material
      if (wireframeMaterial) {
        wireframeMaterial.reflectivity = specularIntensity // Apply to wireframe material too
        wireframeMaterial.needsUpdate = true
        console.log(`Updated wireframe material ${index} specular intensity to:`, specularIntensity)
      }
    })
  }, [specularIntensity]) // Run when specularIntensity prop from App.jsx changes

  // BASE COLOR UPDATER - Responds to baseColor prop changes
  useEffect(() => {
    console.log('Updating base color to:', baseColor)
    // Convert hex color string from App.jsx to Three.js color number
    const convertedColor = parseInt(baseColor.replace('#', ''), 16)
    console.log('Converted base color value:', convertedColor)
    
    objectsRef.current.forEach(({ material, wireframeMaterial }, index) => {
      // Update solid material
      if (material) {
        material.color.setHex(convertedColor) // Apply new base color from App.jsx
        material.needsUpdate = true           // Tell Three.js to re-render material
        console.log(`Updated material ${index} base color`)
      }
      // Update wireframe material
      if (wireframeMaterial) {
        wireframeMaterial.color.setHex(convertedColor) // Apply to wireframe material too
        wireframeMaterial.needsUpdate = true
        console.log(`Updated wireframe material ${index} base color`)
      }
    })
  }, [baseColor]) // Run when baseColor prop from App.jsx changes

  // WIREFRAME INTENSITY UPDATER - Responds to wireframeIntensity prop changes
  useEffect(() => {
    const intensity = wireframeIntensity / 100 // Convert 0-100 range to 0-1 range
    
    console.log(`Updating wireframe intensity to ${wireframeIntensity}% (${intensity}) for ${objectsRef.current.length} objects`)
    
    objectsRef.current.forEach(({ material, wireframeMaterial, centerLinesMaterial, curvedLinesMaterial }, index) => {
      console.log(`Updating object ${index}:`, {
        hasMaterial: !!material,
        hasWireframeMaterial: !!wireframeMaterial,
        hasCenterLinesMaterial: !!centerLinesMaterial,
        hasCurvedLinesMaterial: !!curvedLinesMaterial
      })
      
      if (material && wireframeMaterial) {
        // DUAL-MESH BLENDING: Smooth transition between solid and wireframe
        if (intensity === 0) {
          // Full solid: solid mesh visible, wireframe mesh invisible
          material.transparent = false
          material.opacity = 1
          wireframeMaterial.transparent = true
          wireframeMaterial.opacity = 0
        } else if (intensity === 1) {
          // Full wireframe: solid mesh invisible, wireframe mesh visible
          material.transparent = true
          material.opacity = 0
          wireframeMaterial.transparent = true
          wireframeMaterial.opacity = 1
        } else {
          // Blended: both meshes partially visible
          material.transparent = true
          material.opacity = 1 - intensity  // Solid fades out as wireframe increases
          wireframeMaterial.transparent = true
          wireframeMaterial.opacity = intensity  // Wireframe fades in as intensity increases
        }
        
        // UPDATE INTRICATE WIREFRAME ELEMENTS
        if (centerLinesMaterial) {
          centerLinesMaterial.opacity = 0.8 // Keep bright red lines visible
          centerLinesMaterial.needsUpdate = true
        }
        
        if (curvedLinesMaterial) {
          curvedLinesMaterial.opacity = 0.8 // Keep bright green lines visible
          curvedLinesMaterial.needsUpdate = true
        }
        
        material.needsUpdate = true
        wireframeMaterial.needsUpdate = true
        
        console.log(`Wireframe intensity ${wireframeIntensity}%: solid opacity = ${material.opacity}, wireframe opacity = ${wireframeMaterial.opacity}`)
      } else if (material) {
        // Legacy single-mesh fallback (old wireframe behavior)
        if (intensity === 0) {
          material.wireframe = false
          material.transparent = false
          material.opacity = 1
        } else {
          material.wireframe = true
          material.transparent = true
          material.opacity = 0.3 + (intensity * 0.7)
        }
        material.needsUpdate = true
      }
    })
  }, [wireframeIntensity]) // Run when wireframeIntensity prop from App.jsx changes

  // ===============================================
  // INTRICATE WIREFRAME COLOR UPDATERS - RESPOND TO INTRICATE WIREFRAME PROPS
  // ===============================================
  // These useEffects update intricate wireframe colors when App.jsx changes the color controls

  // INTRICATE WIREFRAME SPIRAL COLOR UPDATER - Responds to spiral color prop changes
  useEffect(() => {
    console.log('Updating intricate wireframe spiral color to:', intricateWireframeSpiralColor)
    const convertedColor = new THREE.Color(intricateWireframeSpiralColor)
    
    objectsRef.current.forEach(({ centerLinesMaterial }, index) => {
      if (centerLinesMaterial) {
        centerLinesMaterial.color.copy(convertedColor)
        centerLinesMaterial.needsUpdate = true
        console.log(`Updated center lines material ${index} color`)
      }
    })
  }, [intricateWireframeSpiralColor]) // Run when spiral color prop from App.jsx changes

  // INTRICATE WIREFRAME EDGE COLOR UPDATER - Responds to edge color prop changes
  useEffect(() => {
    console.log('Updating intricate wireframe edge color to:', intricateWireframeEdgeColor)
    const convertedColor = new THREE.Color(intricateWireframeEdgeColor)
    
    objectsRef.current.forEach(({ curvedLinesMaterial }, index) => {
      if (curvedLinesMaterial) {
        curvedLinesMaterial.color.copy(convertedColor)
        curvedLinesMaterial.needsUpdate = true
        console.log(`Updated curved lines material ${index} color`)
      }
    })
  }, [intricateWireframeEdgeColor]) // Run when edge color prop from App.jsx changes

  // ===============================================
  // LIGHTING UPDATERS - RESPOND TO LIGHTING PROPS
  // ===============================================
  // These useEffects update the lights when App.jsx changes lighting properties

  // AMBIENT LIGHT UPDATER - Responds to ambient light prop changes
  useEffect(() => {
    if (ambientLightRef.current) {
      // Convert hex color from App.jsx to Three.js color number
      const convertedColor = parseInt(ambientLightColor.replace('#', ''), 16)
      ambientLightRef.current.color.setHex(convertedColor)     // Apply new color from App.jsx
      ambientLightRef.current.intensity = ambientLightIntensity // Apply new intensity from App.jsx
      console.log('Updated ambient light:', ambientLightColor, ambientLightIntensity)
    }
  }, [ambientLightColor, ambientLightIntensity]) // Run when ambient light props from App.jsx change

  // DIRECTIONAL LIGHT UPDATER - Responds to directional light prop changes
  useEffect(() => {
    if (directionalLightRef.current) {
      // Convert hex color from App.jsx to Three.js color number
      const convertedColor = parseInt(directionalLightColor.replace('#', ''), 16)
      directionalLightRef.current.color.setHex(convertedColor)        // Apply new color from App.jsx
      directionalLightRef.current.intensity = directionalLightIntensity // Apply new intensity from App.jsx
      // Position the light using X, Y, Z coordinates from App.jsx
      directionalLightRef.current.position.set(directionalLightX, directionalLightY, directionalLightZ)
      console.log('Updated directional light:', directionalLightColor, directionalLightIntensity, 'position:', directionalLightX, directionalLightY, directionalLightZ)
    }
  }, [directionalLightColor, directionalLightIntensity, directionalLightX, directionalLightY, directionalLightZ]) 
  // ↑ Run when any directional light props from App.jsx change

  // ===============================================
  // RENDER METHOD - WHAT GETS DISPLAYED IN THE DOM
  // ===============================================
  // This component renders a simple div that Three.js will attach its canvas to
  return <div ref={mountRef} className="three-scene-container" />
}

export default ThreeScene

/*
=================================================================
SUMMARY: HOW THREESCENE.JSX RECEIVES AND USES PROPS FROM APP.JSX
=================================================================

1. PROPS FLOW IN FROM APP.JSX
   - All the values (shininess, colors, counts, etc.) come from App.jsx state
   - When App.jsx state changes, this component automatically re-renders

2. USEEFFECTS LISTEN FOR SPECIFIC PROP CHANGES
   - Each useEffect has a dependency array that lists which props it cares about
   - When those specific props change, only that useEffect runs (not the whole component)

3. PROPS GET CONVERTED TO THREE.JS ACTIONS
   - shininess prop → material.shininess property
   - specularColor prop → material.specular.setHex() call
   - objectCount prop → creates that many 3D objects
   - animationStyle prop → determines which animation code runs

4. THE REACT → THREE.JS BRIDGE
   - React handles the UI state and prop flow
   - Three.js handles the 3D rendering and animation
   - useRef stores Three.js objects that persist between React re-renders
   - useEffect bridges React prop changes to Three.js object updates

5. KEY INSIGHT: SEPARATION OF CONCERNS
   - App.jsx = Data management (what the values should be)
   - Controls.jsx = User interface (how users change the values)  
   - ThreeScene.jsx = Visual rendering (how the values look in 3D)

FLOW: User interacts with Controls.jsx → Controls.jsx calls App.jsx setters → App.jsx updates state → ThreeScene.jsx receives new props → useEffects update Three.js objects → 3D scene re-renders
*/