"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import HeroParticleField from "./HeroParticleField";

export default function HeroParticleCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 15], fov: 60 }}
      gl={{ antialias: false, alpha: true }}
      dpr={[1, 1.5]}
      style={{ background: "transparent", width: "100%", height: "100%" }}
    >
      <Suspense fallback={null}>
        <HeroParticleField />
      </Suspense>
    </Canvas>
  );
}
