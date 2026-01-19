import * as THREE from "three";

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Objects
 */
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);

// mesh.position.x = 0.7;
// mesh.position.y = -0.6;
// mesh.position.z = 1;
mesh.position.set(1.3, 1.1, 1);
// scene.add(mesh);

// Axes Helper
const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper);
/**
 * Sizes
 */
const sizes = {
  width: 800,
  height: 600,
};

// Groups
const group = new THREE.Group();
scene.add(group);

const object1 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
object1.position.x = 2;
group.add(object1);

const object2 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: "yellow" })
);
object2.position.x = -2;
group.add(object2);

const object3 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: "green" })
);
group.add(object3);

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(120, sizes.width / sizes.height);
camera.position.z = 3;
camera.position.y = 1;
camera.position.x = 1;
scene.add(camera);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);
