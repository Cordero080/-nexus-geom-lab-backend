import { useEffect, useRef } from 'react'
import * as THREE from 'three'

// This component receives all props from App.jsx
function ThreeScene({ 
  shininess, specularColor, specularIntensity, baseColor, wireframeIntensity,
  cameraView, environment, objectCount, animationStyle 
}) {
  const mountRef = useRef(null)
  const sceneRef = useRef(null)
  const materialRef = useRef(null)
  const cameraRef = useRef(null)
  const rendererRef = useRef(null)
  const objectsRef = useRef([])
  const animationIdRef = useRef(null)

  useEffect(() => {
    // 1. Create a scene
    const scene = new THREE.Scene()
    sceneRef.current = scene

    // 2. Set up camera with ref
    const camera = new THREE.PerspectiveCamera(
      40,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    camera.position.set(0, 0, 6)
    cameraRef.current = camera

    // 3. Set up renderer with enhanced settings
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.setClearColor(0x000000, 1)
    rendererRef.current = renderer
    mountRef.current.appendChild(renderer.domElement)

    // 4. Lighting setup
    const ambientLight = new THREE.AmbientLight(0x202020, 0.1)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 5)
    directionalLight.position.set(1, 1, 3)
    directionalLight.castShadow = true
    scene.add(ambientLight)
    scene.add(directionalLight)

    // 5. Animation loop
    function animate() {
      animationIdRef.current = requestAnimationFrame(animate)
      
      // This will be updated by other useEffects
      renderer.render(scene, camera)
    }

    animate()

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener('resize', handleResize)

    // Cleanup function
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
  }, [])

  // Environment useEffect - Dynamic backgrounds and lighting
  useEffect(() => {
    if (!sceneRef.current) return

    const scene = sceneRef.current

    // Function to create different environments
    const createEnvironment = (envType) => {
      switch(envType) {
        case 'purple':
          // Original purple gradient
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
          scene.background = new THREE.CanvasTexture(canvas)
          break

        case 'space':
          // Northern Lights Aurora Gradient
          const spaceCanvas = document.createElement('canvas')
          const spaceCtx = spaceCanvas.getContext('2d')
          spaceCanvas.width = 1024
          spaceCanvas.height = 1024
          
          // Base dark night sky
          const baseGrad = spaceCtx.createLinearGradient(0, 0, 0, spaceCanvas.height)
          baseGrad.addColorStop(0, '#0a0f1c')    // Dark blue top
          baseGrad.addColorStop(0.3, '#1a1a2e')  // Deeper blue
          baseGrad.addColorStop(0.7, '#16213e')  // Navy blue
          baseGrad.addColorStop(1, '#0f0f23')    // Almost black bottom
          spaceCtx.fillStyle = baseGrad
          spaceCtx.fillRect(0, 0, spaceCanvas.width, spaceCanvas.height)
          
          // Aurora curtain 1 - Green-Blue (more vibrant)
          const aurora1 = spaceCtx.createLinearGradient(0, 200, 0, 600)
          aurora1.addColorStop(0, 'transparent')
          aurora1.addColorStop(0.2, '#00ff8880')  // Brighter green
          aurora1.addColorStop(0.4, '#00e6ff90')  // Brighter cyan
          aurora1.addColorStop(0.6, '#0080ff70')  // Brighter blue
          aurora1.addColorStop(0.8, '#00408050')  // Visible dark blue
          aurora1.addColorStop(1, 'transparent')
          spaceCtx.fillStyle = aurora1
          spaceCtx.fillRect(0, 200, spaceCanvas.width, 400)
          
          // Aurora curtain 2 - Purple-Pink (more vibrant)
          const aurora2 = spaceCtx.createLinearGradient(0, 100, 0, 700)
          aurora2.addColorStop(0, 'transparent')
          aurora2.addColorStop(0.15, '#8000ff60') // Brighter purple
          aurora2.addColorStop(0.35, '#ff00ff80') // Brighter magenta
          aurora2.addColorStop(0.55, '#ff006070') // Brighter pink
          aurora2.addColorStop(0.75, '#80004050') // Visible dark purple
          aurora2.addColorStop(1, 'transparent')
          spaceCtx.fillStyle = aurora2
          spaceCtx.fillRect(0, 100, spaceCanvas.width, 600)
          
          // Aurora curtain 3 - Yellow-Green (more vibrant)
          const aurora3 = spaceCtx.createLinearGradient(0, 150, 0, 450)
          aurora3.addColorStop(0, 'transparent')
          aurora3.addColorStop(0.25, '#80ff0060') // Brighter yellow-green
          aurora3.addColorStop(0.45, '#00ff4080') // Brighter green
          aurora3.addColorStop(0.65, '#00804060') // Visible dark green
          aurora3.addColorStop(1, 'transparent')
          spaceCtx.fillStyle = aurora3
          spaceCtx.fillRect(0, 150, spaceCanvas.width, 300)
          
          // Add subtle stars
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
          // Sunset gradient
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
          // Matrix-style green gradient
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
          scene.background = new THREE.Color(0x000000)
      }
    }

    createEnvironment(environment)
  }, [environment])

  // Objects useEffect - Create and manage multiple objects
  useEffect(() => {
    if (!sceneRef.current) return

    const scene = sceneRef.current
    
    // Clear existing objects
    objectsRef.current.forEach(obj => {
      scene.remove(obj.mesh)
    })
    objectsRef.current = []

    // Create new objects
    for (let i = 0; i < objectCount; i++) {
      const geometryTypes = [
        () => new THREE.IcosahedronGeometry(),
        () => new THREE.SphereGeometry(1, 16, 16),
        () => new THREE.BoxGeometry(1.5, 1.5, 1.5),
        () => new THREE.OctahedronGeometry(),
        () => new THREE.TetrahedronGeometry(1.2),
        () => new THREE.OctahedronGeometry(),
        () => new THREE.TorusKnotGeometry(0.7, 0.2, 100, 16),
        
      ]
      
      const geometry = geometryTypes[i % geometryTypes.length]()
      
      // Convert current React state colors to Three.js format
      // Create a material with current React state
      const currentBaseColor = new THREE.Color(baseColor)
      const currentSpecularColor = new THREE.Color(specularColor)
      
      const material = new THREE.MeshPhongMaterial({
        color: currentBaseColor,
        specular: currentSpecularColor,
        shininess: shininess,
        wireframe: wireframeIntensity > 0,
        transparent: wireframeIntensity > 0,
        opacity: wireframeIntensity > 0 ? wireframeIntensity / 100 : 1,
        flatShading: false,
        reflectivity: specularIntensity, // Use specular intensity for reflectivity
      })

      console.log(`Created object ${i} with specular color:`, currentSpecularColor, 'from state:', specularColor)

      const mesh = new THREE.Mesh(geometry, material)
      
      // Position objects in a circle or grid
      if (objectCount === 1) {
        mesh.position.set(0, 0, 0)
      } else {
        const angle = (i / objectCount) * Math.PI * 2
        const radius = 3
        mesh.position.set(
          Math.cos(angle) * radius,
          (Math.random() - 0.9) * 1, // Random Y position for more dynamic layout
          Math.sin(angle) * radius
        )
      }
      
      mesh.castShadow = true
      mesh.receiveShadow = true
      scene.add(mesh)

      objectsRef.current.push({
        mesh,
        material,
        originalPosition: mesh.position.clone(),
        phase: Math.random() * Math.PI * 2,
      })
    }

    // Store first material as the main one for controls
    if (objectsRef.current.length > 0) {
      materialRef.current = objectsRef.current[0].material
      console.log('Set main material reference, specular color:', objectsRef.current[0].material.specular.getHex())
    }
    
    console.log(`Created ${objectsRef.current.length} objects with current React state values`)
  }, [objectCount, baseColor, specularColor, specularIntensity, shininess, wireframeIntensity])

  // Camera view useEffect - Different camera angles and behaviors
  useEffect(() => {
    if (!cameraRef.current) return

    const camera = cameraRef.current

    // Set camera position based on view type
    switch(cameraView) {
      case 'free':
        camera.position.set(0, 0, 6)
        break
      case 'orbit':
        camera.position.set(8, 3, 8)
        camera.lookAt(0, 0, 0)
        break
      case 'top':
        camera.position.set(0, 10, 0)
        camera.lookAt(0, 0, 0)
        break
      case 'side':
        camera.position.set(10, 0, 0)
        camera.lookAt(0, 0, 0)
        break
      case 'cinematic':
        camera.position.set(-3, 2, 5)
        camera.lookAt(0, 0, 0)
        break
    }
  }, [cameraView])

  // Animation useEffect - Different animation styles
  useEffect(() => {
    if (!sceneRef.current || !cameraRef.current) return

    const scene = sceneRef.current
    const camera = cameraRef.current

    // Animation loop with different styles
    function animate() {
      animationIdRef.current = requestAnimationFrame(animate)
      
      const time = performance.now()
      const t = time * 0.001

      objectsRef.current.forEach((objData, index) => {
        const { mesh, originalPosition, phase } = objData

        switch(animationStyle) {
          case 'rotate':
            mesh.rotation.x += 0.01
            mesh.rotation.y += 0.01
            mesh.rotation.z += 0.01
            mesh.position.copy(originalPosition)
            break

          case 'float':
            mesh.rotation.x = t + phase
            mesh.rotation.y = t * 0.7 + phase
            mesh.position.x = originalPosition.x + Math.sin(t + phase) * 0.5
            mesh.position.y = originalPosition.y + Math.cos(t + phase) * 0.5
            mesh.position.z = originalPosition.z + Math.sin(t * 0.5 + phase) * 0.3
            break

          case 'spiral':
            const spiralRadius = 2 + Math.sin(t + phase) * 1
            const spiralAngle = t + phase + index * 0.5
            mesh.position.x = Math.cos(spiralAngle) * spiralRadius
            mesh.position.y = Math.sin(t * 2 + phase) * 2
            mesh.position.z = Math.sin(spiralAngle) * spiralRadius
            mesh.rotation.x = spiralAngle
            mesh.rotation.y = spiralAngle * 0.7
            break

          case 'chaos':
            mesh.position.x = originalPosition.x + Math.sin(t * 3 + phase) * 2
            mesh.position.y = originalPosition.y + Math.cos(t * 2 + phase) * 2
            mesh.position.z = originalPosition.z + Math.sin(t * 1.5 + phase) * 2
            mesh.rotation.x = t * 2 + phase
            mesh.rotation.y = t * 1.5 + phase
            mesh.rotation.z = t * 2.5 + phase
            break
        }
      })

      // Dynamic camera movement for certain views
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

      rendererRef.current.render(scene, camera)
    }

    animate()

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
    }
  }, [animationStyle, cameraView])

  // Update shininess when prop changes
  useEffect(() => {
    console.log('Updating shininess to:', shininess)
    objectsRef.current.forEach(({ material }, index) => {
      if (material) {
        material.shininess = shininess
        material.needsUpdate = true
        console.log(`Updated material ${index} shininess to:`, shininess)
      }
    })
  }, [shininess])

  // Update specular color when prop changes
  useEffect(() => {
    console.log('Updating specular color to:', specularColor)
    console.log('Number of objects:', objectsRef.current.length)
    
    if (objectsRef.current.length === 0) {
      console.log('No objects available for specular update')
      return
    }
    
    const convertedColor = parseInt(specularColor.replace('#', ''), 16)
    console.log('Converted color value:', convertedColor)
    
    objectsRef.current.forEach(({ material }, index) => {
      if (material) {
        console.log(`Updating material ${index} specular color`)
        material.specular.setHex(convertedColor)
        material.needsUpdate = true // Force material update
      } else {
        console.log(`Material ${index} is null`)
      }
    })
  }, [specularColor])

  // Update specular intensity when prop changes
  useEffect(() => {
    console.log('Updating specular intensity to:', specularIntensity)
    
    objectsRef.current.forEach(({ material }, index) => {
      if (material) {
        material.reflectivity = specularIntensity
        material.needsUpdate = true
        console.log(`Updated material ${index} specular intensity to:`, specularIntensity)
      } else {
        console.log(`Material ${index} is null`)
      }
    })
  }, [specularIntensity])

  // Update base color when prop changes
  useEffect(() => {
    console.log('Updating base color to:', baseColor)
    const convertedColor = parseInt(baseColor.replace('#', ''), 16)
    console.log('Converted base color value:', convertedColor)
    
    objectsRef.current.forEach(({ material }, index) => {
      if (material) {
        material.color.setHex(convertedColor)
        material.needsUpdate = true
        console.log(`Updated material ${index} base color`)
      }
    })
  }, [baseColor])

  // Update wireframe intensity when prop changes
  useEffect(() => {
    const intensity = wireframeIntensity / 100
    
    objectsRef.current.forEach(({ material }) => {
      if (material) {
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
  }, [wireframeIntensity])

  return <div ref={mountRef} style={{ width: '100vw', height: '100vh' }} />
}

export default ThreeScene