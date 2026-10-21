"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useMousePosition } from "@/hooks/useMousePosition";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { useQuality } from "@/hooks/useQuality";
import { getCircleTexture } from "./textureUtils";

// Filmic Interstellar Dust Stream Palette
const CONFIG = {
  radius: 9.5,
  branches: 3, // 3 majestic logarithmic spiral dust lanes
  spin: 1.1,
  randomness: 0.85,
  randomnessPower: 3.2,
  coreColor: "#fef3c7",    // Warm champagne core
  innerColor: "#9d74ff",   // Soft cosmic violet
  midColor: "#38bdf8",     // Delicate starlight cyan
  outerColor: "#0f172a",   // Deep midnight void
  baseSize: 0.016,
};

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

/* eslint-disable react-hooks/purity, react-hooks/immutability */

export default function GalaxyParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  const mouse = useMousePosition();
  const smoothMouse = useRef({ x: 0, y: 0 });
  const scrollProgress = useScrollProgress();
  const { viewport } = useThree();
  const q = useQuality();
  const circleTexture = useMemo(() => getCircleTexture(), []);
  const count = q.particleCount;
  const active = Math.floor(count * q.particleFraction);

  const {
    positions,
    colors,
    originalPositions,
    velocities,
    magnetism,
    baseColors,
    asleep,
  } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const baseColors = new Float32Array(count * 3);
    const originalPositions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const magnetism = new Float32Array(count);

    const coreColor = new THREE.Color(CONFIG.coreColor);
    const innerColor = new THREE.Color(CONFIG.innerColor);
    const midColor = new THREE.Color(CONFIG.midColor);
    const outerColor = new THREE.Color(CONFIG.outerColor);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const distance = Math.pow(Math.random(), 0.72) * CONFIG.radius;
      const branchAngle =
        ((i % CONFIG.branches) / CONFIG.branches) * Math.PI * 2;
      const spinAngle = distance * CONFIG.spin;

      const rp = CONFIG.randomnessPower;
      const rm = CONFIG.randomness;
      const randomX =
        Math.pow(Math.random(), rp) * (Math.random() < 0.5 ? 1 : -1) * rm;
      const randomY =
        Math.pow(Math.random(), rp) * (Math.random() < 0.5 ? 1 : -1) * rm * 0.28;
      const randomZ =
        Math.pow(Math.random(), rp) * (Math.random() < 0.5 ? 1 : -1) * rm;

      const x = Math.cos(branchAngle + spinAngle) * distance + randomX;
      const y = randomY;
      const z = Math.sin(branchAngle + spinAngle) * distance + randomZ;

      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;
      originalPositions[i3] = x;
      originalPositions[i3 + 1] = y;
      originalPositions[i3 + 2] = z;
      velocities[i3] = 0;
      velocities[i3 + 1] = 0;
      velocities[i3 + 2] = 0;

      magnetism[i] = 0.4 + Math.random() * 1.2;

      // 4-stop luxury color gradient
      const t = distance / CONFIG.radius;
      const mixedColor = new THREE.Color();
      if (t < 0.2) {
        mixedColor.copy(coreColor).lerp(innerColor, t / 0.2);
      } else if (t < 0.6) {
        mixedColor.copy(innerColor).lerp(midColor, (t - 0.2) / 0.4);
      } else {
        mixedColor.copy(midColor).lerp(outerColor, (t - 0.6) / 0.4);
      }

      const brightness = 0.65 + Math.random() * 0.35;
      baseColors[i3] = mixedColor.r * brightness;
      baseColors[i3 + 1] = mixedColor.g * brightness;
      baseColors[i3 + 2] = mixedColor.b * brightness;
      colors[i3] = baseColors[i3];
      colors[i3 + 1] = baseColors[i3 + 1];
      colors[i3 + 2] = baseColors[i3 + 2];
    }

    const asleep = new Uint8Array(count);
    return {
      positions,
      colors,
      originalPositions,
      velocities,
      magnetism,
      baseColors,
      asleep,
    };
  }, [count]);

  useEffect(() => {
    pointsRef.current?.geometry.setDrawRange(0, active);
  }, [active]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const dt = Math.min(delta, 0.05);

    const sp = scrollProgress.current;
    const fadeOut = sp < 0.14 ? 1 : sp > 0.2 ? 0 : 1 - (sp - 0.14) / 0.06;
    const fadeIn = sp < 0.9 ? 0 : sp > 0.98 ? 1 : (sp - 0.9) / 0.08;
    const galaxyOpacity = Math.max(fadeOut, fadeIn * 0.65);
    const mat = pointsRef.current.material as THREE.PointsMaterial;
    mat.opacity = 0.85 * galaxyOpacity;
    const visible = galaxyOpacity > 0.01;
    pointsRef.current.visible = visible;

    if (!visible) return;

    // Gentle organic rotation
    pointsRef.current.rotation.y += dt * 0.022;

    if (fadeIn > 0) {
      const t = smoothstep(0, 1, fadeIn);
      const startX = -20;
      const endX = 15;
      const endZ = -5;
      pointsRef.current.position.set(startX + (endX - startX) * t, 0, endZ);
      pointsRef.current.scale.setScalar(2.2);
    } else if (fadeOut > 0) {
      pointsRef.current.position.set(0, 0, 0);
      pointsRef.current.scale.setScalar(1);
    }

    const heroInteraction = Math.max(0, 1 - sp / 0.2);
    const contactInteraction = fadeIn;
    const interactionStrength = Math.max(heroInteraction, contactInteraction);

    smoothMouse.current.x +=
      (mouse.current.normalizedX - smoothMouse.current.x) * 0.08;
    smoothMouse.current.y +=
      (mouse.current.normalizedY - smoothMouse.current.y) * 0.08;

    const posAttr = pointsRef.current.geometry.getAttribute(
      "position"
    ) as THREE.BufferAttribute;
    const colAttr = pointsRef.current.geometry.getAttribute(
      "color"
    ) as THREE.BufferAttribute;
    const pos = posAttr.array as Float32Array;
    const col = colAttr.array as Float32Array;
    const mx = smoothMouse.current.x * viewport.width * 0.5;
    const my = smoothMouse.current.y * viewport.height * 0.5;

    const maxRadius = 4.2;
    const damping = 0.93;
    const returnStrength = 0.0018;
    const maxRadiusSq = maxRadius * maxRadius;
    let touched = false;

    for (let i = 0; i < active; i++) {
      const i3 = i * 3;
      const dx = pos[i3] - mx;
      const dy = pos[i3 + 1] - my;
      const distSq = dx * dx + dy * dy;

      if (asleep[i] === 1 && distSq >= maxRadiusSq) continue;
      asleep[i] = 0;
      touched = true;
      const dist = Math.sqrt(distSq);
      const mag = magnetism[i];

      if (dist < maxRadius && dist > 0.01) {
        const normalizedDist = dist / maxRadius;
        const dirX = dx / dist;
        const dirY = dy / dist;

        // Ethereal fluid displacement force
        const forceCurve = smoothstep(1.0, 0.1, normalizedDist);
        const totalForce =
          forceCurve * mag * 0.018 * interactionStrength;

        // Subtle fluid swirl
        const perpX = -dirY;
        const perpY = dirX;
        const swirl = Math.sin(normalizedDist * Math.PI) * 0.4;

        velocities[i3] += dirX * totalForce + perpX * swirl * totalForce;
        velocities[i3 + 1] += dirY * totalForce + perpY * swirl * totalForce;
        velocities[i3 + 2] += (Math.random() - 0.5) * totalForce * 0.2;

        const speed = Math.sqrt(
          velocities[i3] * velocities[i3] +
            velocities[i3 + 1] * velocities[i3 + 1]
        );
        const glow = Math.min(speed * 8.0, 0.6);
        col[i3] = baseColors[i3] + glow * 0.4;
        col[i3 + 1] = baseColors[i3 + 1] + glow * 0.45;
        col[i3 + 2] = baseColors[i3 + 2] + glow * 0.55;
      } else {
        col[i3] += (baseColors[i3] - col[i3]) * dt * 2.5;
        col[i3 + 1] += (baseColors[i3 + 1] - col[i3 + 1]) * dt * 2.5;
        col[i3 + 2] += (baseColors[i3 + 2] - col[i3 + 2]) * dt * 2.5;
      }

      velocities[i3] *= damping;
      velocities[i3 + 1] *= damping;
      velocities[i3 + 2] *= damping;

      pos[i3] += velocities[i3];
      pos[i3 + 1] += velocities[i3 + 1];
      pos[i3 + 2] += velocities[i3 + 2];

      const springX = originalPositions[i3] - pos[i3];
      const springY = originalPositions[i3 + 1] - pos[i3 + 1];
      const springZ = originalPositions[i3 + 2] - pos[i3 + 2];
      velocities[i3] += springX * returnStrength;
      velocities[i3 + 1] += springY * returnStrength;
      velocities[i3 + 2] += springZ * returnStrength;

      if (dist >= maxRadius) {
        const v2 =
          velocities[i3] * velocities[i3] +
          velocities[i3 + 1] * velocities[i3 + 1] +
          velocities[i3 + 2] * velocities[i3 + 2];
        const off2 =
          springX * springX + springY * springY + springZ * springZ;
        if (v2 < 1e-10 && off2 < 1e-8) asleep[i] = 1;
      }
    }

    if (touched) {
      posAttr.needsUpdate = true;
      colAttr.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        map={circleTexture}
        size={CONFIG.baseSize}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexColors
        transparent
        alphaTest={0.001}
        opacity={0.85}
      />
    </points>
  );
}
