import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function NexusEnvironment() {
  const matrixCubeRef = useRef();
  const materialRef = useRef();
  const electricalSignals = useRef([]); // Track active electrical signals
  const hasTriggered = useRef(false); // Only trigger once

  // Create Matrix cube with interconnected vertices
  const matrixGeometry = useMemo(() => {
    const size = 90; // Large distant cube
    const segments = 60; // High detail for intricate look
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    const colors = [];
    const lineIndices = []; // Track which line each vertex belongs to

    const segmentSize = size / segments;
    let lineIndex = 0;

    // Create vertices for each face with interconnecting lines
    const createFaceLines = (axis, sign, baseColor) => {
      for (let i = 0; i <= segments; i++) {
        for (let j = 0; j <= segments; j++) {
          const u = (i / segments - 0.5) * size;
          const v = (j / segments - 0.5) * size;
          const w = (sign * size) / 2;

          let p1, p2, p3, p4;

          if (axis === 'z') {
            // Front/Back faces - horizontal lines
            if (j < segments) {
              p1 = [u, v, w];
              p2 = [u + segmentSize, v, w];
              vertices.push(...p1, ...p2);
              colors.push(...baseColor, ...baseColor);
              lineIndices.push(lineIndex, lineIndex);
              lineIndex++;
            }
            // Vertical lines
            if (i < segments) {
              p3 = [u, v, w];
              p4 = [u, v + segmentSize, w];
              vertices.push(...p3, ...p4);
              colors.push(...baseColor, ...baseColor);
              lineIndices.push(lineIndex, lineIndex);
              lineIndex++;
            }
          } else if (axis === 'x') {
            // Left/Right faces
            if (j < segments) {
              p1 = [w, u, v];
              p2 = [w, u + segmentSize, v];
              vertices.push(...p1, ...p2);
              colors.push(...baseColor, ...baseColor);
              lineIndices.push(lineIndex, lineIndex);
              lineIndex++;
            }
            if (i < segments) {
              p3 = [w, u, v];
              p4 = [w, u, v + segmentSize];
              vertices.push(...p3, ...p4);
              colors.push(...baseColor, ...baseColor);
              lineIndices.push(lineIndex, lineIndex);
              lineIndex++;
            }
          } else if (axis === 'y') {
            // Top/Bottom faces
            if (j < segments) {
              p1 = [u, w, v];
              p2 = [u + segmentSize, w, v];
              vertices.push(...p1, ...p2);
              colors.push(...baseColor, ...baseColor);
              lineIndices.push(lineIndex, lineIndex);
              lineIndex++;
            }
            if (i < segments) {
              p3 = [u, w, v];
              p4 = [u, w, v + segmentSize];
              vertices.push(...p3, ...p4);
              colors.push(...baseColor, ...baseColor);
              lineIndices.push(lineIndex, lineIndex);
              lineIndex++;
            }
          }
        }
      }
    };

    // Define colors for each face (magenta-green gradient)
    const magenta = [1, 0, 1];
    const green = [0, 1, 0.5];
    const purple = [0.7, 0.4, 1];
    const cyan = [0.4, 1, 0.7];
    const pink = [1, 0.4, 0.8];
    const mint = [0.5, 1, 0.8];

    createFaceLines('z', 1, magenta); // Front
    createFaceLines('z', -1, green); // Back
    createFaceLines('x', 1, purple); // Right
    createFaceLines('x', -1, cyan); // Left
    createFaceLines('y', 1, pink); // Top
    createFaceLines('y', -1, mint); // Bottom

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geometry.setAttribute('lineIndex', new THREE.Float32BufferAttribute(lineIndices, 1));

    return geometry;
  }, []);

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;

    // Rotate the Matrix cube environment slowly
    if (matrixCubeRef.current) {
      matrixCubeRef.current.rotation.y += delta * 0.08;
      matrixCubeRef.current.rotation.x += delta * 0.03;
    }

    // Trigger ONE electrical signal explosion at start
    if (!hasTriggered.current) {
      const totalLines = matrixCubeRef.current?.geometry.attributes.lineIndex?.array.length || 0;
      if (totalLines > 0) {
        const randomLine = Math.floor((Math.random() * totalLines) / 2);
        electricalSignals.current.push({
          lineIndex: randomLine,
          intensity: 0.1,
          color: 'magenta',
          decayRate: 5.0 + Math.random() * 3.0, // Random decay speed
        });
        hasTriggered.current = true;
      }
    }

    // Update electrical signals - decay over time
    electricalSignals.current = electricalSignals.current.filter((signal) => {
      signal.intensity -= delta * signal.decayRate;
      return signal.intensity > 0;
    });

    // Animate colors with electricity pulsing effect + electrical signals
    if (matrixCubeRef.current && matrixCubeRef.current.geometry) {
      const colors = matrixCubeRef.current.geometry.attributes.color;
      const lineIndices = matrixCubeRef.current.geometry.attributes.lineIndex;

      for (let i = 0; i < colors.count; i++) {
        const lineIdx = lineIndices.array[i];

        // Base wave pattern
        const wave = Math.sin(time * 3 + lineIdx * 0.05);

        // Base colors
        let r, g, b;
        if (wave > 0) {
          // Bright magenta to purple gradient
          const intensity = wave;
          r = 1.0;
          g = 0.0 + intensity * 0.3;
          b = 5.0;
        } else {
          // Bright green to cyan gradient
          const intensity = -wave;
          r = 0.0 + intensity * 0.3;
          g = 1.0;
          b = 0.5 + intensity * 0.5;
        }

        // Check if this line has an active electrical signal
        const activeSignal = electricalSignals.current.find(
          (signal) => signal.lineIndex === lineIdx
        );

        if (activeSignal) {
          // Boost color based on signal type with very high saturation
          const boost = activeSignal.intensity;
          if (activeSignal.color === 'magenta') {
            r = 1.0;
            g = 0.0;
            b = 5.0;
            // Apply intensity boost (can go beyond 1.0 for additive blending glow)
            r *= 1.0 + boost * 2.0;
            b *= 5.0 + boost * 10.0;
          } else {
            r = 0.0;
            g = 1.0;
            b = 0.3;
            // Apply intensity boost
            g *= 1.0 + boost * 2.0;
            b *= 5.0 + boost * 5.5;
          }
        }

        colors.setXYZ(i, r, g, b);
      }

      colors.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* Large distant Matrix cube with interconnected vertices */}
      <lineSegments ref={matrixCubeRef} geometry={matrixGeometry}>
        <lineBasicMaterial
          ref={materialRef}
          vertexColors
          transparent
          opacity={0.35}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      {/* Ambient lighting for subtle depth */}
      <pointLight position={[-20, 15, -20]} intensity={0.4} color="#aa66dd" distance={60} />
      <pointLight position={[20, -15, -20]} intensity={0.3} color="#66ddaa" distance={60} />
      <pointLight position={[0, 20, 20]} intensity={0.3} color="#dd66aa" distance={60} />

      <fog attach="fog" args={['#0a0014', 30, 100]} />
    </group>
  );
}
