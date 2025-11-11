import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { createHessianPolychoron } from '../../../features/sceneControls/geometries/polytopes/hessianPolychoron';

export default function HessianPolychoronAnimation({ isActive = false }) {
  const containerRef = useRef();
  const sceneRef = useRef();
  const rendererRef = useRef();
  const meshRef = useRef();
  const frameIdRef = useRef();
  const nodesRef = useRef();
  const lightningNodesRef = useRef([]);
  const lightningEdgesRef = useRef([]);
  const lightningTimerRef = useRef(0);
  const edgeMemoryRef = useRef(new Map()); // Track colored edges from lightning paths

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      1000,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      10
    );
    camera.position.z = 3;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true 
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setClearColor(0x0000, 0);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create Hessian Polychoron geometry
    const geometry = createHessianPolychoron();
    
    // Base wireframe edges - we'll replace this with individual edge segments for color persistence
    const edges = new THREE.EdgesGeometry(geometry);
    
    // Create individual line segments for each edge (allows per-edge coloring)
    const edgePositions = edges.attributes.position.array;
    const edgeSegments = [];
    const edgeKeys = []; // Store unique identifiers for each edge
    
    for (let i = 0; i < edgePositions.length; i += 6) {
      const p1 = new THREE.Vector3(edgePositions[i], edgePositions[i+1], edgePositions[i+2]);
      const p2 = new THREE.Vector3(edgePositions[i+3], edgePositions[i+4], edgePositions[i+5]);
      
      const lineGeo = new THREE.BufferGeometry().setFromPoints([p1, p2]);
      const lineMat = new THREE.LineBasicMaterial({ 
        color: 0x00ff3a,
        transparent: true,
        opacity: 0.15
      });
      const line = new THREE.Line(lineGeo, lineMat);
      
      // Create unique key for this edge (sorted to match regardless of direction)
      const key1 = `${p1.x.toFixed(6)},${p1.y.toFixed(6)},${p1.z.toFixed(6)}`;
      const key2 = `${p2.x.toFixed(6)},${p2.y.toFixed(6)},${p2.z.toFixed(6)}`;
      const edgeKey = [key1, key2].sort().join('|');
      
      line.userData.edgeKey = edgeKey;
      line.userData.baseColor = 0x00ff3a;
      line.userData.baseOpacity = 0.15;
      
      scene.add(line);
      edgeSegments.push(line);
      edgeKeys.push(edgeKey);
    }
    
    meshRef.current = { rotation: new THREE.Euler(), edgeSegments }; // Store segments instead of single mesh

    // Create nodes (vertices) as glowing points
    const vertices = geometry.attributes.position.array;
    const nodeGeometry = new THREE.BufferGeometry();
    nodeGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    const nodeMaterial = new THREE.PointsMaterial({
      color: 0x00ff3a,
      size: 0.01,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    const nodes = new THREE.Points(nodeGeometry, nodeMaterial);
    scene.add(nodes);
    nodesRef.current = nodes;

    // Build adjacency map for vertices (which vertices connect to which)
    const adjacencyMap = new Map();
    const adjacencyEdgePositions = edges.attributes.position.array;
    for (let i = 0; i < adjacencyEdgePositions.length; i += 6) {
      const v1 = `${adjacencyEdgePositions[i]},${adjacencyEdgePositions[i+1]},${adjacencyEdgePositions[i+2]}`;
      const v2 = `${adjacencyEdgePositions[i+3]},${adjacencyEdgePositions[i+4]},${adjacencyEdgePositions[i+5]}`;
      
      if (!adjacencyMap.has(v1)) adjacencyMap.set(v1, []);
      if (!adjacencyMap.has(v2)) adjacencyMap.set(v2, []);
      adjacencyMap.get(v1).push([adjacencyEdgePositions[i+3], adjacencyEdgePositions[i+4], adjacencyEdgePositions[i+5]]);
      adjacencyMap.get(v2).push([adjacencyEdgePositions[i], adjacencyEdgePositions[i+1], adjacencyEdgePositions[i+2]]);
    }

    // Animation loop
    function animate() {
      frameIdRef.current = requestAnimationFrame(animate);
      
      if (meshRef.current) {
        // Slow, complex rotation - apply to all edge segments
        meshRef.current.rotation.x += 0.0001;
        meshRef.current.rotation.y += 0.0009;
        meshRef.current.rotation.z += 0.003;
        
        // Apply rotation to all individual edge segments
        meshRef.current.edgeSegments.forEach(edge => {
          edge.rotation.copy(meshRef.current.rotation);
        });
        
        nodesRef.current.rotation.copy(meshRef.current.rotation);

        // Lightning effect timing
        lightningTimerRef.current += 0.016;
        
        // Trigger new lightning every 7-10 seconds
        if (lightningTimerRef.current > 7 + Math.random() * 3) {
          // Select ONE random starting vertex
          const vertexCount = vertices.length / 3;
          const idx = Math.floor(Math.random() * vertexCount) * 3;
          const startPos = [vertices[idx], vertices[idx+1], vertices[idx+2]];

          // Clear previous lightning effects
          lightningNodesRef.current.forEach(node => scene.remove(node));
          lightningEdgesRef.current.forEach(edge => scene.remove(edge));
          lightningNodesRef.current = [];
          lightningEdgesRef.current = [];

          const hue = Math.random();

          // Build a continuous path through the geometry
          const pathVertices = [new THREE.Vector3(startPos[0], startPos[1], startPos[2])];
          const pathVertexKeys = [`${startPos[0]},${startPos[1]},${startPos[2]}`];
          let currentVertex = startPos;
          let previousVertex = null;
          const pathLength = 50 + Math.floor(Math.random() * 20); // 20-40 connected segments
          
          // Trace a continuous path through connected edges
          for (let j = 0; j < pathLength; j++) {
            const currentKey = `${currentVertex[0]},${currentVertex[1]},${currentVertex[2]}`;
            const currentConnections = adjacencyMap.get(currentKey) || [];
            if (currentConnections.length === 0) break;
            
            // Filter out the vertex we just came from (avoid immediate backtracking)
            let availableConnections = currentConnections;
            if (previousVertex) {
              const prevKey = `${previousVertex[0]},${previousVertex[1]},${previousVertex[2]}`;
              availableConnections = currentConnections.filter(p => {
                const k = `${p[0]},${p[1]},${p[2]}`;
                return k !== prevKey;
              });
            }
            
            // If we've filtered everything out, use all connections
            if (availableConnections.length === 0) {
              availableConnections = currentConnections;
            }
            
            // Pick a random connected neighbor
            const nextVertex = availableConnections[Math.floor(Math.random() * availableConnections.length)];
            pathVertices.push(new THREE.Vector3(nextVertex[0], nextVertex[1], nextVertex[2]));
            pathVertexKeys.push(`${nextVertex[0]},${nextVertex[1]},${nextVertex[2]}`);
            
            previousVertex = currentVertex;
            currentVertex = nextVertex;
          }
          
          // Create traveling energy line
          const lineData = {
            path: pathVertices,
            pathVertexKeys: pathVertexKeys,
            hue,
            startTime: Date.now(),
            duration: 3.78, // 3.78 seconds (10% faster than 4.2)
            illuminatedNodes: []
          };
          
          const lineMat = new THREE.LineBasicMaterial({
            color: new THREE.Color().setHSL(hue, 1.0, 0.7),
            transparent: true,
            opacity: 0,
            blending: THREE.AdditiveBlending,
            linewidth: 5
          });
          
          const lineGeo = new THREE.BufferGeometry();
          const line = new THREE.Line(lineGeo, lineMat);
          line.userData = lineData;
          scene.add(line);
          lightningEdgesRef.current.push(line);

          lightningTimerRef.current = 0;
        }

        // Animate traveling energy line
        const now = Date.now();

        lightningEdgesRef.current.forEach(edge => {
          const age = (now - edge.userData.startTime) / 1000;
          const duration = edge.userData.duration || 3.78;
          
          if (age > duration + 0.3) { // Extra time for fade out
            scene.remove(edge);
          } else if (age <= duration) {
            // Calculate travel progress (0 to 1)
            const progress = Math.min(age / duration, 1);
            
            // Get the path vertices
            const path = edge.userData.path || [];
            const pathKeys = edge.userData.pathVertexKeys || [];
            if (path.length < 2) return;
            
            // Calculate total path length
            let totalLength = 0;
            const segmentLengths = [];
            for (let i = 0; i < path.length - 1; i++) {
              const segLen = path[i].distanceTo(path[i + 1]);
              segmentLengths.push(segLen);
              totalLength += segLen;
            }
            
            // Current position along path
            const currentDistance = progress * totalLength;
            const trailLengthRatio = 0.4; // 40% trail length
            const trailLength = totalLength * trailLengthRatio;
            const startDistance = Math.max(0, currentDistance - trailLength);
            
            // Build the visible energy trail first
            const visiblePoints = [];
            let accumulatedLength = 0;
            
            for (let i = 0; i < path.length - 1; i++) {
              const segmentStart = accumulatedLength;
              const segmentEnd = accumulatedLength + segmentLengths[i];
              
              if (segmentEnd >= startDistance && segmentStart <= currentDistance) {
                const t0 = Math.max(0, (startDistance - segmentStart) / segmentLengths[i]);
                const t1 = Math.min(1, (currentDistance - segmentStart) / segmentLengths[i]);
                
                const p0 = path[i].clone().lerp(path[i + 1], t0);
                const p1 = path[i].clone().lerp(path[i + 1], t1);
                
                if (visiblePoints.length === 0 || !visiblePoints[visiblePoints.length - 1].equals(p0)) {
                  visiblePoints.push(p0);
                }
                visiblePoints.push(p1);
              }
              
              accumulatedLength = segmentEnd;
            }
            
            // Find which vertices the trail has passed and illuminate them
            // Only illuminate nodes that are BEHIND the trail start (already fully passed)
            const illuminatedNodes = edge.userData.illuminatedNodes || [];
            accumulatedLength = 0;
            
            for (let i = 0; i < segmentLengths.length; i++) {
              accumulatedLength += segmentLengths[i];
              
              // Only illuminate if the BACK of the trail has passed this vertex
              // This means the front has definitely passed it
              if (startDistance > accumulatedLength && !illuminatedNodes[i + 1]) {
                const vertexPos = path[i + 1]; // The vertex at the end of this segment
                const nodeGeo = new THREE.SphereGeometry(0.012, 8, 8);
                const nodeMat = new THREE.MeshBasicMaterial({
                  color: 0x00ff3a, // Same green as base particles
                  transparent: true,
                  opacity: 0.5,
                  blending: THREE.AdditiveBlending
                });
                const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
                nodeMesh.position.copy(vertexPos);
                nodeMesh.userData = { createdAt: now };
                scene.add(nodeMesh);
                lightningNodesRef.current.push(nodeMesh);
                illuminatedNodes[i + 1] = nodeMesh;
                
                // COLOR PERSISTENCE: Mark the edge segment that was just passed
                if (i < path.length - 1) {
                  const p1 = path[i];
                  const p2 = path[i + 1];
                  const key1 = `${p1.x.toFixed(6)},${p1.y.toFixed(6)},${p1.z.toFixed(6)}`;
                  const key2 = `${p2.x.toFixed(6)},${p2.y.toFixed(6)},${p2.z.toFixed(6)}`;
                  const edgeKey = [key1, key2].sort().join('|');
                  
                  // Store this edge in memory with color and timestamp
                  edgeMemoryRef.current.set(edgeKey, {
                    hue: edge.userData.hue,
                    timestamp: now,
                    intensity: 1.0
                  });
                }
              }
            }
            
            // Illuminate the first vertex at the start (when trail back has passed it)
            if (startDistance > 0 && !illuminatedNodes[0]) {
              const vertexPos = path[0];
              const nodeGeo = new THREE.SphereGeometry(0.012, 8, 8);
              const nodeMat = new THREE.MeshBasicMaterial({
                color: 0x00ff3a,
                transparent: true,
                opacity: 0.7,
                blending: THREE.AdditiveBlending
              });
              const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
              nodeMesh.position.copy(vertexPos);
              nodeMesh.userData = { createdAt: now };
              scene.add(nodeMesh);
              lightningNodesRef.current.push(nodeMesh);
              illuminatedNodes[0] = nodeMesh;
            }
            
            edge.userData.illuminatedNodes = illuminatedNodes;
            
            if (visiblePoints.length > 1) {
              edge.geometry.setFromPoints(visiblePoints);
              
              // Fade trail opacity from front (bright) to back (dim)
              // Calculate opacity gradient along the trail
              const trailProgress = (currentDistance - startDistance) / trailLength;
              const baseFade = Math.min(progress * 2, 1); // Fade in at start
              edge.material.opacity = 0.9 * baseFade;
            } else if (visiblePoints.length === 1) {
              // Single point, clear geometry to avoid stuck trails
              edge.geometry.setFromPoints([]);
            }
            
            // When complete (reached the end), change wireframe color with flash
            if (progress >= 0.99 && meshRef.current && !edge.userData.colorChanged) {
              edge.userData.colorChanged = true;
              edge.userData.flashStartTime = now;
              edge.userData.targetHue = edge.userData.hue;
            }
            
            // Animate color change flash
            if (edge.userData.colorChanged && edge.userData.flashStartTime) {
              const flashAge = (now - edge.userData.flashStartTime) / 1000;
              
              if (flashAge < 0.02) {
                // Ultra quick single bright flash with fast fade (60ms total)
                const flashProgress = flashAge / 0.06;
                
                // Sharp attack, fast decay
                let flashIntensity;
                if (flashProgress < 0.01) {
                  // Quick rise (0-12ms)
                  flashIntensity = flashProgress / 0.2;
                } else {
                  // Fast exponential decay (12-60ms)
                  const decayProgress = (flashProgress - 0.2) / 0.7;
                  flashIntensity = Math.exp(-decayProgress * 9); // Exponential fade
                }
                
                // Very bright flash
                const saturation = 0.6 + (0.4 * flashIntensity);
                const lightness = 0.35 + (0.55 * flashIntensity); // Peak at 0.9 (very bright)
                const opacity = 0.2 + (0.5 * flashIntensity); // Peak at 0.9 (very visible)
                
                meshRef.current.material.color.setHSL(edge.userData.targetHue, saturation, lightness);
                meshRef.current.material.opacity = opacity;
              } else {
                // Flash complete, set to final subdued color
                meshRef.current.material.color.setHSL(edge.userData.targetHue, 0.6, 0.35);
                meshRef.current.material.opacity = 0.2;
                edge.userData.flashStartTime = null; // Stop flashing
              }
            }
          } else {
            // Fade out the trail completely
            const fadeProgress = (age - duration) / 0.5;
            edge.material.opacity = 0.9 * (1 - fadeProgress);
            
            // Clear geometry when fully faded
            if (fadeProgress >= 1.0) {
              edge.geometry.setFromPoints([]);
            }
          }
        });

        // Animate illuminated nodes
        lightningNodesRef.current.forEach(node => {
          const nodeAge = (now - node.userData.createdAt) / 100;
          if (nodeAge > 4.0) {
            scene.remove(node);
          } else {
            const fade = Math.max(0, 1 - (nodeAge / 4.0));
            node.material.opacity = 0.9 * fade;
            const pulse = Math.sin(nodeAge * 8) * 0.15 + 1;
            node.scale.setScalar(pulse);
          }
        });

        // Clean up dead lightning
        lightningNodesRef.current = lightningNodesRef.current.filter(n => n.parent);
        lightningEdgesRef.current = lightningEdgesRef.current.filter(e => e.parent);
        
        // COLOR PERSISTENCE: Update all edge segments based on memory
        const persistenceDuration = 8000; // 8 seconds for color to fade
        const edgesToRemove = [];
        
        meshRef.current.edgeSegments.forEach(edgeSegment => {
          const edgeKey = edgeSegment.userData.edgeKey;
          const memory = edgeMemoryRef.current.get(edgeKey);
          
          if (memory) {
            // Calculate how long ago this edge was hit by lightning
            const age = now - memory.timestamp;
            
            if (age > persistenceDuration) {
              // Fade complete, return to base color
              edgeSegment.material.color.setHex(edgeSegment.userData.baseColor);
              edgeSegment.material.opacity = edgeSegment.userData.baseOpacity;
              edgesToRemove.push(edgeKey);
            } else {
              // Fade from bright lightning color to base color
              const fadeProgress = age / persistenceDuration;
              
              // Interpolate from lightning color to base green
              const lightningColor = new THREE.Color().setHSL(memory.hue, 0.8, 0.5);
              const baseColor = new THREE.Color(edgeSegment.userData.baseColor);
              edgeSegment.material.color.copy(lightningColor).lerp(baseColor, fadeProgress);
              
              // Fade opacity from bright to base
              const maxOpacity = 0.7;
              edgeSegment.material.opacity = maxOpacity * (1 - fadeProgress) + edgeSegment.userData.baseOpacity * fadeProgress;
            }
          } else {
            // No memory, keep base color
            edgeSegment.material.color.setHex(edgeSegment.userData.baseColor);
            edgeSegment.material.opacity = edgeSegment.userData.baseOpacity;
          }
        });
        
        // Remove expired edge memories
        edgesToRemove.forEach(key => edgeMemoryRef.current.delete(key));
      }
      
      renderer.render(scene, camera);
    }
    animate();

    // Cleanup
    return () => {
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      
      // Clean up lightning effects
      lightningNodesRef.current.forEach(node => {
        if (node.geometry) node.geometry.dispose();
        if (node.material) node.material.dispose();
      });
      lightningEdgesRef.current.forEach(edge => {
        if (edge.geometry) edge.geometry.dispose();
        if (edge.material) edge.material.dispose();
      });
      
      // Clean up individual edge segments
      if (meshRef.current && meshRef.current.edgeSegments) {
        meshRef.current.edgeSegments.forEach(edge => {
          if (edge.geometry) edge.geometry.dispose();
          if (edge.material) edge.material.dispose();
        });
      }
      
      geometry.dispose();
      edges.dispose();
      nodeGeometry.dispose();
      nodeMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '-5%',
        left: 0,
        zIndex: 1,
        pointerEvents: 'none',
      }}
    />
  );
}
