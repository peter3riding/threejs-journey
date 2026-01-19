import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import CANNON from "cannon";
import { deltaTime } from "three/tsl";
import { clamp } from "three/src/nodes/TSL.js";

/**
 * Debug
 */
const gui = new GUI();
const debugObject = {};

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Mouse
 */
const mouse = new THREE.Vector2();

window.addEventListener("mousemove", (event) => {
  mouse.x = (event.clientX / sizes.width) * 2 - 1;
  mouse.y = -(event.clientY / sizes.height) * 2 + 1;

  //   console.log(mouse);
});

/**
 * Raycaster
 */
const raycaster = new THREE.Raycaster();

let currentIntersect = null;

// Log when clicked on
window.addEventListener("click", () => {
  if (currentIntersect) {
    const entry = objectsToUpdate.find(
      (object) => object.mesh === currentIntersect
    );
    if (!entry) return;

    const sphereBody = entry.body;

    // console.log(direction);
    // const x = direction.x * 3;
    // const y = direction.y * 3;
    // const z = direction.z * 3;

    const strength = 5;
    const impulse = raycaster.ray.direction.clone().multiplyScalar(strength);

    sphereBody.applyImpulse(
      new CANNON.Vec3(impulse.x, impulse.y, impulse.z),
      sphereBody.position
    );
  }
});

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

const environmentMapTexture = cubeTextureLoader.load([
  "/textures/environmentMaps/0/px.png",
  "/textures/environmentMaps/0/nx.png",
  "/textures/environmentMaps/0/py.png",
  "/textures/environmentMaps/0/ny.png",
  "/textures/environmentMaps/0/pz.png",
  "/textures/environmentMaps/0/nz.png",
]);

const world = new CANNON.World();
world.gravity.set(0, -9.82, 0); // Earth gravity in m/s²

/**
 * Test sphere
 */
// const sphere = new THREE.Mesh(
//   new THREE.SphereGeometry(0.5, 32, 32),
//   new THREE.MeshStandardMaterial({
//     metalness: 0.3,
//     roughness: 0.4,
//     envMap: environmentMapTexture,
//     envMapIntensity: 0.5,
//   })
// );
// sphere.castShadow = true;
// sphere.position.y = 3;
// scene.add(sphere);

/**
 * Floor
 */
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({
    color: "#777777",
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
    envMapIntensity: 0.5,
  })
);
floor.receiveShadow = true;
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

/**
 * Physics World
 */

// Material
const defaultMaterial = new CANNON.Material("default");

const contactMaterial = new CANNON.ContactMaterial(
  defaultMaterial,
  defaultMaterial,
  {
    friction: 0.1,
    restitution: 0.7,
  }
);
// Tell Cannon.js to use these rules.
world.addContactMaterial(contactMaterial);

/**
 * Factory Function
 */

let objectsToUpdate = [];

document.addEventListener("click", (e) => {
  console.log(e.clientX);
  console.log(objectsToUpdate);
});

const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
    envMapIntensity: 0.5,
  })
);

const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
const sphereMaterial = new THREE.MeshStandardMaterial({
  metalness: 0.3,
  roughness: 0.4,
  envMap: environmentMapTexture,
  envMapIntensity: 0.5,
});

let objectsToTest = [];
function createSphere(radius, position) {
  // Sphere outer
  const mesh = new THREE.Mesh(sphereGeometry, sphereMaterial);

  mesh.castShadow = true;
  mesh.position.copy(position);
  mesh.scale.set(radius, radius, radius);
  objectsToTest.push(mesh);
  scene.add(mesh);

  // Physics Sphere

  const shereShape = new CANNON.Sphere(radius);
  const body = new CANNON.Body({
    // mass > 0 can move (not static)
    mass: 1,
    material: defaultMaterial,
    position: new CANNON.Vec3(position.x, position.y, position.z),
    shape: shereShape,
  });
  world.addBody(body);

  objectsToUpdate.push({ mesh: mesh, body: body });
}
// createSphere(0.5, { x: 0, y: 3, z: 0 });
debugObject.createSphere = () => {
  createSphere(Math.random() * 0.5, {
    x: (Math.random() - 0.5) * 3,
    y: 3,
    z: (Math.random() - 0.5) * 3,
  });
};
gui.add(debugObject, "createSphere");

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const boxMaterial = new THREE.MeshStandardMaterial({
  metalness: 0.3,
  roughness: 0.4,
  envMap: environmentMapTexture,
  envMapIntensity: 0.5,
});

function createBox(width, height, depth, position) {
  // Box

  const mesh = new THREE.Mesh(boxGeometry, boxMaterial);
  mesh.position.copy(position);
  mesh.scale.set(width, height, depth);
  scene.add(mesh);

  // Cannon.js body
  const shape = new CANNON.Box(
    new CANNON.Vec3(width * 0.5, height * 0.5, depth * 0.5)
  );
  const body = new CANNON.Body({
    mass: 1,
    shape: shape,
    material: defaultMaterial,
    // position: new CANNON.Vec3(0, 3, 0),
  });
  body.position.copy(position);
  world.addBody(body);
  objectsToUpdate.push({ mesh: mesh, body: body });
}
debugObject.createBox = () => {
  createBox(Math.random() * 2, Math.random() * 2, Math.random() * 2, {
    x: (Math.random() - 0.5) * 2,
    y: 3,
    z: (Math.random() - 0.5) * 2,
  });
};
gui.add(debugObject, "createBox");
// createBox(1, 1.5, 2, { x: 0, y: 3, z: 0 });

// Physics Shere
// const shereShape = new CANNON.Sphere(0.5);
// const sphereBody = new CANNON.Body({
//   // mass > 0 can move (not static)
//   mass: 1,
//   material: defaultMaterial,
//   position: new CANNON.Vec3(0, 3, 0),
//   shape: shereShape,
// });
// world.addBody(sphereBody);

// Physics Floor
const floorShape = new CANNON.Plane();
const floorBody = new CANNON.Body({
  mass: 0,
  shape: floorShape,
  material: defaultMaterial,
});
world.addBody(floorBody);
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5);

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 2.1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.left = -7;
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.bottom = -7;
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

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
camera.position.set(-3, 3, 3);
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
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();
let oldElapsedTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - oldElapsedTime;
  oldElapsedTime = elapsedTime;

  // Update physics
  world.step(1 / 60, deltaTime, 3);

  // Update real world
  //   sphere.position.copy(sphereBody.position);
  for (let object of objectsToUpdate) {
    object.mesh.position.copy(object.body.position);
    object.mesh.quaternion.copy(object.body.quaternion);
  }

  // Push when clicked
  raycaster.setFromCamera(mouse, camera);

  if (objectsToTest.length > 0) {
    const intersects = raycaster.intersectObjects(objectsToTest);
    currentIntersect = intersects.length ? intersects[0].object : null;
  }

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
