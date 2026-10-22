"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { useScrollProgress } from "@/hooks/useScrollProgress";

// Bilateral Galaxy-Synchronized Procedural Simplex fBm Shader
// Completely clears the central corridor behind hero text (name, headline, tagline, buttons)
// and anchors cosmic clouds around the left & right flanks of the rotating galaxy.
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
  uniform vec3 uColorVoid;
  uniform vec3 uColorCyan;
  uniform vec3 uColorViolet;
  uniform vec3 uColorAccent;
  varying vec2 vUv;

  // Lightweight 2D Simplex noise
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
    f += 0.5000 * snoise(p); p *= 2.02;
    f += 0.2500 * snoise(p); p *= 2.03;
    f += 0.1250 * snoise(p);
    return f;
  }

  // 2D Rotation Helper
  vec2 rotate2D(vec2 coord, float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return vec2(coord.x * c - coord.y * s, coord.x * s + coord.y * c);
  }

  void main() {
    // Aspect-compensated normalized coordinates centered at (0, 0)
    vec2 p = vUv * 2.0 - 1.0;
    p.x *= 1.62; // Screen aspect ratio expansion

    // -------------------------------------------------------------
    // REQUIREMENT 1: REMOVE CLOUDS FROM BEHIND NAME & HERO CONTENT
    // Elliptical exclusion corridor precisely framing the Hero text column
    // (Smruti Ranjan Nayak, title, tagline, CTA buttons).
    // In this central region, textClearMask is strictly 0.0.
    // -------------------------------------------------------------
    vec2 textCorridor = vec2(p.x * 1.58, (p.y - 0.04) * 1.22);
    float centerDistance = length(textCorridor);
    float textClearMask = smoothstep(0.38, 0.78, centerDistance);

    // -------------------------------------------------------------
    // REQUIREMENT 2 & 3: BILATERAL CLOUDS POSITIONED AROUND GALAXY
    // AND SYNCHRONIZED WITH GALAXY'S ANGULAR MOMENTUM
    // -------------------------------------------------------------
    // Synchronized orbital drift tied to galaxy rotation
    float rotAngle = uGalaxyRotation * 0.45;
    float timeDrift = uTime * 0.022;

    // A) Western (Left) Cloud Cluster - frames the galaxy's left spiral wing
    vec2 leftOrigin = vec2(-0.82, 0.08);
    vec2 pLeft = p - leftOrigin;
    vec2 pLeftRotated = rotate2D(pLeft, rotAngle * 0.5) * 1.25;
    vec2 driftL = vec2(timeDrift * 0.28, timeDrift * 0.14);
    float nL1 = fbm(pLeftRotated + driftL);
    float nL2 = fbm(pLeftRotated * 1.72 - driftL * 0.65 + vec2(nL1 * 0.42));
    float leftDensity = smoothstep(-0.20, 0.74, nL2) * exp(-length(pLeft) * 1.45);

    // B) Eastern (Right) Cloud Cluster - frames the galaxy's right spiral wing
    vec2 rightOrigin = vec2(0.85, -0.06);
    vec2 pRight = p - rightOrigin;
    vec2 pRightRotated = rotate2D(pRight, -rotAngle * 0.45) * 1.22;
    vec2 driftR = vec2(-timeDrift * 0.24, timeDrift * 0.35);
    float nR1 = fbm(pRightRotated + driftR);
    float nR2 = fbm(pRightRotated * 1.68 - driftR * 0.70 + vec2(nR1 * 0.38));
    float rightDensity = smoothstep(-0.22, 0.72, nR2) * exp(-length(pRight) * 1.40);

    // Combine bilateral clouds
    float combinedDensity = leftDensity + rightDensity;

    // Apply strict text clearance: clouds ONLY emerge outside the hero text corridor
    combinedDensity *= textClearMask;

    // Soft outer celestial border vignette: smoothly melts edges into dark space
    float outerVignette = 1.0 - smoothstep(0.70, 1.35, length(p * vec2(0.88, 1.05)));
    combinedDensity *= outerVignette;

    // Core filaments (brighter starlight ribbons weaving through the clouds)
    float coreFactor = smoothstep(0.24, 0.85, combinedDensity * 1.4);

    // -------------------------------------------------------------
    // VISUAL STYLE & COLOR HARMONY
    // Deep midnight space -> delicate starlight cyan -> cosmic violet accents
    // -------------------------------------------------------------
    vec3 color = uColorVoid;
    color = mix(color, uColorCyan, clamp(combinedDensity * 0.82, 0.0, 1.0));
    color = mix(color, uColorViolet, clamp(combinedDensity * 0.65, 0.0, 1.0));
    color = mix(color, uColorAccent, clamp(coreFactor * 0.45, 0.0, 1.0));

    // Final translucent alpha modulated by Hero scroll progress
    float alpha = (combinedDensity * 0.48 + coreFactor * 0.26) * uOpacity;
    gl_FragColor = vec4(color, alpha);
  }
