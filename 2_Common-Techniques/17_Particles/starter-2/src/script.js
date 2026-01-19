import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

/**
 * Particles
 */
// Geometry
const particlesGeometry = new THREE.BufferGeometry(1, 32, 32);

const count = 5000;

const vertecies = new Float32Array(count * 3);
const colors = new Float32Array(count * 3);

for (let i = 0; i < count; i++) {
  vertecies[i] = (Math.random() - 0.5) * 5;
  colors[i] = Math.random();
}

const positionsAttriute = new THREE.BufferAttribute(vertecies, 3);
const colorsAttribute = new THREE.BufferAttribute(colors, 3);
particlesGeometry.setAttribute("color", colorsAttribute);
particlesGeometry.setAttribute("position", positionsAttriute);

// Material
const particlesMaterial = new THREE.PointsMaterial({
  size: 0.02,
  sizeAttenuation: true,
  vertexColors: true,
});
// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

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
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

for (let i = 0; i < count; i++) {
  const i3 = i * 3;
  const x = particlesGeometry.attributes.position.array[i3 + 0];
  const y = particlesGeometry.attributes.position.array[i3 + 1];
  console.log(`Before: i3: ${i3}, x: ${x}, y: ${y}`);
  particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(x);
  console.log(`After: i3: ${i3}, x: ${x}, y: ${y}`);
}

particlesGeometry.attributes.position.needsUpdate = true;

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  //   for (let i = 0; i < count; i++) {
  //     const i3 = i * 3;
  //     const x = particlesGeometry.attributes.position.array[i3 + 0];
  //     const y = particlesGeometry.attributes.position.array[i3 + 1];
  //     console.log(`Before: i3: ${i3}, x: ${x}, y: ${y}`);
  //     particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(
  //       elapsedTime + x
  //     );
  //     console.log(`After: i3: ${i3}, x: ${x}, y: ${y}`);
  //   }

  //   particlesGeometry.attributes.position.needsUpdate = true;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
