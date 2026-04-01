import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import GUI from "lil-gui";
import gsap from "gsap";
console.log("ok");
import particlesVertexShader from "./shaders/particles/vertex.glsl";
import particlesFragmentShader from "./shaders/particles/fragment.glsl";

/**
 * Base
 */
// Debug
const gui = new GUI({ width: 340 });
const debugObject = {};

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Loaders
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("./draco/");
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
  pixelRatio: Math.min(window.devicePixelRatio, 2),
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  sizes.pixelRatio = Math.min(window.devicePixelRatio, 2);

  // Materials
  if (particles)
    particles.material.uniforms.uResolution.value.set(
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
  35,
  sizes.width / sizes.height,
  0.1,
  100,
);
camera.position.set(0, 0, 8 * 2);
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

debugObject.clearColor = "#160920";
gui.addColor(debugObject, "clearColor").onChange(() => {
  renderer.setClearColor(debugObject.clearColor);
});
renderer.setClearColor(debugObject.clearColor);

let particles = null;
/**
 * Particles
 */
gltfLoader.load("./models.glb", (gltf) => {
  const particles = {};

  particles.models = gltf.scene.children.map((model) => model);

  let maxCount = 0;

  for (let model of particles.models) {
    const count = model.geometry.attributes.position.count;
    if (count > maxCount) maxCount = count;
    console.log(count);
  }
  console.log(maxCount);
  let customModels = [];
  for (let model of particles.models) {
    const currentModelPositons = model.geometry.attributes.position.array;
    let newPositions = new Float32Array(maxCount * 3);
    for (let i = 0; i < maxCount; i++) {
      const i3 = i * 3;
      const currentCount = model.geometry.attributes.position.count;
      if (i < currentCount) {
        newPositions[i3 + 0] = currentModelPositons[i3 + 0];
        newPositions[i3 + 1] = currentModelPositons[i3 + 1];
        newPositions[i3 + 2] = currentModelPositons[i3 + 2];
        //newPositions[i3 + 3] = 0;
      } else {
        const randomPosition = Math.floor(currentCount * Math.random()) * 3;
        console.log(randomPosition);
        newPositions[i3 + 0] = currentModelPositons[randomPosition + 0];
        newPositions[i3 + 1] = currentModelPositons[randomPosition + 1];
        newPositions[i3 + 2] = currentModelPositons[randomPosition + 2];
      }
    }
    customModels.push(newPositions);
  }
  console.log(customModels);

  // Geometry
  // particles.geometry = new THREE.SphereGeometry(3);
  // particles.geometry.setIndex(null);
  particles.geometry = new THREE.BufferGeometry();
  particles.geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(customModels[1], 3),
  );
  particles.geometry.setAttribute(
    "aTarget",
    new THREE.BufferAttribute(customModels[3], 3),
  );

  // Material
  particles.colorA = "#ff7300";
  particles.colorB = "#0091ff";

  particles.material = new THREE.ShaderMaterial({
    vertexShader: particlesVertexShader,
    fragmentShader: particlesFragmentShader,
    uniforms: {
      uSize: new THREE.Uniform(0.2),
      uResolution: new THREE.Uniform(
        new THREE.Vector2(
          sizes.width * sizes.pixelRatio,
          sizes.height * sizes.pixelRatio,
        ),
      ),
      uProgress: new THREE.Uniform(0),
      uColorA: new THREE.Uniform(new THREE.Color(particles.colorA)),
      uColorB: new THREE.Uniform(new THREE.Color(particles.colorB)),
    },
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  // Points
  particles.points = new THREE.Points(particles.geometry, particles.material);
  scene.add(particles.points);

  // GUI
  gui
    .add(particles.material.uniforms.uProgress, "value", 0, 1)
    .name("Merge Object")
    .step(0.001);
});

/**
 * Animate
 */
const tick = () => {
  // Update controls
  controls.update();

  // Render normal scene
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
