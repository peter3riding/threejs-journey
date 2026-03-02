import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import GUI from "lil-gui";
import { GLTFLoader, GLTF } from "three/addons/loaders/GLTFLoader.js";
import smokeVertexMaterial from "./shaders/shader-name/vertex.glsl";
import smokeFragmentMaterial from "./shaders/shader-name/fragment.glsl";

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector<HTMLCanvasElement>("canvas.webgl")!;

// Scene
const scene = new THREE.Scene();

// Loaders
const textureLoader = new THREE.TextureLoader();
const gltfLoader = new GLTFLoader();

// Perlin Texture
const perlinTexture = textureLoader.load("./perlin.png");
perlinTexture.wrapS = THREE.RepeatWrapping;
perlinTexture.wrapT = THREE.RepeatWrapping;

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

/**
 * Smoke
 */
const smokeGeometry = new THREE.PlaneGeometry(1, 1, 16, 64);
smokeGeometry.translate(0, 0.5, 0);
smokeGeometry.scale(1.5, 6, 1.5);

const smokeMaterial = new THREE.ShaderMaterial({
  vertexShader: smokeVertexMaterial,
  fragmentShader: smokeFragmentMaterial,
  wireframe: true,
  transparent: true,
  uniforms: {
    perlinTexture: new THREE.Uniform(perlinTexture),
    uTime: new THREE.Uniform(0),
  },
});

const smoke = new THREE.Mesh(smokeGeometry, smokeMaterial);
smoke.position.y = 1.83;
scene.add(smoke);

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  25,
  sizes.width / sizes.height,
  0.1,
  100,
);
camera.position.set(8, 10, 12);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.target.y = 3;
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
 * Resize handler (placed here so camera & renderer are already declared)
 */
window.addEventListener("resize", () => {
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

/**
 * Model
 */
gltfLoader.load("./bakedModel.glb", (gltf: GLTF) => {
  // Improve anisotropy on the baked texture (safe cast)
  const baked = gltf.scene.getObjectByName("baked") as THREE.Mesh | undefined;
  if (baked?.material) {
    const material = baked.material as
      | THREE.MeshBasicMaterial
      | THREE.MeshStandardMaterial;
    if (material.map) {
      material.map.anisotropy = 8;
    }
  }

  scene.add(gltf.scene);
});

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Smoke animation
  smokeMaterial.uniforms.uTime.value = elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
