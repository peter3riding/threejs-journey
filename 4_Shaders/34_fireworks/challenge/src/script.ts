import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import GUI from "lil-gui";
import gsap from "gsap";
import fireworksVertexShader from "./shaders/fireworks/vertex.glsl";
import fireworksFragmentShader from "./shaders/fireworks/fragment.glsl";

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

/**
 * Sizes
 */

interface Sizes {
  width: number;
  height: number;
  resolution?: THREE.Vector2;
  pixelRatio: number;
}

const sizes: Sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
  pixelRatio: Math.min(window.devicePixelRatio, 2),
};
sizes.resolution = new THREE.Vector2(sizes.width, sizes.height);

window.addEventListener("resize", (): void => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  sizes.pixelRatio = Math.min(window.devicePixelRatio, 2);
  sizes.resolution?.set(
    sizes.width * sizes.pixelRatio,
    sizes.height * sizes.pixelRatio,
  );

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(sizes.pixelRatio);
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
camera.position.set(1.5, 0, 6);
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
renderer.setPixelRatio(sizes.pixelRatio);

/**
 * Fireworks
 */

// Use loadAsync so everything is ready before creating points
const textures = [
  textureLoader.load("./particles/1.png"),
  textureLoader.load("./particles/2.png"),
  textureLoader.load("./particles/3.png"),
  textureLoader.load("./particles/4.png"),
  textureLoader.load("./particles/5.png"),
  textureLoader.load("./particles/6.png"),
  textureLoader.load("./particles/7.png"),
  textureLoader.load("./particles/8.png"),
];

function createFirework(
  count: number,
  position: THREE.Vector3,
  size: number,
  texture: THREE.Texture,
  radius: number,
  color: THREE.Color,
): void {
  const positions = new Float32Array(count * 3);
  const sizesArray = new Float32Array(count);
  const timeMultiplierArray = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;

    const spherical = new THREE.Spherical(
      radius * (0.75 + Math.random() * 0.25),
      Math.random() * Math.PI,
      Math.random() * Math.PI * 2,
    );
    const position = new THREE.Vector3();
    position.setFromSpherical(spherical);

    positions[i3 + 0] = position.x;
    positions[i3 + 1] = position.y;
    positions[i3 + 2] = position.z;

    sizesArray[i] = Math.random();

    timeMultiplierArray[i] = 1 + Math.random();
  }

  const pointGeometry = new THREE.BufferGeometry();
  pointGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3),
  );
  pointGeometry.setAttribute("aSize", new THREE.BufferAttribute(sizesArray, 1));
  pointGeometry.setAttribute(
    "aTimeMultiplyer",
    new THREE.BufferAttribute(timeMultiplierArray, 1),
  );

  // Material
  texture.flipY = false;
  const pointsMaterial = new THREE.ShaderMaterial({
    vertexShader: fireworksVertexShader,
    fragmentShader: fireworksFragmentShader,
    uniforms: {
      uSize: new THREE.Uniform(size),
      uResolution: new THREE.Uniform(sizes.resolution),
      uTexture: new THREE.Uniform(texture),
      uColor: new THREE.Uniform(color),
      uProgress: new THREE.Uniform(0),
    },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    toneMapped: false,
  });

  const firework = new THREE.Points(pointGeometry, pointsMaterial);
  scene.add(firework);

  // Destroy
  const destroy = () => {
    scene.remove(firework);
    pointGeometry.dispose();
    pointsMaterial.dispose();
  };

  // Animate
  gsap.to(pointsMaterial.uniforms.uProgress, {
    value: 1,
    duration: 11,
    ease: "linear",
    onComplete: destroy,
  });
}

createFirework(
  100,
  new THREE.Vector3(0, 0, 0),
  0.5,
  textures[7],
  1,
  new THREE.Color("#8affff"),
);

window.addEventListener("click", () => {
  createFirework(
    100,
    new THREE.Vector3(0, 0, 0),
    0.5,
    textures[7],
    1,
    new THREE.Color("#8affff"),
  );
});

/**
 * Animate
 */
const tick = (): void => {
  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
