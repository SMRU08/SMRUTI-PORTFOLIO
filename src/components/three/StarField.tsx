"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useMousePosition } from "@/hooks/useMousePosition";
import { useQuality } from "@/hooks/useQuality";
import { getCircleTexture } from "./textureUtils";

// Spectral star color palette (Harvard classification approximations)
const STAR_COLORS = [
  new THREE.Color("#dbe7ff"), // Class O/B (Blue-white)
  new THREE.Color("#f8faff"), // Class A (White)
  new THREE.Color("#fff7db"), // Class F/G (Warm Yellow-White)
  new THREE.Color("#ffe4b8"), // Class K (Soft Amber)
  new THREE.Color("#ffc2a6"), // Class M (Red-Orange dwarf)
];

// Deterministic pseudo-random number generator (Mulberry32) for reproducible, pure stellar coordinates
function createPRNG(seed: number) {
  let s = seed >>> 0;
  return function () {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export default function StarField() {
  const deepGroupRef = useRef<THREE.Group>(null);
  const midGroupRef = useRef<THREE.Group>(null);
  const foregroundGroupRef = useRef<THREE.Group>(null);

  const deepPointsRef = useRef<THREE.Points>(null);
  const midPointsRef = useRef<THREE.Points>(null);
  const foregroundPointsRef = useRef<THREE.Points>(null);

  const mouse = useMousePosition();
  const smooth = useRef({ x: 0, y: 0 });
  const q = useQuality();

  const countDeep = q.starCount1 || 1400;
  const countMid = q.starCount2 || 400;
  // Sparse foreground stars for high-end depth without clutter
  const countForeground = Math.min(85, Math.max(25, Math.floor(countMid * 0.22)));

  const circleTexture = useMemo(() => getCircleTexture(), []);

  // Layer 1: Distant Stars (Deep celestial sphere, tiny and dim)
  const { deepPositions, deepColors } = useMemo(() => {
    const prng = createPRNG(1337);
    const pos = new Float32Array(countDeep * 3);
    const col = new Float32Array(countDeep * 3);

    for (let i = 0; i < countDeep; i++) {
      const i3 = i * 3;
      const radius = 180 + prng() * 220;
      const theta = 2 * Math.PI * prng();
      const phi = Math.acos(2 * prng() - 1);

      pos[i3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i3 + 2] = radius * Math.cos(phi);

      const picked = STAR_COLORS[Math.floor(prng() * STAR_COLORS.length)];
      const p = prng();
      const brightness = 0.16 + Math.pow(p, 2.5) * 0.84;
      col[i3] = picked.r * brightness;
      col[i3 + 1] = picked.g * brightness;
      col[i3 + 2] = picked.b * brightness;
    }
    return { deepPositions: pos, deepColors: col };
  }, [countDeep]);

  // Layer 2: Mid-Depth Stars (Slightly brighter with independent movement)
  const { midPositions, midColors } = useMemo(() => {
    const prng = createPRNG(7331);
    const pos = new Float32Array(countMid * 3);
    const col = new Float32Array(countMid * 3);

    for (let i = 0; i < countMid; i++) {
      const i3 = i * 3;
      const radius = 60 + prng() * 100;
      const theta = 2 * Math.PI * prng();
      const phi = Math.acos(2 * prng() - 1);

      pos[i3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i3 + 2] = radius * Math.cos(phi);

      const picked = STAR_COLORS[Math.floor(prng() * STAR_COLORS.length)];
      const p = prng();
      const brightness = 0.32 + Math.pow(p, 1.8) * 0.68;
      col[i3] = picked.r * brightness;
      col[i3 + 1] = picked.g * brightness;
      col[i3 + 2] = picked.b * brightness;
    }
    return { midPositions: pos, midColors: col };
  }, [countMid]);

  // Layer 3: Foreground Stars (Sparse, softly glowing near-field beacons)
  const { foregroundPositions, foregroundColors } = useMemo(() => {
    const prng = createPRNG(4242);
    const pos = new Float32Array(countForeground * 3);
    const col = new Float32Array(countForeground * 3);

    for (let i = 0; i < countForeground; i++) {
      const i3 = i * 3;
      const radius = 22 + prng() * 32;
      const theta = 2 * Math.PI * prng();
      const phi = Math.acos(2 * prng() - 1);

      pos[i3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i3 + 2] = radius * Math.cos(phi);

      const picked = STAR_COLORS[Math.floor(prng() * STAR_COLORS.length)];
      const p = prng();
      const brightness = 0.45 + Math.pow(p, 1.4) * 0.55;
      col[i3] = picked.r * brightness;
      col[i3 + 1] = picked.g * brightness;
      col[i3 + 2] = picked.b * brightness;
    }
    return { foregroundPositions: pos, foregroundColors: col };
  }, [countForeground]);

  useFrame(({ clock }) => {
    const elapsed = clock.elapsedTime;

    // Smooth pointer interpolation
    smooth.current.x += (mouse.current.normalizedX - smooth.current.x) * 0.015;
    smooth.current.y += (mouse.current.normalizedY - smooth.current.y) * 0.015;

    // Three visual depth levels with smooth independent parallax:
    // 1. Distant layer (slowest, deep cosmic backdrop)
    if (deepGroupRef.current) {
      deepGroupRef.current.rotation.y = smooth.current.x * 0.012 + elapsed * 0.0004;
      deepGroupRef.current.rotation.x = smooth.current.y * 0.008;
    }

    // 2. Mid-depth layer (intermediate parallax & subtle cosmic pulsation)
    if (midGroupRef.current) {
      midGroupRef.current.rotation.y = smooth.current.x * 0.026 + elapsed * 0.0008;
      midGroupRef.current.rotation.x = smooth.current.y * 0.018;
      if (midPointsRef.current) {
        const mat = midPointsRef.current.material as THREE.PointsMaterial;
        mat.opacity = 0.78 + 0.08 * Math.sin(elapsed * 0.6);
      }
    }

    // 3. Foreground layer (closest parallax, delicate floating breath)
    if (foregroundGroupRef.current) {
      foregroundGroupRef.current.rotation.y = smooth.current.x * 0.052 + elapsed * 0.0012;
      foregroundGroupRef.current.rotation.x = smooth.current.y * 0.034;
      if (foregroundPointsRef.current) {
        const mat = foregroundPointsRef.current.material as THREE.PointsMaterial;
        mat.opacity = 0.82 + 0.12 * Math.sin(elapsed * 0.9 + 1.2);
      }
    }
  });

  return (
    <>
      {/* 1. Distant Stars Layer */}
      <group ref={deepGroupRef}>
        <points ref={deepPointsRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[deepPositions, 3]}
            />
            <bufferAttribute attach="attributes-color" args={[deepColors, 3]} />
          </bufferGeometry>
          <pointsMaterial
            map={circleTexture}
            size={0.22}
            sizeAttenuation
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            vertexColors
            transparent
            alphaTest={0.001}
            opacity={0.7}
          />
        </points>
      </group>

      {/* 2. Mid-Depth Stars Layer */}
      {countMid > 0 && (
        <group ref={midGroupRef}>
          <points ref={midPointsRef}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                args={[midPositions, 3]}
              />
              <bufferAttribute attach="attributes-color" args={[midColors, 3]} />
            </bufferGeometry>
            <pointsMaterial
              map={circleTexture}
              size={0.38}
              sizeAttenuation
              depthWrite={false}
              blending={THREE.AdditiveBlending}
              vertexColors
              transparent
              alphaTest={0.001}
              opacity={0.82}
            />
          </points>
        </group>
      )}

      {/* 3. Foreground Stars Layer */}
      {countForeground > 0 && (
        <group ref={foregroundGroupRef}>
          <points ref={foregroundPointsRef}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                args={[foregroundPositions, 3]}
              />
              <bufferAttribute
                attach="attributes-color"
                args={[foregroundColors, 3]}
              />
            </bufferGeometry>
            <pointsMaterial
              map={circleTexture}
              size={0.58}
              sizeAttenuation
              depthWrite={false}
              blending={THREE.AdditiveBlending}
              vertexColors
              transparent
              alphaTest={0.001}
              opacity={0.85}
            />
          </points>
        </group>
      )}
    </>
  );
}
