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

/**
 * Models
 */
let particles = null;

gltfLoader.load("./models.glb", (gltf) => {
  particles = {};
  particles.index = 1;
  particles.maxCount = 0;

  particles.colorA = "#ff7300";
  particles.colorB = "#0091ff";

  const positions = gltf.scene.children.map(
    (child) => child.geometry.attributes.position,
  );

  console.log(positions);

  for (const position of positions) {
    if (position.count > particles.maxCount)
      particles.maxCount = position.count;
    console.log(position);
  }

  particles.positions = [];

  particles.randomness = new Float32Array(particles.maxCount);

  for (const position of positions) {
    const newArray = new Float32Array(particles.maxCount * 3);
    for (let i = 0; i < particles.maxCount; i++) {
      particles.randomness[i] = Math.random();
      const i3 = i * 3;
      if (i < position.count) {
        newArray[i3 + 0] = position.array[i3 + 0];
        newArray[i3 + 1] = position.array[i3 + 1];
        newArray[i3 + 2] = position.array[i3 + 2];
      } else {
        const randomPos = Math.floor(position.count * Math.random()) * 3.0;
        newArray[i3 + 0] = position.array[randomPos + 0];
        newArray[i3 + 1] = position.array[randomPos + 1];
        newArray[i3 + 2] = position.array[randomPos + 2];
      }
    }
    particles.positions.push(new THREE.Float32BufferAttribute(newArray, 3));
  }

  // Geometry
  particles.geometry = new THREE.BufferGeometry();
  particles.geometry.setAttribute(
    "position",
    particles.positions[particles.index],
  );
  particles.geometry.setAttribute("aPositionTarget", particles.positions[3]);
  particles.geometry.setAttribute(
    "aSize",
    new THREE.Float32BufferAttribute(particles.randomness, 1),
  );

  // particles.geometry = new THREE.SphereGeometry(3);
  // particles.geometry.setIndex(null);

  // Material
  particles.material = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexShader: particlesVertexShader,
    fragmentShader: particlesFragmentShader,
    uniforms: {
      uSize: new THREE.Uniform(0.4),
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
  });

  // Points
  particles.points = new THREE.Points(particles.geometry, particles.material);
  scene.add(particles.points);

  // Tweaks
  gui
    .add(particles.material.uniforms.uProgress, "value")
    .min(0)
    .max(1)
    .step(0.01)
    .name("uProgress")
    .listen();

  // Methods
  particles.morph = (index) => {
    // Update attributes
    particles.geometry.attributes.position =
      particles.positions[particles.index];
    particles.geometry.attributes.aPositionTarget = particles.positions[index];
    gsap.fromTo(
      particles.material.uniforms.uProgress,
      { value: 0 },
      { value: 1, duration: 3, ease: "linear" },
    );
    // Save index
    particles.index = index;
  };

  particles.morph0 = () => {
    particles.morph(0);
  };
  particles.morph1 = () => {
    particles.morph(1);
  };
  particles.morph2 = () => {
    particles.morph(2);
  };
  particles.morph3 = () => {
    particles.morph(3);
  };

  gui.add(particles, "morph0");
  gui.add(particles, "morph1");
  gui.add(particles, "morph2");
  gui.add(particles, "morph3");
});

/**
 * Particles
 */

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
