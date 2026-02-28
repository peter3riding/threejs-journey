import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import GUI from "lil-gui";
import seaVertexShader from "./shaders/shader-name/vertex.glsl";
import seaFragmentShader from "./shaders/shader-name/fragment.glsl";

/**
 * Base
 */
// Debug
const gui = new GUI({ width: 340 });
const debugObject = {
  depthColor: "#186691",
  surfaceColor: "#9bd8ff",
};

// Canvas
const canvas = document.querySelector<HTMLCanvasElement>("canvas.webgl");
if (!canvas) throw new Error("Canvas not found");

// Scene
const scene = new THREE.Scene();

// Loaders
const textureLoader = new THREE.TextureLoader();

/**
 * Water
 */
// Geometry
const waterGeometry = new THREE.PlaneGeometry(2, 2, 128, 128);

// Material
const waterMaterial = new THREE.ShaderMaterial({
  vertexShader: seaVertexShader,
  fragmentShader: seaFragmentShader,
  uniforms: {
    uFrequency: new THREE.Uniform(3),
    uStrength: new THREE.Uniform(0.3),
    uTime: new THREE.Uniform(0),
    uSpeed: new THREE.Uniform(1),
    uDepthColor: new THREE.Uniform(new THREE.Color(debugObject.depthColor)),
    uSurfaceColor: new THREE.Uniform(new THREE.Color(debugObject.surfaceColor)),
    uSmallWavesElevation: new THREE.Uniform(0.1),
    uColorOffset: { value: 0.08 },
    uColorMultiplier: { value: 2.5 },
  },
});

// Mesh
const water = new THREE.Mesh(waterGeometry, waterMaterial);
water.rotation.x = -Math.PI * 0.5;
scene.add(water);

gui
  .add(waterMaterial.uniforms.uFrequency, "value")
  .min(0)
  .max(10)
  .step(0.1)
  .name("frequency");
gui
  .add(waterMaterial.uniforms.uStrength, "value")
  .min(0)
  .max(1)
  .step(0.001)
  .name("stength");
gui
  .add(waterMaterial.uniforms.uSpeed, "value")
  .min(0)
  .max(3)
  .step(0.001)
  .name("speed");
gui
  .add(waterMaterial.uniforms.uSmallWavesElevation, "value")
  .min(0)
  .max(1)
  .step(0.0001)
  .name("smallWavesElevation");
gui
  .add(waterMaterial.uniforms.uColorOffset, "value")
  .min(0)
  .max(1)
  .step(0.001)
  .name("uColorOffset");
gui
  .add(waterMaterial.uniforms.uColorMultiplier, "value")
  .min(0)
  .max(10)
  .step(0.001)
  .name("uColorMultiplier");

/**
 * Sizes
 */

interface Sizes {
  width: number;
  height: number;
}

const sizes: Sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", (): void => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
// const axesHelper = new THREE.AxesHelper(5);
// scene.add(axesHelper);
/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100,
);
camera.position.set(1, 1, 1);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();
const tick = (): void => {
  let elapsedTime = clock.getElapsedTime();

  // Animation
  waterMaterial.uniforms.uTime.value = elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
