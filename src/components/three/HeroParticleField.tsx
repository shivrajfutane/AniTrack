"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

export default function HeroParticleField() {
  const pointsRef = useRef<THREE.Points>(null);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const particleCount = isMobile ? 2000 : 6000;

  const [positions, colors] = useMemo(() => {
    const p = new Float32Array(particleCount * 3);
    const c = new Float32Array(particleCount * 3);
    const color1 = new THREE.Color("#7C3AED"); // violet
    const color2 = new THREE.Color("#00D4FF"); // cyan
    const tempColor = new THREE.Color();

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * 2 * Math.PI;
      const r = Math.random() * 20; // radius
      const y = (Math.random() - 0.5) * 10;
      
      p[i * 3] = r * Math.cos(theta);
      p[i * 3 + 1] = y;
      p[i * 3 + 2] = r * Math.sin(theta);

      tempColor.lerpColors(color1, color2, Math.random());
      c[i * 3] = tempColor.r;
      c[i * 3 + 1] = tempColor.g;
      c[i * 3 + 2] = tempColor.b;
    }
    return [p, c];
  }, [particleCount, isMobile]); // Added isMobile to dependencies just in case

  useFrame(() => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.0002;
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <points ref={pointsRef}>
        <bufferGeometry>
          {/* @ts-expect-error - r3f types mismatch for raw bufferAttribute usage */}
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={positions}
            itemSize={3}
          />
          {/* @ts-expect-error - r3f types mismatch for raw bufferAttribute usage */}
          <bufferAttribute
            attach="attributes-color"
            count={particleCount}
            array={colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          vertexColors
          transparent
          opacity={0.6}
          sizeAttenuation
        />
      </points>
      <group>
        <mesh position={[-3, 2, -5]}>
          <icosahedronGeometry args={[1, 0]} />
          <meshBasicMaterial color="#FF6B9D" wireframe transparent opacity={0.3} />
        </mesh>
        <mesh position={[4, -1, -3]}>
          <icosahedronGeometry args={[1.5, 0]} />
          <meshBasicMaterial color="#00D4FF" wireframe transparent opacity={0.3} />
        </mesh>
        <mesh position={[0, -3, -8]}>
          <icosahedronGeometry args={[2, 0]} />
          <meshBasicMaterial color="#7C3AED" wireframe transparent opacity={0.3} />
        </mesh>
      </group>
      <EffectComposer>
        <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} height={300} intensity={0.8} />
      </EffectComposer>
    </>
  );
}
