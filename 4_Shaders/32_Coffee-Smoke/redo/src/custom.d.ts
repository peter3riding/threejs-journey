// three/addons modules
declare module "three/addons/controls/OrbitControls.js" {
  import { Camera, EventDispatcher, MOUSE, TOUCH } from "three";
  import * as THREE from "three";
  export class OrbitControls extends EventDispatcher {
    constructor(object: Camera, domElement?: HTMLElement);
    object: Camera;
    domElement: HTMLElement | undefined;
    enabled: boolean;
    target: THREE.Vector3;
    minDistance: number;
    maxDistance: number;
    minZoom: number;
    maxZoom: number;
    minPolarAngle: number;
    maxPolarAngle: number;
    minAzimuthAngle: number;
    maxAzimuthAngle: number;
    enableDamping: boolean;
    dampingFactor: number;
    enableZoom: boolean;
    zoomSpeed: number;
    enableRotate: boolean;
    rotateSpeed: number;
    enablePan: boolean;
    panSpeed: number;
    screenSpacePanning: boolean;
    keyPanSpeed: number;
    autoRotate: boolean;
    autoRotateSpeed: number;
    mouseButtons: { LEFT: MOUSE; MIDDLE: MOUSE; RIGHT: MOUSE };
    touches: { ONE: TOUCH; TWO: TOUCH };
    update(): void;
    reset(): void;
    dispose(): void;
  }
}

// GLTFLoader
declare module "three/addons/loaders/GLTFLoader.js" {
  import { Loader, LoadingManager, Object3D } from "three";
  export interface GLTF {
    scene: Object3D;
    scenes: Object3D[];
    animations: any[];
    cameras: any[];
    asset: any;
  }
  export class GLTFLoader extends Loader {
    constructor(manager?: LoadingManager);
    load(
      url: string,
      onLoad: (gltf: GLTF) => void,
      onProgress?: (event: ProgressEvent<EventTarget>) => void,
      onError?: (event: ErrorEvent) => void,
    ): void;
  }
}

// lil-gui
declare module "lil-gui" {
  export default class GUI {
    constructor(params?: any);
    add(...args: any[]): any;
    open(): void;
    close(): void;
    destroy(): void;
  }
}

// glsl
declare module "*.glsl" {
  const source: string;
  export default source;
}
