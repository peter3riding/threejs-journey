import GUI from "lil-gui";
import * as THREE from "three/webgpu";
import {
  // Core (kept for future TSL extensions)
  color,
  uniform,
  vec2,
  vec3,
  vec4,
  float,

  // Time & Animation
  time,

  // Math
  sin,
  cos,
  tan,
  pow,
  sqrt,
  abs,
  clamp,
  mix,
  step,
  smoothstep,
  add,
  sub,
  mul,
  div,

  // Geometry
  positionLocal,
  positionWorld,
  normalLocal,
  normalWorld,

  // UV & Texturing
  uv,
  texture,

  // Post-processing & Fog
  pass,
  renderOutput,
  fog,
  rangeFogFactor,
} from "three/tsl";
import { RenderPipeline } from "three/webgpu";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { dotScreen } from "three/addons/tsl/display/DotScreenNode.js";

(async () => {
  /**
   * Base
   */
  // Debug
  const gui = new GUI({ width: 400 });

  // Canvas
  const canvas = document.querySelector("canvas.webgl") as HTMLCanvasElement;

  // Scene
  const scene = new THREE.Scene();

  /**
   * Loaders
   */
  const gltfLoader = new GLTFLoader();
  const cubeTextureLoader = new THREE.CubeTextureLoader();
  const textureLoader = new THREE.TextureLoader();

  /**
   * Update all materials (for MeshStandardMaterial models)
   */
  const updateAllMaterials = () => {
    scene.traverse((child) => {
      if (
        child instanceof THREE.Mesh &&
        child.material instanceof THREE.MeshStandardMaterial
      ) {
        child.material.envMapIntensity = 2.5;
        child.material.needsUpdate = true;
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  };

  /**
   * Environment map
   */
  const environmentMap = cubeTextureLoader.load([
    "/textures/environmentMaps/0/px.jpg",
    "/textures/environmentMaps/0/nx.jpg",
    "/textures/environmentMaps/0/py.jpg",
    "/textures/environmentMaps/0/ny.jpg",
    "/textures/environmentMaps/0/pz.jpg",
    "/textures/environmentMaps/0/nz.jpg",
  ]);

  scene.background = environmentMap;
  scene.environment = environmentMap;

  /**
   * Models
   */
  gltfLoader.load("/models/DamagedHelmet/glTF/DamagedHelmet.gltf", (gltf) => {
    gltf.scene.scale.set(2, 2, 2);
    gltf.scene.rotation.y = Math.PI * 0.5;
    scene.add(gltf.scene);

    updateAllMaterials();
  });

  /**
   * Lights
   */
  const directionalLight = new THREE.DirectionalLight("#ffffff", 3);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.set(1024, 1024);
  directionalLight.shadow.camera.far = 15;
  directionalLight.shadow.normalBias = 0.05;
  directionalLight.position.set(0.25, 3, -2.25);
  scene.add(directionalLight);

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
    75,
    sizes.width / sizes.height,
    0.1,
    100,
  );
  camera.position.set(4, 1, -4); // updated to match classic DamagedHelmet view
  scene.add(camera);

  /**
   * Controls
   */
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;

  /**
   * Renderer + Post-processing (WebGPU + TSL ready)
   */
  const renderer = new THREE.WebGPURenderer({
    canvas: canvas,
    forceWebGL: false,
    antialias: true,
  });

  // Enable shadows (WebGPU compatible)
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;

  // Tone mapping (same as classic example)
  renderer.toneMapping = THREE.ReinhardToneMapping;
  renderer.toneMappingExposure = 1.5;

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Required for WebGPU
  try {
    await renderer.init();
  } catch (error) {
    console.error("WebGPU init failed:", error);
    return;
  }

  /**
   * Post processing
   */
  const postProcessing = new THREE.RenderPipeline(renderer);
  postProcessing.outputColorTransform = false;

  const scenePass = pass(scene, camera);

  const dottedNode = dotScreen(
    scenePass.getTextureNode("output"), // input from the scene
    uniform(1.57), // angle (radians) — you can make this a uniform too
    uniform(1.0), // scale
  );

  const outputPass = renderOutput(scenePass);

  postProcessing.outputNode = outputPass;

  /**
   * Resize handler
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
  const timer = new THREE.Timer();

  const tick = () => {
    timer.update();

    controls.update();

    postProcessing.render();
  };

  renderer.setAnimationLoop(tick);
})();
