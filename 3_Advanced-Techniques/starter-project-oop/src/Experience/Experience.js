import * as THREE from "three";
import Sizes from "./Utils/Sizes";
import Time from "./Utils/Time";
import Camera from "./Camera";
import Renderer from "./Renderer";
import World from "./World/World";

let instance = null;

export default class Experience {
  constructor(canvas) {
    // Singleton (make only one instance of experience when delcaring a new one especially important as it acts as the controller)
    if (instance) {
      return instance;
    }
    instance = this;

    // Global access
    window.experience = this;

    // Options
    this.canvas = canvas;

    // Setup
    this.sizes = new Sizes();
    console.log(this);
    this.time = new Time();
    this.scene = new THREE.Scene();
    this.camera = new Camera();

    // Renderer
    this.renderer = new Renderer();

    // World
    this.world = new World();

    // Resize event
    this.sizes.on("resize", () => {
      this.resize();
    });

    // Time tick event
    this.time.on("tick", () => {
      this.update();
    });
  }
  resize() {
    this.camera.resize();
    this.renderer.resize();
  }
  update() {
    this.camera.update();
    this.renderer.update();
  }
}
