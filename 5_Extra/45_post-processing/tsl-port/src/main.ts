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
  screenUV,
  Fn,
  dot,
  normalize,

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
import { rgbShift } from "three/addons/tsl/display/RGBShiftNode.js";
import { smaa } from "three/addons/tsl/display/SMAANode.js";
import BloomNode, { bloom } from "three/addons/tsl/display/BloomNode.js";

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

  const uNormalMap = texture(
    textureLoader.load("/textures/interfaceNormalMap.png"),
  );

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

  // First pass
  const scenePass = pass(scene, camera);

  // DOT NODE
  const uAngle = uniform(1.57); // radians
  const uScale = uniform(1.0);

  const dottedNode = dotScreen(
    scenePass.getTextureNode("output"),
    1.57, // initial angle (number)
    1.0, // initial scale (number)
  );
  dottedNode.angle = uAngle;
  dottedNode.scale = uScale;

  //const outputPass = renderOutput(dottedNode);

  // RGBSHIFT
  const uRGBAmount = uniform(0.005); // strength of the chromatic aberration
  const uRGBAngle = uniform(0); // angle in radians

  const rgbShiftNode = rgbShift(
    scenePass.getTextureNode("output"),
    0.005, // initial amount (number)
    0, // initial angle (number)
  );

  rgbShiftNode.amount = uRGBAmount;
  rgbShiftNode.angle = uRGBAngle;

  // const outputPass = renderOutput(smaa(rgbShiftNode));

  //__ BLOOM
  const uBloomStrength = uniform(1.0);
  const uBloomRadius = uniform(0.5);
  const uBloomThreshold = uniform(0.5);

  const bloomNode = bloom(
    rgbShiftNode, // input from previous effect
    1.0, // initial strength
    0.5, // initial radius
    0.5, // initial threshold
  );
  bloomNode.strength = uBloomStrength;
  bloomNode.radius = uBloomRadius;
  bloomNode.threshold = uBloomThreshold;

  // postProcessing.outputNode = renderOutput(smaa(bloomNode));

  // TINT PASS
  const tintValue = new THREE.Vector3(0, 0, 0);
  const uTint = uniform(tintValue);

  const tintNode = Fn(([input]: [any]) => {
    const color = input.sample(screenUV);
    return color.add(uTint); // uTint is a vec3 you control
  });

  // postProcessing.outputNode = renderOutput(
  //   smaa(tintNode(scenePass.getTextureNode())),
  // );

  // DISPLACEMENT NODE
  const displacementNode = Fn(([input]: [any]) => {
    const normalColor = uNormalMap.sample(screenUV).rgb.mul(2).sub(1);
    const newUv = screenUV.add(normalColor.xy.mul(0.1));

    let color = input.sample(newUv);

    // Simple fake lighting like in the lesson
    const lightDir = normalize(vec3(-1, 1, 0));
    const lightness = clamp(dot(normalColor, lightDir), 0, 1);
    color = color.add(lightness.mul(2));

    return color;
  });

  postProcessing.outputNode = renderOutput(
    smaa(displacementNode(scenePass.getTextureNode())),
  );

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

  // Tweaks
  gui.add(uAngle, "value", 0, Math.PI * 2, 0.01).name("Dot Angle");
  gui.add(uScale, "value", 0.2, 5, 0.01).name("Dot Scale");
  gui.add(uBloomStrength, "value", 0, 3, 0.01).name("Bloom Strength");
  gui.add(uBloomRadius, "value", 0, 2, 0.01).name("Bloom Radius");
  gui.add(uBloomThreshold, "value", 0, 1, 0.01).name("Bloom Threshold");
  gui.add(tintValue, "x", -1, 1).name("red");
  gui.add(tintValue, "y", -1, 1).name("green");
  gui.add(tintValue, "z", -1, 1).name("blue");

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
