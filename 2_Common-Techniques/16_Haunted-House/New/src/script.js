import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Timer } from "three/addons/misc/Timer.js";
import { Sky } from "three/examples/jsm/Addons.js";
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
// Floor
const floorAlphaTexture = textureLoader.load("./floor/alpha.webp");
const floorColorTexture = textureLoader.load(
  "./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_diff_1k.webp"
);
const floorARMTexture = textureLoader.load(
  "./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_arm_1k.webp"
);
const floorNormalTexture = textureLoader.load(
  "./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_nor_gl_1k.webp"
);
const floorDisplacementTexture = textureLoader.load(
  "./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_disp_1k.webp"
);

floorColorTexture.colorSpace = THREE.SRGBColorSpace;
// Wall
const wallColorTexture = textureLoader.load(
  "./wall/castle_brick_broken_06_1k/castle_brick_broken_06_diff_1k.webp"
);
const wallARMTexture = textureLoader.load(
  "./wall/castle_brick_broken_06_1k/castle_brick_broken_06_arm_1k.webp"
);
const wallNormalTexture = textureLoader.load(
  "./wall/castle_brick_broken_06_1k/castle_brick_broken_06_nor_gl_1k.webp"
);

wallColorTexture.colorSpace = THREE.SRGBColorSpace;

// Roof
const roofColorTexture = textureLoader.load(
  "./roof/roof_slates_02_1k/roof_slates_02_diff_1k.webp"
);
const roofARMTexture = textureLoader.load(
  "./roof/roof_slates_02_1k/roof_slates_02_arm_1k.webp"
);
const roofNormalTexture = textureLoader.load(
  "./roof/roof_slates_02_1k/roof_slates_02_nor_gl_1k.webp"
);

roofColorTexture.colorSpace = THREE.SRGBColorSpace;
// Bush
const bushColorTexture = textureLoader.load(
  "./bush/leaves_forest_ground_1k/leaves_forest_ground_diff_1k.webp"
);
const bushARMTexture = textureLoader.load(
  "./bush/leaves_forest_ground_1k/leaves_forest_ground_arm_1k.webp"
);
const bushNormalTexture = textureLoader.load(
  "./bush/leaves_forest_ground_1k/leaves_forest_ground_nor_gl_1k.webp"
);

bushColorTexture.colorSpace = THREE.SRGBColorSpace;
// Grave
const graveColorTexture = textureLoader.load(
  "./grave/plastered_stone_wall_1k/plastered_stone_wall_diff_1k.webp"
);
const graveARMTexture = textureLoader.load(
  "./grave/plastered_stone_wall_1k/plastered_stone_wall_arm_1k.webp"
);
const graveNormalTexture = textureLoader.load(
  "./grave/plastered_stone_wall_1k/plastered_stone_wall_nor_gl_1k.webp"
);

graveColorTexture.colorSpace = THREE.SRGBColorSpace;
// Door
const doorColorTexture = textureLoader.load("./door/color.webp");
const doorAlphaTexture = textureLoader.load("./door/alpha.webp");
const doorAmbientOcclusionTexture = textureLoader.load(
  "./door/ambientOcclusion.webp"
);
const doorHeightTexture = textureLoader.load("./door/height.webp");
const doorNormalTexture = textureLoader.load("./door/normal.webp");
const doorMetalnessTexture = textureLoader.load("./door/metalness.webp");
const doorRoughnessTexture = textureLoader.load("./door/roughness.webp");

doorColorTexture.colorSpace = THREE.SRGBColorSpace;

/**
 * Floor
 */
const floorGeometry = new THREE.PlaneGeometry(20, 20, 100, 100);
const floorMaterial = new THREE.MeshStandardMaterial({
  transparent: true,
  alphaMap: floorAlphaTexture,
  map: floorColorTexture,
  aoMap: floorARMTexture,
  normalMap: floorNormalTexture,
  displacementMap: floorDisplacementTexture,
  displacementScale: 0.3,
  displacementBias: -0.15,
});

[
  floorColorTexture,
  floorARMTexture,
  floorNormalTexture,
  floorDisplacementTexture,
].forEach((t) => {
  t.wrapS = THREE.RepeatWrapping;
  t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(8, 8);
});

const floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);
floorMesh.rotation.x = -Math.PI * 0.5;
floorMesh.receiveShadow = true;
scene.add(floorMesh);

/**
 * House
 */

// House Group
const houseGroup = new THREE.Group();
scene.add(houseGroup);

