"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { getCircleTexture } from "./textureUtils";

// Shader for razor-thin, tapering optical diffraction beams (astronomical telescope cross flare)
const BEAM_VERTEX_SHADER = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const BEAM_FRAGMENT_SHADER = `
  uniform vec3 uColorCenter;
  uniform vec3 uColorMid;
  uniform vec3 uColorGlow;
  uniform float uPulse;
  varying vec2 vUv;

  void main() {
    float lengthDist = abs(vUv.x - 0.5) * 2.0;
    float thicknessDist = abs(vUv.y - 0.5) * 2.0;

    // Razor-thin exponential falloff across the beam thickness
    float thicknessFactor = exp(-thicknessDist * 16.0);
    // Smooth telescopic taper along beam length
    float lengthFactor = pow(clamp(1.0 - lengthDist, 0.0, 1.0), 3.2);

    float alpha = thicknessFactor * lengthFactor * uPulse;

    // Color gradient: cyan-white core -> starlight cyan -> faint cosmic violet outer halo
    vec3 col = mix(uColorGlow, uColorMid, lengthFactor);
    col = mix(col, uColorCenter, pow(lengthFactor, 2.0) * (1.0 - thicknessDist));

    gl_FragColor = vec4(col, alpha);
  }
`;

// Soft radial glow shader for the flare core intersection
const CORE_FRAGMENT_SHADER = `
  uniform vec3 uColorCenter;
  uniform vec3 uColorGlow;
  uniform float uPulse;
  varying vec2 vUv;

  void main() {
    float dist = length(vUv - vec2(0.5)) * 2.0;
    float coreFactor = exp(-dist * 5.5);
    float glowFactor = exp(-dist * 2.2);

    float alpha = (coreFactor * 0.95 + glowFactor * 0.35) * uPulse;
    vec3 col = mix(uColorGlow, uColorCenter, clamp(1.0 - dist, 0.0, 1.0));

    gl_FragColor = vec4(col, alpha);
  }
`;

export default function CosmicCrossLight() {
  const groupRef = useRef<THREE.Group>(null);
  const hBeamRef = useRef<THREE.Mesh>(null);
  const vBeamRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);

  const isMobile = useIsMobile();
  const circleTexture = useMemo(() => getCircleTexture(), []);

  // Responsive scale and position in the open upper-right cosmic sky (away from text/nav)
  const flarePosition: [number, number, number] = isMobile
    ? [7.5, 12.5, -45]
    : [18.2, 11.0, -48];
  const flareScale = isMobile ? 0.55 : 0.95;
  const baseIntensity = isMobile ? 0.45 : 0.78;

  // Shared beam uniforms
  const beamUniforms = useMemo(
    () => ({
      uColorCenter: { value: new THREE.Color("#e0f2fe") }, // Starlight brilliant core
      uColorMid: { value: new THREE.Color("#38bdf8") },    // Subtle cyan-blue center
      uColorGlow: { value: new THREE.Color("#8154ff") },   // Faint cosmic violet outer glow
      uPulse: { value: baseIntensity },
    }),
    [baseIntensity]
  );

  const coreUniforms = useMemo(
    () => ({
      uColorCenter: { value: new THREE.Color("#f0f9ff") },
      uColorGlow: { value: new THREE.Color("#a78bfa") },
      uPulse: { value: baseIntensity },
    }),
    [baseIntensity]
  );

  // Tiny sparkling starlight particles near the flare intersection (pure deterministic coordinates)
  const particleData = useMemo(() => {
    const count = 8;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const cyanCol = new THREE.Color("#38bdf8");
    const violetCol = new THREE.Color("#a78bfa");

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + 0.35;
      const dist = 0.55 + (i % 3) * 0.42;

      positions[i * 3] = Math.cos(angle) * dist;
      positions[i * 3 + 1] = Math.sin(angle) * dist;
      positions[i * 3 + 2] = ((i % 5) - 2) * 0.08;

      const c = i % 2 === 0 ? cyanCol : violetCol;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    return { positions, colors };
  }, []);

  useFrame(({ clock }) => {
    const elapsed = clock.elapsedTime;
    // Slow, gentle astronomical breathing pulse
    const pulse = baseIntensity * (0.84 + 0.16 * Math.sin(elapsed * 0.85));

    if (hBeamRef.current) {
      const mat = hBeamRef.current.material as THREE.ShaderMaterial;
      if (mat.uniforms?.uPulse) mat.uniforms.uPulse.value = pulse;
    }
    if (vBeamRef.current) {
      const mat = vBeamRef.current.material as THREE.ShaderMaterial;
      if (mat.uniforms?.uPulse) mat.uniforms.uPulse.value = pulse;
    }
    if (coreRef.current) {
      const mat = coreRef.current.material as THREE.ShaderMaterial;
      if (mat.uniforms?.uPulse) mat.uniforms.uPulse.value = pulse;
    }

    // Extremely subtle drift of surrounding starlight particles
    if (particlesRef.current) {
      particlesRef.current.rotation.z = elapsed * 0.06;
    }
  });

  return (
    <group ref={groupRef} position={flarePosition} scale={flareScale}>
      {/* 1. Thin Horizontal Diffraction Beam */}
      <mesh ref={hBeamRef}>
        <planeGeometry args={[13.5, 0.16]} />
        <shaderMaterial
          vertexShader={BEAM_VERTEX_SHADER}
          fragmentShader={BEAM_FRAGMENT_SHADER}
          uniforms={beamUniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 2. Thin Vertical Diffraction Beam (rotated 90 deg) */}
      <mesh ref={vBeamRef} rotation={[0, 0, Math.PI / 2]}>
        <planeGeometry args={[13.5, 0.16]} />
        <shaderMaterial
          vertexShader={BEAM_VERTEX_SHADER}
          fragmentShader={BEAM_FRAGMENT_SHADER}
          uniforms={beamUniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 3. Luminous Intersection Core Halo */}
      <mesh ref={coreRef}>
        <planeGeometry args={[2.2, 2.2]} />
        <shaderMaterial
          vertexShader={BEAM_VERTEX_SHADER}
          fragmentShader={CORE_FRAGMENT_SHADER}
          uniforms={coreUniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 4. Tiny Micro-Particles near the Flare Center */}
      <points ref={particlesRef}>
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
          size={0.42}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          vertexColors
          transparent
          opacity={0.88}
        />
      </points>
    </group>
  );
}
