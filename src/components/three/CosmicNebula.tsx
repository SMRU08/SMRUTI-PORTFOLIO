"use client";

/* eslint-disable react-hooks/immutability */

import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { useMousePosition } from "@/hooks/useMousePosition";
import { getCircleTexture } from "./textureUtils";

// ----------------------------------------------------------------------------
// Procedural Bilateral Cosmic Nebula Shader
// - Renders two lighter, soft, ethereal cloud banks flanking the galaxy (left & right).
// - Enforces a strict, 100% zero-density clear corridor across the center (name & hero text).
// - Lighter and softer with lifted shadows and translucent violet-cyan gradients.
// - Features subtle localized cursor-reactive ripple wave propagation.
// ----------------------------------------------------------------------------

const NEBULA_VERTEX_SHADER = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const NEBULA_FRAGMENT_SHADER = `
  uniform float uTime;
  uniform float uGalaxyRotation;
  uniform float uScrollProgress;
  uniform float uOpacity;
  uniform vec2 uCursor;
  uniform float uCursorSpeed;
  uniform float uIsMobile;

  // Lighter, filmic cosmic color palette
  uniform vec3 uColorIndigo;     // Rich deep space indigo base
  uniform vec3 uColorCyan;       // Soft starlight atmospheric cyan
  uniform vec3 uColorViolet;     // Ethereal cosmic violet
  uniform vec3 uColorLavender;   // Soft luminous starlight highlight

  varying vec2 vUv;

  // Simplex 2D noise implementation
  vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m * m;
    m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  // 3-octave fractional Brownian motion for delicate cosmic mist
  float fbm(vec2 p) {
    float f = 0.0;
    f += 0.5200 * snoise(p); p *= 2.04;
    f += 0.2800 * snoise(p); p *= 2.02;
    f += 0.1200 * snoise(p);
    return f;
  }

  vec2 rotate2D(vec2 coord, float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return vec2(coord.x * c - coord.y * s, coord.x * s + coord.y * c);
  }

  void main() {
    // Screen coordinates centered at (0, 0)
    vec2 p = vUv * 2.0 - 1.0;
    p.x *= 1.65; // Screen aspect ratio expansion

    // -------------------------------------------------------------
    // 1. STRICT ZERO-DENSITY CENTER CLEAR CORRIDOR
    // Complete exclusion zone behind the user's name, headline, tagline, and buttons.
    // In this central corridor, clearMask is strictly 0.0.
    // -------------------------------------------------------------
    float clearInner = (uIsMobile > 0.5) ? 0.38 : 0.52;
    float clearOuter = (uIsMobile > 0.5) ? 0.72 : 0.88;
    float hClear = smoothstep(clearInner, clearOuter, abs(p.x));

    // Vertical clearing ensures buttons and title are never encroached
    float vClear = smoothstep(0.48, 0.90, abs(p.y));
    float centerClearMask = max(hClear, vClear * 0.45);

    // -------------------------------------------------------------
    // 2. GALAXY-SYNCHRONIZED BILATERAL CLOUDS (LEFT & RIGHT BANKS)
    // -------------------------------------------------------------
    float rotAngle = uGalaxyRotation * 0.45;
    float timeDrift = uTime * 0.024;

    // A) Western (Left) Cloud Bank - frames the left spiral arm of galaxy
    vec2 leftOrigin = vec2(-0.95, 0.05);
    vec2 pLeft = p - leftOrigin;
    vec2 pLeftRot = rotate2D(pLeft, rotAngle * 0.4) * 1.15;
    vec2 driftL = vec2(timeDrift * 0.25, timeDrift * 0.12);
    float nL1 = fbm(pLeftRot + driftL);
    float nL2 = fbm(pLeftRot * 1.65 - driftL * 0.5 + vec2(nL1 * 0.4));
    // Soft, lighter thresholding (avoids dark muddiness, reveals delicate billows)
    float leftDensity = smoothstep(-0.35, 0.65, nL2) * exp(-length(pLeft) * 1.25);

    // B) Eastern (Right) Cloud Bank - frames the right spiral arm of galaxy
    vec2 rightOrigin = vec2(0.98, -0.05);
    vec2 pRight = p - rightOrigin;
    vec2 pRightRot = rotate2D(pRight, -rotAngle * 0.38) * 1.15;
    vec2 driftR = vec2(-timeDrift * 0.22, timeDrift * 0.30);
    float nR1 = fbm(pRightRot + driftR);
    float nR2 = fbm(pRightRot * 1.62 - driftR * 0.55 + vec2(nR1 * 0.38));
    float rightDensity = smoothstep(-0.35, 0.65, nR2) * exp(-length(pRight) * 1.22);

    float combinedDensity = leftDensity + rightDensity;

    // -------------------------------------------------------------
    // 3. CURSOR-REACTIVE GASEOUS WAVE PROPAGATION
    // -------------------------------------------------------------
    if (uIsMobile < 0.5 && uCursorSpeed > 0.001) {
      float dCursor = length(p - uCursor);
      float cursorWave = sin(dCursor * 12.0 - uTime * 4.0) * exp(-dCursor * 3.8) * uCursorSpeed * 0.16;
      combinedDensity += cursorWave;
    }

    // Apply strict center exclusion
    combinedDensity *= centerClearMask;

    // Soft outer celestial edge vignette to blend naturally into deep space
    float outerVignette = 1.0 - smoothstep(0.72, 1.38, length(p * vec2(0.85, 1.02)));
    combinedDensity *= outerVignette;

    // Core luminous filaments (reveals inner structure without harsh neon)
    float coreDensity = smoothstep(0.20, 0.78, combinedDensity * 1.35);

    // -------------------------------------------------------------
    // 4. LIGHTER, SOFTER COSMIC COLOR BLENDING
    // Lifted shadows: gentle transition from indigo -> starlight cyan -> cosmic violet -> soft lilac
    // -------------------------------------------------------------
    vec3 color = uColorIndigo;
    color = mix(color, uColorCyan, clamp(combinedDensity * 0.85, 0.0, 1.0));
    color = mix(color, uColorViolet, clamp(combinedDensity * 0.70, 0.0, 1.0));
    color = mix(color, uColorLavender, clamp(coreDensity * 0.55, 0.0, 1.0));

    // Lighter, softer alpha with gentle gamma curve (never black/muddy, translucent starlight)
    float alpha = (pow(combinedDensity, 1.22) * 0.58 + coreDensity * 0.28) * uOpacity;

    gl_FragColor = vec4(color, alpha);
  }
`;