// Walls
const wallsGeometry = new THREE.BoxGeometry(4, 2.5, 4);
const wallsMaterial = new THREE.MeshStandardMaterial({
  map: wallColorTexture,
  aoMap: wallARMTexture,
  metalnessMap: wallARMTexture,
  roughnessMap: wallARMTexture,
  normalMap: wallNormalTexture,
});
const wallsMesh = new THREE.Mesh(wallsGeometry, wallsMaterial);
wallsMesh.position.y = 1.25;
wallsMesh.receiveShadow = true;
houseGroup.add(wallsMesh);

// Roof
const roofGeometry = new THREE.ConeGeometry(3.5, 2, 4);
const roofMaterial = new THREE.MeshStandardMaterial({
  map: roofColorTexture,
  aoMap: roofARMTexture,
  roughnessMap: roofARMTexture,
  metalnessMap: roofARMTexture,
  normalMap: roofNormalTexture,
});

[roofColorTexture, roofARMTexture, roofNormalTexture].forEach((t) => {
  t.wrapS = THREE.RepeatWrapping;
  t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(3, 1);
});

const roofMesh = new THREE.Mesh(roofGeometry, roofMaterial);
roofMesh.position.y = 3.5;
roofMesh.rotation.y = Math.PI * 0.25;
roofMesh.castShadow = true;
houseGroup.add(roofMesh);

// Door
const doorGeometry = new THREE.PlaneGeometry(2.2, 2.2, 100, 100);
const doorMaterial = new THREE.MeshStandardMaterial({
  transparent: true,
  alphaMap: doorAlphaTexture,
  map: doorColorTexture,
  displacementMap: doorHeightTexture,
  displacementScale: 0.15,
  displacementBias: -0.04,
  aoMap: doorAmbientOcclusionTexture,
  normalMap: doorNormalTexture,
  metalnessMap: doorMetalnessTexture,
  roughnessMap: doorRoughnessTexture,
});
const doorMesh = new THREE.Mesh(doorGeometry, doorMaterial);
doorMesh.position.z = 2.01;
doorMesh.position.y = 1.1;
houseGroup.add(doorMesh);

// Bushes
const bushGeometry = new THREE.SphereGeometry(0.5, 32, 16);
const bushMaterial = new THREE.MeshStandardMaterial({
  color: "#ccffcc",
  map: bushColorTexture,
  aoMap: bushARMTexture,
  roughnessMap: bushARMTexture,
  metalnessMap: bushARMTexture,
  normalMap: bushNormalTexture,
});

const bushOne = new THREE.Mesh(bushGeometry, bushMaterial);
bushOne.position.set(0.6, 0.3, 2.3);
bushOne.rotation.x = -0.75;

const bushTwo = new THREE.Mesh(bushGeometry, bushMaterial);
bushTwo.scale.set(0.5, 0.5, 0.5);
bushTwo.position.set(1.2, 0.2, 2.1);
bushTwo.rotation.x = -0.75;

const bushThree = new THREE.Mesh(bushGeometry, bushMaterial);
bushThree.scale.set(0.4, 0.4, 0.4);
bushThree.position.set(-1.2, 0.1, 2.6);
bushThree.rotation.x = -0.75;

const bushFour = new THREE.Mesh(bushGeometry, bushMaterial);
bushFour.scale.set(0.8, 0.8, 0.8);
bushFour.position.set(-0.9, 0.3, 2.3);
bushFour.rotation.x = -0.75;

[bushColorTexture, bushARMTexture, bushNormalTexture].forEach((t) => {
  t.wrapS = THREE.RepeatWrapping;
  t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(2, 1);
});

houseGroup.add(bushOne, bushTwo, bushThree, bushFour);

/**
 * Graves
 */
// Graves Group
const gravesGroup = new THREE.Group();

