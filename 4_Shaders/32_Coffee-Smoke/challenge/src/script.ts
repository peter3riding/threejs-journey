import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import GUI from "lil-gui";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import smokeVertexShader from "./shaders/coffee-smoke/vertex.glsl";
import smokeFragmentShader from "./shaders/coffee-smoke/fragment.glsl";

/**
 * Base
 */
// Debug
const gui = new GUI({ width: 340 });

// Canvas
const canvas = document.querySelector<HTMLCanvasElement>("canvas.webgl");
if (!canvas) throw new Error("Canvas not found");

// Scene
const scene = new THREE.Scene();

// Loaders
const textureLoader = new THREE.TextureLoader();
const gltfLoader = new GLTFLoader();

const perlinTexture = textureLoader.load("/perlin.png");
perlinTexture.wrapT = THREE.RepeatWrapping;
perlinTexture.wrapS = THREE.RepeatWrapping;

/**
 * Plane
 */
const planeGeometry = new THREE.PlaneGeometry(1, 1, 16, 64);
planeGeometry.translate(0, 0.5, 0);
planeGeometry.scale(1.5, 5, 2.5);
const planeMaterial = new THREE.ShaderMaterial({
  vertexShader: smokeVertexShader,
  fragmentShader: smokeFragmentShader,
  side: THREE.DoubleSide,
  transparent: true,
  // wireframe: true,
  depthWrite: false,
  uniforms: {
    uPerlinTexture: new THREE.Uniform(perlinTexture),
    uTime: new THREE.Uniform(0),
  },
});

const plane = new THREE.Mesh(planeGeometry, planeMaterial);

plane.position.y = 1.83;

scene.add(plane);

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
camera.position.x = 8;
camera.position.y = 10;
camera.position.z = 12;
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
 * Model
 */
gltfLoader.load("./bakedModel.glb", (gltf) => {
  const bakedMesh = gltf.scene.getObjectByName("baked") as THREE.Mesh;

  if (bakedMesh && bakedMesh.material instanceof THREE.MeshStandardMaterial) {
    bakedMesh.material.map!.anisotropy = 8;
  }

  scene.add(gltf.scene);
});

/**
 * Animate
 */

const clock = new THREE.Clock();
const tick = (): void => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Animation
  plane.material.uniforms.uTime.value = elapsedTime;

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
