import { useEffect, useRef } from 'react'
import * as THREE from 'three'

// This component receives shininess AND specularColor from App.jsx
function ThreeScene({ shininess, specularColor }) {
  const mountRef = useRef(null)
  const sceneRef = useRef(null)
  const materialRef = useRef(null)

  useEffect(() => {
    // 1. Create a scene
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x320059)
    sceneRef.current = scene

    // 2. Add a camera
    const camera = new THREE.PerspectiveCamera(
      40,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    camera.position.z = 6

    // 3. Create icosahedron with proper initial specular color
    const geometry = new THREE.IcosahedronGeometry()
    
    // Convert initial specular color from hex string to number
    const initialSpecular = parseInt(specularColor.replace('#', ''), 16)
    
    const material = new THREE.MeshPhongMaterial({
      color: 0x222222, // Dark gray so we can see the object
      emissive: 0x000000, // No emissive
      shininess: shininess, // Use the shininess prop
      specular: initialSpecular, // Use the specularColor prop
      transparent: false,
      opacity: 1,
      wireframe: false,
      flatShading: false,
    })
    materialRef.current = material

    const icosahedron = new THREE.Mesh(geometry, material)
    scene.add(icosahedron)

    // 4. Simple but effective lighting for specular highlights
    const ambientLight = new THREE.AmbientLight(0x404040, 0.3) // Some ambient light
    
    // One strong directional light for good specular highlights
    const light1 = new THREE.DirectionalLight(0xffffff, 2)
    light1.position.set(3, 3, 3)
    
    scene.add(light1)
    scene.add(ambientLight)

    // 5. Set up the renderer
    const renderer = new THREE.WebGLRenderer()
    renderer.setSize(window.innerWidth, window.innerHeight)
    mountRef.current.appendChild(renderer.domElement)

    // 6. Animation loop
    function animate() {
      requestAnimationFrame(animate)

      const time = performance.now()

      // Rotate the icosahedron
      icosahedron.rotation.x += 0.01
      icosahedron.rotation.y += 0.01
      icosahedron.rotation.z += 0.01

      // Position animation only (other animations disabled to see specular better)
      icosahedron.position.x = 0.5 * Math.sin(time * 0.002)
      icosahedron.position.y = 0.5 * Math.sin(time * 0.002)

      // Render the scene
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
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [])

  // Update shininess when prop changes
  useEffect(() => {
    console.log('Shininess useEffect triggered, shininess:', shininess)
    console.log('materialRef.current exists?', !!materialRef.current)
    
    if (materialRef.current) {
      console.log('BEFORE update - material shininess:', materialRef.current.shininess)
      materialRef.current.shininess = shininess
      console.log('AFTER update - material shininess:', materialRef.current.shininess)
      
      // TEST: Also change base color so we can see React is working
      if (shininess < 500) {
        materialRef.current.color.setHex(0x222222) // Dark
        console.log('Set color to dark')
      } else {
        materialRef.current.color.setHex(0x666666) // Lighter
        console.log('Set color to light')
      }
    } else {
      console.log('ERROR: materialRef.current is null!')
    }
  }, [shininess])

  // Update specular color when prop changes
  useEffect(() => {
    console.log('Specular color useEffect triggered, color:', specularColor)
    console.log('materialRef.current exists?', !!materialRef.current)
    
    if (materialRef.current) {
      console.log('BEFORE update - material specular:', materialRef.current.specular.getHex())
      
      // Debug the color conversion
      const hexWithoutHash = specularColor.replace('#', '')
      const convertedColor = parseInt(hexWithoutHash, 16)
      console.log('Converting color:', specularColor, '→', hexWithoutHash, '→', convertedColor)
      
      // Convert hex color to Three.js color
      materialRef.current.specular.setHex(convertedColor)
      console.log('AFTER update - material specular:', materialRef.current.specular.getHex())
    } else {
      console.log('ERROR: materialRef.current is null for specular!')
    }
  }, [specularColor])

  return <div ref={mountRef} style={{ width: '100vw', height: '100vh' }} />
}

export default ThreeScene