const graveGeometry = new THREE.BoxGeometry(0.7, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({
  map: graveColorTexture,
  aoMap: graveARMTexture,
  roughnessMap: graveARMTexture,
  metalnessMap: graveARMTexture,
  normalMap: graveNormalTexture,
});

[graveColorTexture, graveARMTexture, graveNormalTexture].forEach((t) => {
  t.wrapS = THREE.RepeatWrapping;
  t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(0.3, 0.4);
});

for (let i = 0; i < 30; i++) {
  const grave = new THREE.Mesh(graveGeometry, graveMaterial);
  const angle = Math.random() * Math.PI * 2;
  const radius = 3 + Math.random() * 4;
  grave.position.x = Math.sin(angle) * radius;
  grave.position.y = 0.4;
  grave.position.z = Math.cos(angle) * radius;

  grave.rotation.x = (Math.random() - 0.5) * 0.4;
  grave.rotation.y = (Math.random() - 0.5) * 0.4;
  grave.rotation.z = (Math.random() - 0.5) * 0.4;
  grave.castShadow = true;

  gravesGroup.add(grave);
}

scene.add(gravesGroup);

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight("#ffffff", 0.5);
scene.add(ambientLight);

// Directional light
const directionalLight = new THREE.DirectionalLight("#ffffff", 0.5);
directionalLight.position.set(3, 2, -8);

directionalLight.castShadow = true;
scene.add(directionalLight);

// Point Light
const pointLight = new THREE.PointLight("#FF6E00", 3);
pointLight.position.set(0, 2.4, 2.3);
scene.add(pointLight);

// Ghosts
const ghostOne = new THREE.PointLight("#FF6E00", 5);
ghostOne.castShadow = true;

const ghostTwo = new THREE.PointLight("#0018F9", 5);
ghostTwo.castShadow = true;

const ghostThree = new THREE.PointLight("#FFEF00", 5);
ghostThree.castShadow = true;

scene.add(ghostOne, ghostTwo, ghostThree);

// Mappings
directionalLight.shadow.mapSize.width = 256;
directionalLight.shadow.mapSize.height = 256;
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 16;

directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.bottom = -7;
directionalLight.shadow.camera.left = -7;

ghostOne.shadow.mapSize.width = 256;
ghostOne.shadow.mapSize.height = 256;
ghostOne.shadow.camera.far = 10;

ghostTwo.shadow.mapSize.width = 256;
ghostTwo.shadow.mapSize.height = 256;
ghostTwo.shadow.camera.far = 10;

ghostThree.shadow.mapSize.width = 256;
ghostThree.shadow.mapSize.height = 256;
ghostThree.shadow.camera.far = 10;

// Helpers
const helper = new THREE.CameraHelper(directionalLight.shadow.camera);
scene.add(helper);
helper.visible = false;

const helper2 = new THREE.CameraHelper(ghostOne.shadow.camera);
ghostOne.shadow.camera.far = 6;

/**
 * Sky
 */
const sky = new Sky();
sky.scale.set(100, 100, 100);
scene.add(sky);

sky.material.uniforms["turbidity"].value = 10;
sky.material.uniforms["rayleigh"].value = 3;
sky.material.uniforms["mieCoefficient"].value = 0.1;
sky.material.uniforms["mieDirectionalG"].value = 0.95;
sky.material.uniforms["sunPosition"].value.set(0.3, -0.038, -0.95);

/**
 * Fog
 */
// scene.fog = new THREE.Fog('#04343f', 1, 13)
scene.fog = new THREE.FogExp2("#04343f", 0.1);

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
camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 5;
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
renderer.shadowMap.enabled = true;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const timer = new Timer();

const tick = () => {
  // Timer
  timer.update();
  const elapsedTime = timer.getElapsed();

  // Ghost animation
  const radius = 3 + Math.random() * 4;

  // Ghost one
  const speedOne = elapsedTime * 0.5;
  const radiusOne = 4;
  ghostOne.position.x = Math.sin(speedOne) * radiusOne;
  ghostOne.position.y =
    Math.cos(speedOne) * Math.cos(speedOne * 2.45) * Math.cos(speedOne * 3.54);
  ghostOne.position.z = Math.cos(speedOne) * radiusOne;

  // Ghost two
  const speedTwo = -(elapsedTime * 0.5);
  const radiusTwo = 5;
  ghostTwo.position.x = -(Math.sin(speedTwo) * radiusTwo);
  ghostTwo.position.y =
    Math.cos(speedTwo) * Math.cos(speedTwo * 2.45) * Math.cos(speedTwo * 3.54);
  ghostTwo.position.z = -(Math.cos(speedTwo) * radiusTwo);

  // Ghost three
  const speedThree = elapsedTime * 0.3;
  const radiusThree = 6;
  ghostThree.position.x = Math.sin(speedThree) * radiusThree;
  ghostThree.position.y =
    Math.cos(speedThree) *
    Math.cos(speedThree * 2.45) *
    Math.cos(speedThree * 3.54);
  ghostThree.position.z = Math.cos(speedThree) * radiusThree;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
