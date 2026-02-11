import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import GUI from "lil-gui";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import type { GLTF } from "three/addons/loaders/GLTFLoader.js";

import holographicVertexShader from "./shaders/holographic/vertex.glsl";
import holographicFragmentShader from "./shaders/holographic/fragment.glsl";

/**
 * Base
 */
const gui = new GUI();

// Canvas
const canvas = document.querySelector<HTMLCanvasElement>("canvas.webgl");
if (!canvas) throw new Error("Canvas not found");

// Scene
const scene = new THREE.Scene();

// Loaders
const gltfLoader = new GLTFLoader();

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

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(
  25,
  sizes.width / sizes.height,
  0.1,
  100,
);
camera.position.set(7, 7, 7);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
interface RendererParameters {
  clearColor: string;
}

const rendererParameters: RendererParameters = {
  clearColor: "#1d1f2a",
};

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
});

renderer.setClearColor(rendererParameters.clearColor);
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

gui.add(rendererParameters, "clearColor").onChange(() => {
  renderer.setClearColor(rendererParameters.clearColor);
});

// Resize listener (moved here so camera/renderer exist)
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Material
 */
interface MaterialParameters {
  color: string;
}

const materialParameters: MaterialParameters = {
  color: "#70c1ff",
};

const material = new THREE.ShaderMaterial({
  vertexShader: holographicVertexShader,
  fragmentShader: holographicFragmentShader,
  uniforms: {
    uTime: new THREE.Uniform(0),
    uColor: new THREE.Uniform(new THREE.Color(materialParameters.color)),
  },
  transparent: true,
  side: THREE.DoubleSide,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
});

gui.add(materialParameters, "color").onChange((value: string) => {
  material.uniforms.uColor.value.set(value);
});

/**
 * Objects
 */
const torusKnot = new THREE.Mesh(
  new THREE.TorusKnotGeometry(0.6, 0.25, 128, 32),
  material,
);
torusKnot.position.x = 3;
scene.add(torusKnot);

const sphere = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 64), material);
sphere.position.x = -3;
scene.add(sphere);

// Suzanne
let suzanne: THREE.Object3D | null = null; // ← Use Object3D instead of Group

gltfLoader.load("./suzanne.glb", (gltf: GLTF) => {
  suzanne = gltf.scene;

  suzanne.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.material = material;
    }
  });

  scene.add(suzanne);
});

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  material.uniforms.uTime.value = elapsedTime;

  const rotationSpeed = elapsedTime * 0.2;

  sphere.rotation.x = -rotationSpeed * 0.5;
  sphere.rotation.y = rotationSpeed;

  torusKnot.rotation.x = -rotationSpeed * 0.5;
  torusKnot.rotation.y = rotationSpeed;

  // Local variable + Object3D type = no more null / isGroup errors
  if (suzanne) {
    const model = suzanne;
    model.rotation.x = -rotationSpeed * 0.5;
    model.rotation.y = rotationSpeed;
  }

  controls.update();
  renderer.render(scene, camera);

  requestAnimationFrame(tick);
};

tick();