`;

export default function CosmicNebula() {
  const meshRef = useRef<THREE.Mesh>(null);
  const isMobile = useIsMobile();
  const scrollProgress = useScrollProgress();
  const galaxyAngleRef = useRef(0);
  const smoothScrollRef = useRef(0);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uGalaxyRotation: { value: 0 },
      uScrollProgress: { value: 0 },
      uOpacity: { value: isMobile ? 0.42 : 0.62 },
      uColorVoid: { value: new THREE.Color("#03050c") },
      uColorCyan: { value: new THREE.Color("#0c4a6e") },    // Soft starlight cyan
      uColorViolet: { value: new THREE.Color("#6b21a8") },  // Deep cosmic violet
      uColorAccent: { value: new THREE.Color("#8154ff") },  // Delicate violet filament highlight
    }),
    [isMobile]
  );

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const dt = Math.min(delta, 0.05);

    // 1. Synchronize with galaxy rotation (dt * 0.022 matches GalaxyParticles.tsx)
    galaxyAngleRef.current += dt * 0.022;

    // 2. Read scroll progress & compute Hero-only fade
    // GalaxyParticles Hero fade-out formula:
    // fadeOut = sp < 0.14 ? 1 : sp > 0.2 ? 0 : 1 - (sp - 0.14) / 0.06
    const sp = scrollProgress.current;
    const heroFade = sp < 0.14 ? 1 : sp > 0.2 ? 0 : 1 - (sp - 0.14) / 0.06;

    // Home Page Only: when scrolled past Home hero (sp >= 0.20), hide completely
    const isVisible = heroFade > 0.005;
    meshRef.current.visible = isVisible;
    if (!isVisible) return;

    // Smooth scroll interpolation for seamless depth reaction
    smoothScrollRef.current += (sp - smoothScrollRef.current) * 0.1;
    const currentScroll = smoothScrollRef.current;

    // 3. Update shader uniforms
    const mat = meshRef.current.material as THREE.ShaderMaterial;
    if (mat && mat.uniforms) {
      mat.uniforms.uTime.value += dt;
      mat.uniforms.uGalaxyRotation.value = galaxyAngleRef.current;
      mat.uniforms.uScrollProgress.value = currentScroll;
      mat.uniforms.uOpacity.value = (isMobile ? 0.42 : 0.62) * heroFade;
    }

    // 4. Parallax Depth Movement connected to Page Scrolling:
    // As the camera travels forward into the galaxy during hero scroll,
    // clouds subtly expand outward along X and shift gently along Z,
    // creating a cohesive feeling of flying through one continuous cosmic scene.
    // When scrolling back up, they naturally return to their rest positions.
    const scrollExpansion = 1.0 + currentScroll * 1.8;
    meshRef.current.scale.set(scrollExpansion, scrollExpansion, 1.0);
    meshRef.current.position.set(0, -currentScroll * 4.0, -85 - currentScroll * 12.0);
  });

  return (
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
  );
}
