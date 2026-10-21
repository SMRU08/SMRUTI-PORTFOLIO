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
  const groupRef = useRef<THREE.Group>(null);
  const deepPointsRef = useRef<THREE.Points>(null);
  const midPointsRef = useRef<THREE.Points>(null);
  const mouse = useMousePosition();
  const smooth = useRef({ x: 0, y: 0 });
  const q = useQuality();

  const countDeep = q.starCount1 || 1400;
  const countMid = q.starCount2 || 400;
  const circleTexture = useMemo(() => getCircleTexture(), []);

  // Build deep celestial star field with realistic astronomical brightness distribution
  const { deepPositions, deepColors } = useMemo(() => {
    const prng = createPRNG(1337);
    const pos = new Float32Array(countDeep * 3);
    const col = new Float32Array(countDeep * 3);

    for (let i = 0; i < countDeep; i++) {
      const i3 = i * 3;
      // Spherical distribution with varied depth
      const radius = 180 + prng() * 220;
      const theta = 2 * Math.PI * prng();
      const phi = Math.acos(2 * prng() - 1);

      pos[i3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i3 + 2] = radius * Math.cos(phi);

      const picked = STAR_COLORS[Math.floor(prng() * STAR_COLORS.length)];
      // Natural stellar magnitude power law (many faint stars, selective bright diamonds)
      const p = prng();
      const brightness = 0.16 + Math.pow(p, 2.5) * 0.84;
      col[i3] = picked.r * brightness;
      col[i3 + 1] = picked.g * brightness;
      col[i3 + 2] = picked.b * brightness;
    }
    return { deepPositions: pos, deepColors: col };
  }, [countDeep]);

  // Build closer foreground stellar layer
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

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const elapsed = clock.elapsedTime;

    // Smooth subtle parallax (no arcade jerking)
    smooth.current.x += (mouse.current.normalizedX - smooth.current.x) * 0.01;
    smooth.current.y += (mouse.current.normalizedY - smooth.current.y) * 0.01;

    groupRef.current.rotation.y = smooth.current.x * 0.02 + elapsed * 0.0006;
    groupRef.current.rotation.x = smooth.current.y * 0.015;

    // Subtle cosmic pulse
    if (midPointsRef.current) {
      const mat = midPointsRef.current.material as THREE.PointsMaterial;
      mat.opacity = 0.78 + 0.08 * Math.sin(elapsed * 0.6);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Deep Celestial Sphere: tiny, perfectly round circular stars */}
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

      {/* Midfield Stellar Highlights: round circular beacon stars */}
      {countMid > 0 && (
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
      )}
    </group>
  );
}
