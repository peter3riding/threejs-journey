import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x222222);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(
  60,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(0, 1, 3);
scene.add(camera);

/**
 * Controls
 */
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
directionalLight.position.set(3, 5, 3);
directionalLight.castShadow = true;
scene.add(directionalLight);

const rimLight = new THREE.DirectionalLight(0xffaa88, 0.5);
rimLight.position.set(-3, 2, -3);
scene.add(rimLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

/**
 * Textures
 */
const loader = new THREE.TextureLoader();
const colorMap = loader.load("/textures/door/color.jpg");
colorMap.colorSpace = THREE.SRGBColorSpace;

const normalMap = loader.load("/textures/door/normal.jpg");
const displacementMap = loader.load("/textures/door/height.jpg");

[colorMap, normalMap, displacementMap].forEach((t) => {
  t.wrapS = THREE.RepeatWrapping;
  t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(2, 2);
  t.flipY = false;
});

/**
 * Geometry
 */
const geometry = new THREE.PlaneGeometry(1, 1, 200, 200);

/**
 * Materials
 */
const matNormalOnly = new THREE.MeshStandardMaterial({
  map: colorMap,
  normalMap: normalMap,
  roughness: 0.5,
  metalness: 0.1,
});

const matDisplacementOnly = new THREE.MeshStandardMaterial({
  map: colorMap,
  displacementMap: displacementMap,
  displacementScale: 0.2,
  roughness: 0.5,
  metalness: 0.1,
});

const matBoth = new THREE.MeshStandardMaterial({
  map: colorMap,
  normalMap: normalMap,
  displacementMap: displacementMap,
  displacementScale: 0.2,
  roughness: 0.5,
  metalness: 0.1,
});

/**
 * Meshes
 */
const meshNormal = new THREE.Mesh(geometry, matNormalOnly);
meshNormal.position.x = -1.5;
meshNormal.castShadow = true;

const meshDisplacement = new THREE.Mesh(geometry, matDisplacementOnly);
meshDisplacement.position.x = 0;
meshDisplacement.castShadow = true;

const meshBoth = new THREE.Mesh(geometry, matBoth);
meshBoth.position.x = 1.5;
meshBoth.castShadow = true;

scene.add(meshNormal, meshDisplacement, meshBoth);

/**
 * Labels (FontLoader)
 */
const fontLoader = new FontLoader();
fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
  const createLabel = (text, x) => {
    const textGeo = new TextGeometry(text, { font, size: 0.15, height: 0.02 });
    const textMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const label = new THREE.Mesh(textGeo, textMat);
    label.position.set(x - 0.4, 0.65, 0);
    scene.add(label);
  };
  createLabel("Normal Only", -1.5);
  createLabel("Displacement Only", 0);
  createLabel("Both", 1.5);
});

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;

/**
 * Resize
 */
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Rotate meshes slightly for dynamic shadows
  meshNormal.rotation.y = Math.sin(elapsedTime * 0.2) * 0.1;
  meshDisplacement.rotation.y = Math.sin(elapsedTime * 0.2) * 0.1;
  meshBoth.rotation.y = Math.sin(elapsedTime * 0.2) * 0.1;

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
};

tick();
