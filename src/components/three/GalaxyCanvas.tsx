"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Preload, PerformanceMonitor } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import GalaxyParticles from "./GalaxyParticles";
import StarField from "./StarField";
import SolarSystem from "./SolarSystem";
import ScrollCamera from "./ScrollCamera";
import { useQuality } from "@/hooks/useQuality";
import {
  getInitialQualityLevel,
  getQualityLevel,
  setQualityLevel,
} from "@/lib/quality";

function SceneReadySignal() {
  const fired = useRef(false);
  useFrame(() => {
    if (!fired.current) {
      fired.current = true;
      window.dispatchEvent(new Event("scene-ready"));
    }
  });
  return null;
}

export default function GalaxyCanvas() {
  const q = useQuality();
  const [frameloop, setFrameloop] = useState<"always" | "never">("always");

  useEffect(() => {
    setQualityLevel(getInitialQualityLevel());
  }, []);

  useEffect(() => {
    const onVis = () => {
      setFrameloop(document.hidden ? "never" : "always");
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  return (
    <div
      className="fixed inset-0 z-0 bg-[#03050c]"
      aria-hidden="true"
      role="presentation"
      style={
        !q.postProcessing
          ? { boxShadow: "inset 0 0 240px rgba(0,0,0,0.85)" }
          : undefined
      }
    >
      <Canvas
        camera={{ position: [0, 3.2, 17], fov: 65, near: 0.1, far: 1000 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.05,
        }}
        dpr={q.dpr}
        frameloop={frameloop}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <PerformanceMonitor
            bounds={() => [35, 240]}
            onDecline={() => setQualityLevel(getQualityLevel() + 1)}
          />
          <SceneReadySignal />
          <ScrollCamera />
          <StarField />
          <GalaxyParticles />
          <SolarSystem />
          {q.postProcessing && (
            <EffectComposer multisampling={0}>
              {/* Restrained cinematic bloom — no blinding cartoon halo */}
              <Bloom
                intensity={Math.min(q.bloomIntensity * 0.72, 0.85)}
                luminanceThreshold={0.84}
                luminanceSmoothing={0.65}
                mipmapBlur={q.mipmapBlur}
              />
              {/* Subtle cinematic vignette */}
              <Vignette eskil={false} offset={0.28} darkness={0.65} />
            </EffectComposer>
          )}
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
}
