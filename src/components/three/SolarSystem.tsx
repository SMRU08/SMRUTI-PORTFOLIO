"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { projects } from "@/lib/constants";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { useQuality } from "@/hooks/useQuality";

const CX = 30;
const CY = 0;
const CZ = 0;
const SUN_POS = new THREE.Vector3(CX, CY, CZ);

// Shared planet positions — read by ScrollCamera to smoothly track projects
export const planetPositions: THREE.Vector3[] = [
  new THREE.Vector3(),
  new THREE.Vector3(),
  new THREE.Vector3(),
  new THREE.Vector3(),
];

// ===================== CINEMATIC STELLAR SURFACE SHADER =====================
const starSurfaceVert = /* glsl */ `
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWorldPos;
void main() {
  vUv = uv;
  vNormal = normalize(mat3(modelMatrix) * normal);
  vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const starSurfaceFrag = /* glsl */ `
uniform sampler2D uTexture;
uniform float uTime;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWorldPos;

void main() {
  vec2 uv = vUv;
  // Convective surface turbulence
  vec2 offset1 = vec2(sin(uv.y * 18.0 + uTime * 0.15), cos(uv.x * 18.0 + uTime * 0.12)) * 0.015;
  vec2 offset2 = vec2(cos(uv.y * 32.0 - uTime * 0.2), sin(uv.x * 32.0 + uTime * 0.18)) * 0.008;
  vec3 texColor = texture2D(uTexture, uv + offset1 + offset2).rgb;

  // Physical solar limb darkening: center is brightest, edges fall off into deep amber
  vec3 viewDir = normalize(cameraPosition - vWorldPos);
  float mu = max(dot(vNormal, viewDir), 0.0);
  float limbDarkening = 0.35 + 0.65 * pow(mu, 0.7);

  // Core chromatic gradient: hot gold core, amber midtone, deep crimson edge
  vec3 coreColor = vec3(1.0, 0.88, 0.62) * 1.8;
  vec3 midColor = vec3(0.98, 0.52, 0.12);
  vec3 rimColor = vec3(0.75, 0.18, 0.04);

  vec3 surfaceColor = mix(midColor, coreColor, pow(mu, 1.2)) * texColor * 1.4;
  surfaceColor = mix(rimColor, surfaceColor, limbDarkening);

  // Soft organic pulse
  float pulse = 0.96 + 0.04 * sin(uTime * 0.8);
  gl_FragColor = vec4(surfaceColor * pulse, 1.0);
}
`;

// ===================== VOLUMETRIC CORONA SHADER =====================
const coronaVert = /* glsl */ `
varying vec3 vWorldPos;
varying vec3 vNormal;
void main() {
  vNormal = normalize(mat3(modelMatrix) * normal);
  vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const coronaFrag = /* glsl */ `
uniform vec3 uCenterPos;
uniform vec3 uCameraPos;
uniform float uInnerRadius;
uniform float uOuterRadius;
uniform float uTime;
varying vec3 vWorldPos;
varying vec3 vNormal;

void main() {
  vec3 viewDir = normalize(vWorldPos - uCameraPos);
  vec3 normal = normalize(vNormal);
  
  // Smooth limb grazing factor
  float rim = 1.0 - abs(dot(viewDir, normal));
  rim = pow(rim, 2.0);

  // Continuous exponential radial decay (no hard ring boundary)
  float dist = length(vWorldPos - uCenterPos);
  float normDist = clamp((dist - uInnerRadius) / (uOuterRadius - uInnerRadius), 0.0, 1.0);
  float radialFalloff = exp(-normDist * 3.8);

  // Subtle plasma turbulence
  float stream = sin(atan(vWorldPos.z - uCenterPos.z, vWorldPos.x - uCenterPos.x) * 8.0 + uTime * 0.3) * 0.08;
  float intensity = (rim * 0.6 + radialFalloff * 0.7 + stream) * radialFalloff;

  vec3 innerTint = vec3(1.0, 0.82, 0.45);
  vec3 outerTint = vec3(0.85, 0.32, 0.06);
  vec3 color = mix(outerTint, innerTint, radialFalloff);

  gl_FragColor = vec4(color, clamp(intensity * 0.45, 0.0, 0.85));
}
`;

// ===================== EARTH ATMOSPHERE SHADERS =====================
const earthVert = /* glsl */ `
varying vec2 vUv;
varying vec3 vWorldNormal;
varying vec3 vWorldPos;
void main() {
  vUv = uv;
  vWorldNormal = normalize(mat3(modelMatrix) * normal);
  vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const earthFrag = /* glsl */ `
uniform sampler2D uDayMap;
uniform sampler2D uNightMap;
uniform vec3 uSunPos;
uniform vec3 uCameraPos;
varying vec2 vUv;
varying vec3 vWorldNormal;
varying vec3 vWorldPos;

void main() {
  vec3 normal = normalize(vWorldNormal);
  vec3 sunDir = normalize(uSunPos - vWorldPos);
  vec3 viewDir = normalize(uCameraPos - vWorldPos);

  float sunDot = dot(normal, sunDir);
  // Smooth twilight transition band
  float dayFactor = smoothstep(-0.15, 0.25, sunDot);

  vec3 dayColor = texture2D(uDayMap, vUv).rgb;
  
  // Ambient celestial starlight fill ensures continents and oceans are always visible at all distances
  float ambientStarlight = 0.30;
  float diffuse = max(sunDot, 0.0);
  vec3 litDay = dayColor * (ambientStarlight + (1.0 - ambientStarlight) * diffuse);

  // Night lights: glowing city lights + subtle nocturnal ocean ambient
  vec3 nightLights = texture2D(uNightMap, vUv).rgb * 2.2;
  vec3 nightGlow = dayColor * vec3(0.08, 0.14, 0.22);
  vec3 nightSide = (nightLights + nightGlow) * (1.0 - dayFactor);

  // Specular reflection on water
  vec3 halfDir = normalize(sunDir + viewDir);
  float spec = pow(max(dot(normal, halfDir), 0.0), 32.0);
  vec3 oceanSpec = vec3(0.7, 0.85, 1.0) * spec * dayFactor * 0.35;

  // Atmospheric scattering rim
  float rim = pow(1.0 - max(dot(viewDir, normal), 0.0), 2.8);
  vec3 atmosGlow = vec3(0.35, 0.65, 1.0) * rim * 0.45;

  // Twilight horizon scattering (warm sunset gold along the terminator)
  float terminator = smoothstep(0.22, 0.0, abs(sunDot));
  vec3 twilightGlow = vec3(1.0, 0.45, 0.18) * terminator * rim * 0.45;

  vec3 finalColor = litDay + nightSide + oceanSpec + atmosGlow + twilightGlow;
  gl_FragColor = vec4(finalColor, 1.0);
}
`;

const cloudVert = /* glsl */ `
varying vec2 vUv;
varying vec3 vWorldNormal;
varying vec3 vWorldPos;
void main() {
  vUv = uv;
  vWorldNormal = normalize(mat3(modelMatrix) * normal);
  vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const cloudFrag = /* glsl */ `
uniform sampler2D uCloudMap;
uniform vec3 uSunPos;
varying vec2 vUv;
varying vec3 vWorldNormal;
varying vec3 vWorldPos;

void main() {
  float clouds = texture2D(uCloudMap, vUv).r;
  vec3 sunDir = normalize(uSunPos - vWorldPos);
  float sunDot = max(dot(normalize(vWorldNormal), sunDir), 0.0);
  float sunFacing = smoothstep(-0.25, 0.35, dot(normalize(vWorldNormal), sunDir));

  // Volumetric cloud shading with ambient space starlight
  vec3 cloudColor = vec3(0.98, 0.99, 1.0) * (0.28 + 0.72 * sunDot);
  gl_FragColor = vec4(cloudColor, clouds * 0.58 * (0.35 + 0.65 * sunFacing));
}
`;

// ===================== CINEMATIC PLANET CONFIGS =====================
interface PlanetConfig {
  orbitRadius: number;
  orbitSpeed: number;
  size: number;
  texture: string;
  atmosphereColor: string;
  twilightColor: string;
  tilt: number;
  hasRing: boolean;
  isEarth: boolean;
}

const PLANET_CONFIGS: PlanetConfig[] = [
  {
    orbitRadius: 6.2,
    orbitSpeed: 0.09,
    size: 1.25,
    texture: "/textures/2k_earth_daymap.webp",
    atmosphereColor: "#4ca6ff",
    twilightColor: "#ff7733",
    tilt: 0.41,
    hasRing: false,
    isEarth: true,
  },
  {
    orbitRadius: 10.2,
    orbitSpeed: 0.055,
    size: 1.05,
    texture: "/textures/2k_mars.webp",
    atmosphereColor: "#ff7043",
    twilightColor: "#d84315",
    tilt: 0.44,
    hasRing: false,
    isEarth: false,
  },
  {
    orbitRadius: 15.5,
    orbitSpeed: 0.032,
    size: 1.75,
    texture: "/textures/2k_jupiter.webp",
    atmosphereColor: "#e0b080",
    twilightColor: "#b27340",
    tilt: 0.05,
    hasRing: false,
    isEarth: false,
  },
  {
    orbitRadius: 21.0,
    orbitSpeed: 0.02,
    size: 1.45,
    texture: "/textures/2k_saturn.webp",
    atmosphereColor: "#eedd99",
    twilightColor: "#c29b46",
    tilt: 0.47,
    hasRing: true,
    isEarth: false,
  },
];

// ===================== CINEMATIC CENTRAL STAR =====================
function CentralStar() {
  const meshRef = useRef<THREE.Mesh>(null);
  const surfaceMatRef = useRef<THREE.ShaderMaterial>(null);
  const coronaRef = useRef<THREE.ShaderMaterial>(null);
  const sunTexture = useTexture("/textures/2k_sun.webp");
  const { camera } = useThree();
  const q = useQuality();

  useEffect(() => () => { sunTexture.dispose(); }, [sunTexture]);

  useFrame(({ clock }) => {
    const elapsed = clock.elapsedTime;
    if (meshRef.current) meshRef.current.rotation.y = elapsed * 0.018;
    if (surfaceMatRef.current) surfaceMatRef.current.uniforms.uTime.value = elapsed;
    if (coronaRef.current) {
      coronaRef.current.uniforms.uCameraPos.value.copy(camera.position);
      coronaRef.current.uniforms.uTime.value = elapsed;
    }
  });

  return (
    <group position={[CX, CY, CZ]}>
      {/* Dynamic Stellar Core */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[2.0, q.sphereSegments, q.sphereSegments]} />
        <shaderMaterial
          ref={surfaceMatRef}
          vertexShader={starSurfaceVert}
          fragmentShader={starSurfaceFrag}
          uniforms={{
            uTexture: { value: sunTexture },
            uTime: { value: 0 },
          }}
        />
      </mesh>

      {/* Volumetric Corona Atmospheric Glow */}
      <mesh>
        <sphereGeometry args={[5.2, q.sphereSegments, q.sphereSegments]} />
        <shaderMaterial
          ref={coronaRef}
          vertexShader={coronaVert}
          fragmentShader={coronaFrag}
          uniforms={{
            uCenterPos: { value: new THREE.Vector3(CX, CY, CZ) },
            uCameraPos: { value: new THREE.Vector3() },
            uInnerRadius: { value: 1.9 },
            uOuterRadius: { value: 5.2 },
            uTime: { value: 0 },
          }}
          transparent
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

// ===================== SUBTLE CELESTIAL ORBIT TRACK =====================
function OrbitDustRing({ radius }: { radius: number }) {
  const q = useQuality();
  const line = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const segments = q.orbitRingPoints;
    for (let i = 0; i <= segments; i++) {
      const a = (i / segments) * Math.PI * 2;
      pts.push(
        new THREE.Vector3(
          CX + Math.cos(a) * radius,
          CY,
          CZ + Math.sin(a) * radius
        )
      );
    }
    const geom = new THREE.BufferGeometry().setFromPoints(pts);
    // Subtle, ethereal orbital dust trace (not an arcade track)
    const mat = new THREE.LineBasicMaterial({
      color: "#6b82a8",
      transparent: true,
      opacity: 0.025,
    });
    const obj = new THREE.Line(geom, mat);
    obj.userData.dispose = () => {
      geom.dispose();
      mat.dispose();
    };
    return obj;
  }, [radius, q.orbitRingPoints]);

  useEffect(() => {
    return () => {
      line.userData.dispose?.();
    };
  }, [line]);

  return <primitive object={line} />;
}

// ===================== EARTH CLOUDS =====================
function EarthClouds({ size, tilt }: { size: number; tilt: number }) {
  const cloudRef = useRef<THREE.Mesh>(null);
  const cloudTexture = useTexture("/textures/2k_earth_clouds.webp");
  const q = useQuality();

  useEffect(() => () => { cloudTexture.dispose(); }, [cloudTexture]);

  useFrame(({ clock }) => {
    if (cloudRef.current) cloudRef.current.rotation.y = clock.elapsedTime * 0.009;
  });

  return (
    <mesh ref={cloudRef} rotation={[tilt, 0, 0]}>
      <sphereGeometry args={[size * 1.014, q.sphereSegments, q.sphereSegments]} />
      <shaderMaterial
        vertexShader={cloudVert}
        fragmentShader={cloudFrag}
        uniforms={{
          uCloudMap: { value: cloudTexture },
          uSunPos: { value: SUN_POS },
        }}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}

// ===================== SATURN DUST RINGS =====================
function SaturnRing({ size }: { size: number }) {
  const ringTexture = useTexture("/textures/2k_saturn_ring_alpha.webp");
  const q = useQuality();

  useEffect(() => () => { ringTexture.dispose(); }, [ringTexture]);

  return (
    <mesh rotation={[Math.PI * 0.44, 0, 0]}>
      <ringGeometry args={[size * 1.35, size * 2.35, q.orbitRingPoints]} />
      <meshStandardMaterial
        map={ringTexture}
        alphaMap={ringTexture}
        transparent
        opacity={0.88}
        side={THREE.DoubleSide}
        depthWrite={false}
        roughness={0.65}
        metalness={0.02}
      />
    </mesh>
  );
}

// ===================== EARTH PLANET =====================
function EarthPlanet({
  config,
  index,
}: {
  config: PlanetConfig;
  index: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const planetRef = useRef<THREE.Mesh>(null);
  const earthMatRef = useRef<THREE.ShaderMaterial>(null);
  const { camera } = useThree();
  const q = useQuality();

  const dayMap = useTexture(config.texture);
  const nightMap = useTexture("/textures/2k_earth_nightmap.webp");

  useEffect(() => () => { dayMap.dispose(); }, [dayMap]);
  useEffect(() => () => { nightMap.dispose(); }, [nightMap]);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const angle =
      clock.elapsedTime * config.orbitSpeed +
      (index * (Math.PI * 2)) / projects.length;
    groupRef.current.position.x = CX + Math.cos(angle) * config.orbitRadius;
    groupRef.current.position.y = CY + Math.sin(angle * 0.4) * 0.25;
    groupRef.current.position.z = CZ + Math.sin(angle) * config.orbitRadius;

    if (index < planetPositions.length) {
      planetPositions[index].copy(groupRef.current.position);
    }
    if (planetRef.current) planetRef.current.rotation.y += 0.0035;
    if (earthMatRef.current) {
      earthMatRef.current.uniforms.uCameraPos.value.copy(camera.position);
    }
  });

  return (
    <group ref={groupRef}>
      <mesh ref={planetRef} rotation={[config.tilt, 0, 0]}>
        <sphereGeometry
          args={[config.size, q.sphereSegments, q.sphereSegments]}
        />
        <shaderMaterial
          ref={earthMatRef}
          vertexShader={earthVert}
          fragmentShader={earthFrag}
          uniforms={{
            uDayMap: { value: dayMap },
            uNightMap: { value: nightMap },
            uSunPos: { value: SUN_POS },
            uCameraPos: { value: new THREE.Vector3() },
          }}
        />
      </mesh>
      {q.showClouds && <EarthClouds size={config.size} tilt={config.tilt} />}
    </group>
  );
}

// ===================== CINEMATIC ATMOSPHERIC PLANET =====================
function AtmosphericPlanet({
  config,
  index,
}: {
  config: PlanetConfig;
  index: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const planetRef = useRef<THREE.Mesh>(null);
  const q = useQuality();
  const mainTexture = useTexture(config.texture);

  useEffect(() => () => { mainTexture.dispose(); }, [mainTexture]);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const angle =
      clock.elapsedTime * config.orbitSpeed +
      (index * (Math.PI * 2)) / projects.length;
    groupRef.current.position.x = CX + Math.cos(angle) * config.orbitRadius;
    groupRef.current.position.y = CY + Math.sin(angle * 0.4) * 0.25;
    groupRef.current.position.z = CZ + Math.sin(angle) * config.orbitRadius;

    if (index < planetPositions.length) {
      planetPositions[index].copy(groupRef.current.position);
    }
    if (planetRef.current) planetRef.current.rotation.y += 0.003;
  });

  return (
    <group ref={groupRef}>
      <mesh ref={planetRef} rotation={[config.tilt, 0, 0]}>
        <sphereGeometry
          args={[config.size, q.sphereSegments, q.sphereSegments]}
        />
        <meshStandardMaterial
          map={mainTexture}
          roughness={0.62}
          metalness={0.02}
        />
      </mesh>

      {/* Atmospheric Rim Scattering */}
      <mesh rotation={[config.tilt, 0, 0]}>
        <sphereGeometry
          args={[config.size * 1.018, q.sphereSegments, q.sphereSegments]}
        />
        <meshBasicMaterial
          color={config.atmosphereColor}
          transparent
          opacity={0.18}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {config.hasRing && <SaturnRing size={config.size} />}
    </group>
  );
}

// ===================== SOLAR SYSTEM ROOT =====================
export default function SolarSystem() {
  const groupRef = useRef<THREE.Group>(null);
  const scrollProgress = useScrollProgress();

  useFrame(() => {
    if (!groupRef.current) return;
    const p = scrollProgress.current;
    const fadeIn = p < 0.16 ? 0 : p < 0.2 ? (p - 0.16) / 0.04 : 1;
    const fadeOut = p < 0.88 ? 1 : p > 0.96 ? 0 : 1 - (p - 0.88) / 0.08;
    const visibility = fadeIn * fadeOut;
    groupRef.current.scale.setScalar(visibility);
    groupRef.current.visible = visibility > 0.01;
  });

  return (
    <group ref={groupRef}>
      {/* Brilliant Omnidirectional Stellar Light with gradual decay so outer planets receive warm sunlight */}
      <pointLight
        position={[CX, CY, CZ]}
        intensity={9}
        color="#fff3e2"
        distance={160}
        decay={0.4}
      />
      {/* Sun Directional Key Light — provides crisp surface highlights across all planets */}
      <directionalLight
        position={[CX, CY + 5, CZ]}
        intensity={2.6}
        color="#fff1db"
      />
      {/* Celestial Ambient Light — guarantees that the unlit/night side of every planet is never pitch-black */}
      <ambientLight color="#94a3b8" intensity={0.36} />
      {/* Deep Space Cosmic Fill Light — simulates starlight and diffuse nebula scattering */}
      <hemisphereLight
        args={["#60a5fa", "#0f172a", 0.40]}
      />

      {/* Cinematic Central Star */}
      <CentralStar />

      {/* Orbit Traces */}
      {PLANET_CONFIGS.map((c, i) => (
        <OrbitDustRing key={`orbit-${i}`} radius={c.orbitRadius} />
      ))}

      {/* Projects Celestial Destinations */}
      {projects.map((p, i) => {
        const config = PLANET_CONFIGS[i] || PLANET_CONFIGS[0];
        return config.isEarth ? (
          <EarthPlanet key={p.id} config={config} index={i} />
        ) : (
          <AtmosphericPlanet key={p.id} config={config} index={i} />
        );
      })}
    </group>
  );
}
