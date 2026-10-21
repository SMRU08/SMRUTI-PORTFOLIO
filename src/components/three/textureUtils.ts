import * as THREE from "three";

let cachedCircleTexture: THREE.Texture | null = null;

/**
 * Generates an anti-aliased circular particle texture with smooth radial falloff.
 * Replaces square point sprites with perfectly round circular stars.
 */
export function getCircleTexture(): THREE.Texture {
  if (cachedCircleTexture) return cachedCircleTexture;

  if (typeof document === "undefined") {
    return new THREE.Texture();
  }

  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");

  if (!ctx) return new THREE.Texture();

  // Draw high-precision smooth circular star sprite with radiant optical core
  const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0.0, "rgba(255, 255, 255, 1.0)");
  grad.addColorStop(0.25, "rgba(255, 255, 255, 0.92)");
  grad.addColorStop(0.55, "rgba(255, 255, 255, 0.45)");
  grad.addColorStop(0.85, "rgba(255, 255, 255, 0.10)");
  grad.addColorStop(1.0, "rgba(255, 255, 255, 0.0)");

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 64, 64);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  texture.needsUpdate = true;

  cachedCircleTexture = texture;
  return texture;
}
