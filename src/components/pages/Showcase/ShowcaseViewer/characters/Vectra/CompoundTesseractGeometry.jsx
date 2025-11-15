import React from 'react';
import * as THREE from 'three';

/**
 * Compound Tesseract with Phase Sweep for Vectra
 * 5 nested cubes with asymmetric scaling and connecting lines between layers
 */
export default function CompoundTesseractGeometry({ size }) {
  return (
    <>
      {/* Innermost cube - Purple core */}
      <lineSegments position={[0, 0, 0]} scale={[0.4, 0.4, 1.4]}>
        <edgesGeometry args={[new THREE.BoxGeometry(size, size, size)]} />
        <lineBasicMaterial color="#d643f3" linewidth={2} opacity={0.9} transparent />
      </lineSegments>

      {/* Second layer cube - Cyan */}
      <lineSegments position={[0, 0, 0]} scale={[0.6, 1.4, 0.6]}>
        <edgesGeometry args={[new THREE.BoxGeometry(size, size, size)]} />
        <lineBasicMaterial color="#75fad9" linewidth={2} opacity={0.8} transparent />
      </lineSegments>

      {/* Third layer cube - Purple */}
      <lineSegments position={[0, 0, 0]} scale={[1.4, 0.8, 0.8]}>
        <edgesGeometry args={[new THREE.BoxGeometry(size, size, size)]} />
        <lineBasicMaterial color="#d643f3" linewidth={2} opacity={0.7} transparent />
      </lineSegments>

      {/* Fourth layer cube - Cyan */}
      <lineSegments position={[0, 0, 0]} scale={[1.0, 1.0, 1.0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(size, size, size)]} />
        <lineBasicMaterial color="#e6ebea" linewidth={2} opacity={0.6} transparent />
      </lineSegments>

      {/* Outermost cube - Purple */}
      <lineSegments position={[0, 0, 0]} scale={[1.2, 1.2, 1.2]}>
        <edgesGeometry args={[new THREE.BoxGeometry(size, size, size)]} />
        <lineBasicMaterial color="#d643f3" linewidth={2} opacity={1.5} transparent />
      </lineSegments>

      {/* Connecting lines from innermost to second layer (8 corners) */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={16}
            array={
              new Float32Array([
                -size * 0.2,
                -size * 0.2,
                -size * 0.2,
                -size * 0.3,
                -size * 0.3,
                -size * 0.3,
                size * 0.2,
                -size * 0.2,
                -size * 0.2,
                size * 0.3,
                -size * 0.3,
                -size * 0.3,
                -size * 0.2,
                size * 0.2,
                -size * 0.2,
                -size * 0.3,
                size * 0.3,
                -size * 0.3,
                size * 0.2,
                size * 0.2,
                -size * 0.2,
                size * 0.3,
                size * 0.3,
                -size * 0.3,
                -size * 0.2,
                -size * 0.2,
                size * 0.2,
                -size * 0.3,
                -size * 0.3,
                size * 0.3,
                size * 0.2,
                -size * 0.2,
                size * 0.2,
                size * 0.3,
                -size * 0.3,
                size * 0.3,
                -size * 0.2,
                size * 0.2,
                size * 0.2,
                -size * 0.3,
                size * 0.3,
                size * 0.3,
                size * 0.2,
                size * 0.2,
                size * 0.2,
                size * 0.3,
                size * 0.3,
                size * 0.3,
              ])
            }
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#b854e6" opacity={0.4} transparent linewidth={1} />
      </line>

      {/* Connecting lines from second to third layer */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={16}
            array={
              new Float32Array([
                -size * 0.3,
                -size * 0.3,
                -size * 0.3,
                -size * 0.4,
                -size * 0.4,
                -size * 0.4,
                size * 0.3,
                -size * 0.3,
                -size * 0.3,
                size * 0.4,
                -size * 0.4,
                -size * 0.4,
                -size * 0.3,
                size * 0.3,
                -size * 0.3,
                -size * 0.4,
                size * 0.4,
                -size * 0.4,
                size * 0.3,
                size * 0.3,
                -size * 0.3,
                size * 0.4,
                size * 0.4,
                -size * 0.4,
                -size * 0.3,
                -size * 0.3,
                size * 0.3,
                -size * 0.4,
                -size * 0.4,
                size * 0.4,
                size * 0.3,
                -size * 0.3,
                size * 0.3,
                size * 0.4,
                -size * 0.4,
                size * 0.4,
                -size * 0.3,
                size * 0.3,
                size * 0.3,
                -size * 0.4,
                size * 0.4,
                size * 0.4,
                size * 0.3,
                size * 0.3,
                size * 0.3,
                size * 0.4,
                size * 0.4,
                size * 0.4,
              ])
            }
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#5fc9b8" opacity={0.4} transparent linewidth={1} />
      </line>

      {/* Connecting lines from third to fourth layer */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={16}
            array={
              new Float32Array([
                -size * 0.4,
                -size * 0.4,
                -size * 0.4,
                -size * 0.5,
                -size * 0.5,
                -size * 0.5,
                size * 0.4,
                -size * 0.4,
                -size * 0.4,
                size * 0.5,
                -size * 0.5,
                -size * 0.5,
                -size * 0.4,
                size * 0.4,
                -size * 0.4,
                -size * 0.5,
                size * 0.5,
                -size * 0.5,
                size * 0.4,
                size * 0.4,
                -size * 0.4,
                size * 0.5,
                size * 0.5,
                -size * 0.5,
                -size * 0.4,
                -size * 0.4,
                size * 0.4,
                -size * 0.5,
                -size * 0.5,
                size * 0.5,
                size * 0.4,
                -size * 0.4,
                size * 0.4,
                size * 0.5,
                -size * 0.5,
                size * 0.5,
                -size * 0.4,
                size * 0.4,
                size * 0.4,
                -size * 0.5,
                size * 0.5,
                size * 0.5,
                size * 0.4,
                size * 0.4,
                size * 0.4,
                size * 0.5,
                size * 0.5,
                size * 0.5,
              ])
            }
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#b854e6" opacity={0.4} transparent linewidth={1} />
      </line>

      {/* Connecting lines from fourth to outermost layer */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={16}
            array={
              new Float32Array([
                -size * 0.5,
                -size * 0.5,
                -size * 0.5,
                -size * 0.6,
                -size * 0.6,
                -size * 0.6,
                size * 0.5,
                -size * 0.5,
                -size * 0.5,
                size * 0.6,
                -size * 0.6,
                -size * 0.6,
                -size * 0.5,
                size * 0.5,
                -size * 0.5,
                -size * 0.6,
                size * 0.6,
                -size * 0.6,
                size * 0.5,
                size * 0.5,
                -size * 0.5,
                size * 0.6,
                size * 0.6,
                -size * 0.6,
                -size * 0.5,
                -size * 0.5,
                size * 0.5,
                -size * 0.6,
                -size * 0.6,
                size * 0.6,
                size * 0.5,
                -size * 0.5,
                size * 0.5,
                size * 0.6,
                -size * 0.6,
                size * 0.6,
                -size * 0.5,
                size * 0.5,
                size * 0.5,
                -size * 0.6,
                size * 0.6,
                size * 0.6,
                size * 0.5,
                size * 0.5,
                size * 0.5,
                size * 0.6,
                size * 0.6,
                size * 0.6,
              ])
            }
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#5fc9b8" opacity={0.3} transparent linewidth={1} />
      </line>
    </>
  );
}