export default function CosmicNebula() {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);

  const isMobile = useIsMobile();
  const { viewport } = useThree();
  const scrollProgress = useScrollProgress();
  const mouse = useMousePosition();

  const galaxyAngleRef = useRef(0);
  const smoothScrollRef = useRef(0);
  const smoothMouseRef = useRef({ x: 0, y: 0 });
  const prevMouseRef = useRef({ x: 0, y: 0 });
  const cursorSpeedRef = useRef(0);

  const circleTexture = useMemo(() => getCircleTexture(), []);

  // --------------------------------------------------------------------------
  // CLOUD MOTE PARTICLES (STARDUST PARTICLES)
  // Dedicated stardust particles embedded exclusively inside the left and right
  // cloud banks (0 particles in the center).
  // React to cursor with a gentle wave ripple and spring-back damping.
  // --------------------------------------------------------------------------
  const particleCount = isMobile ? 32 : 110;

  const { particleData, restPositions, velocities } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const col = new Float32Array(particleCount * 3);
    const rest = new Float32Array(particleCount * 3);
    const vel = new Float32Array(particleCount * 3);

    const cyanColor = new THREE.Color("#38bdf8");
    const violetColor = new THREE.Color("#a78bfa");
    const champagneColor = new THREE.Color("#fef3c7");

    const half = Math.floor(particleCount / 2);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const isLeft = i < half;

      // Deterministic spread in left or right cloud banks
      // Left bank: x in [-34, -16], Right bank: x in [+16, +34]
      const side = isLeft ? -1 : 1;
      const spanX = 18 + ((i * 17) % 16);
      const spanY = -12 + ((i * 23) % 24);
      const spanZ = -75 + ((i * 13) % 25);

      const x = side * spanX;
      const y = spanY;
      const z = spanZ;

      pos[i3] = x;
      pos[i3 + 1] = y;
      pos[i3 + 2] = z;

      rest[i3] = x;
      rest[i3 + 1] = y;
      rest[i3 + 2] = z;

      vel[i3] = 0;
      vel[i3 + 1] = 0;
      vel[i3 + 2] = 0;

      // Soft spectral tinting matching the nebula clouds
      const colorPick =
        i % 3 === 0 ? cyanColor : i % 3 === 1 ? violetColor : champagneColor;
      const brightness = 0.55 + ((i % 5) / 5) * 0.45;
      col[i3] = colorPick.r * brightness;
      col[i3 + 1] = colorPick.g * brightness;
      col[i3 + 2] = colorPick.b * brightness;
    }

    return {
      particleData: { positions: pos, colors: col },
      restPositions: rest,
      velocities: vel,
    };
  }, [particleCount]);

  // Shader uniforms
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uGalaxyRotation: { value: 0 },
      uScrollProgress: { value: 0 },
      uOpacity: { value: isMobile ? 0.46 : 0.68 },
      uCursor: { value: new THREE.Vector2(0, 0) },
      uCursorSpeed: { value: 0 },
      uIsMobile: { value: isMobile ? 1.0 : 0.0 },

      // Filmic, soft, luminous cosmic colors
      uColorIndigo: { value: new THREE.Color("#1e1b4b") },   // Rich deep-space indigo base
      uColorCyan: { value: new THREE.Color("#0284c7") },     // Atmospheric starlight cyan
      uColorViolet: { value: new THREE.Color("#8b5cf6") },   // Luminous cosmic violet
      uColorLavender: { value: new THREE.Color("#c4b5fd") }, // Soft starlight highlights
    }),
    [isMobile]
  );

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const dt = Math.min(delta, 0.05);

    // 1. Galaxy Rotation Sync (dt * 0.022 matches GalaxyParticles.tsx)
    galaxyAngleRef.current += dt * 0.022;

    // 2. Scroll Progress & Hero Range Detection
    // Smooth cosine fade across Hero: visible throughout 0 <= sp <= 0.26
    const sp = scrollProgress.current;
    const heroFade =
      sp < 0.15
        ? 1.0
        : sp > 0.26
        ? 0.0
        : Math.cos(((sp - 0.15) / 0.11) * (Math.PI * 0.5));

    const isVisible = heroFade > 0.005;
    groupRef.current.visible = isVisible;
    if (!isVisible) return;

    // Smooth scroll interpolation for seamless depth reaction
    smoothScrollRef.current += (sp - smoothScrollRef.current) * 0.1;
    const currentScroll = smoothScrollRef.current;

    // 3. Cursor Tracking & Localized Wave Speed Calculation
    const targetMouseX = mouse.current.normalizedX;
    const targetMouseY = mouse.current.normalizedY;

    const dmx = targetMouseX - prevMouseRef.current.x;
    const dmy = targetMouseY - prevMouseRef.current.y;
    const rawSpeed = Math.sqrt(dmx * dmx + dmy * dmy);
    prevMouseRef.current.x = targetMouseX;
    prevMouseRef.current.y = targetMouseY;

    smoothMouseRef.current.x +=
      (targetMouseX - smoothMouseRef.current.x) * 0.08;
    smoothMouseRef.current.y +=
      (targetMouseY - smoothMouseRef.current.y) * 0.08;

    cursorSpeedRef.current += (rawSpeed - cursorSpeedRef.current) * 0.1;

    // 4. Update Shader Material Uniforms
    if (meshRef.current) {
      const mat = meshRef.current.material as THREE.ShaderMaterial;
      if (mat && mat.uniforms) {
        mat.uniforms.uTime.value += dt;
        mat.uniforms.uGalaxyRotation.value = galaxyAngleRef.current;
        mat.uniforms.uScrollProgress.value = currentScroll;
        mat.uniforms.uOpacity.value = (isMobile ? 0.46 : 0.68) * heroFade;
        mat.uniforms.uCursor.value.set(
          smoothMouseRef.current.x * 1.2,
          smoothMouseRef.current.y * 0.8
        );
        mat.uniforms.uCursorSpeed.value = Math.min(cursorSpeedRef.current * 12.0, 1.0);
      }
    }

    // 5. Scroll-Synchronized Parallax Movement:
    // As the user scrolls down, the clouds gently part outward to the left and right,
    // matching the camera's forward flight through the galaxy, then reverse seamlessly when scrolling back up.
    const scrollParting = currentScroll * 2.2;
    meshRef.current?.scale.set(1.0 + scrollParting * 0.6, 1.0 + scrollParting * 0.3, 1.0);
    meshRef.current?.position.set(0, -currentScroll * 3.5, -85 - currentScroll * 10.0);

    // 6. Interactive Stardust Particle Simulation
    if (particlesRef.current && !isMobile) {
      const posAttr = particlesRef.current.geometry.getAttribute(
        "position"
      ) as THREE.BufferAttribute;
      const positions = posAttr.array as Float32Array;

      // Project cursor into world plane of the cloud motes
      const cursorWorldX = smoothMouseRef.current.x * (viewport.width * 0.85);
      const cursorWorldY = smoothMouseRef.current.y * (viewport.height * 0.85);
      const interactRadius = 14.0;
      const interactRadiusSq = interactRadius * interactRadius;

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const px = positions[i3];
        const py = positions[i3 + 1];

        const dx = px - cursorWorldX;
        const dy = py - cursorWorldY;
        const distSq = dx * dx + dy * dy;

        // Wave-like ripple displacement when cursor hovers near cloud particles
        if (distSq < interactRadiusSq && distSq > 0.04) {
          const dist = Math.sqrt(distSq);
          const force = (1.0 - dist / interactRadius) * 0.08;
          // Gentle wave ripple push
          velocities[i3] += (dx / dist) * force;
          velocities[i3 + 1] += (dy / dist) * force;
        }

        // Spring-damper returning each particle smoothly to its rest position
        const rx = restPositions[i3];
        const ry = restPositions[i3 + 1];
        const rz = restPositions[i3 + 2];

        velocities[i3] += (rx - px) * 0.038;
        velocities[i3 + 1] += (ry - py) * 0.038;
        velocities[i3 + 2] += (rz - positions[i3 + 2]) * 0.038;

        // Damping for smooth, cinematic settling
        velocities[i3] *= 0.89;
        velocities[i3 + 1] *= 0.89;
        velocities[i3 + 2] *= 0.89;

        positions[i3] += velocities[i3];
        positions[i3 + 1] += velocities[i3 + 1];
        positions[i3 + 2] += velocities[i3 + 2];
      }

      posAttr.needsUpdate = true;

      // Subtle particle material opacity matching hero fade
      const pMat = particlesRef.current.material as THREE.PointsMaterial;
      if (pMat) {
        pMat.opacity = 0.75 * heroFade;
      }
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* 1. Lighter, Soft Bilateral Gaseous Nebula Mesh */}
      <mesh ref={meshRef} position={[0, 0, -85]} renderOrder={-10}>
        <planeGeometry args={[260, 160]} />
        <shaderMaterial
          vertexShader={NEBULA_VERTEX_SHADER}
          fragmentShader={NEBULA_FRAGMENT_SHADER}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 2. Interactive Stardust Particle Motes (Left & Right Banks Only) */}
      <points ref={particlesRef} renderOrder={-9}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particleData.positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[particleData.colors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          map={circleTexture}
          size={isMobile ? 0.35 : 0.58}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          vertexColors
          transparent
          alphaTest={0.001}
          opacity={0.75}
        />
      </points>
    </group>
  );
}
