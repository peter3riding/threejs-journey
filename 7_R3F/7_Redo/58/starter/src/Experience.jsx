import {
  Lightformer,
  Environment,
  Sky,
  ContactShadows,
  RandomizedLight,
  AccumulativeShadows,
  SoftShadows,
  BakeShadows,
  useHelper,
  OrbitControls,
} from "@react-three/drei";
import { useRef, useEffect } from "react";
import { Perf } from "r3f-perf";
import * as THREE from "three";
import { useControls } from "leva";
import { useThree, useFrame } from "@react-three/fiber";

export default function Experience() {
  const cube = useRef();
  const directionalLight = useRef();
  //   useHelper(directionalLight, THREE.DirectionalLightHelper, 1);

  useFrame((state, delta) => {
    // const time = state.clock.elapsedTime
    // cube.current.position.x = 2 + Math.sin(time)
    cube.current.rotation.y += delta * 0.2;
  });

  const { color, opacity, blur } = useControls("contact shadows", {
    color: "#000000",
    opacity: { value: 0.5, min: 0, max: 1 },
    blur: { value: 1, min: 0, max: 10 },
  });

  const { sunPosition } = useControls("sky", {
    sunPosition: { value: [1, 2, 3] },
  });

  const { envMapIntensity, envMapHeight, envMapRadius, envMapScale } =
    useControls("environment map", {
      envMapIntensity: { value: 7, min: 0, max: 12 },
      envMapHeight: { value: 7, min: 0, max: 100 },
      envMapRadius: { value: 28, min: 10, max: 1000 },
      envMapScale: { value: 100, min: 10, max: 1000 },
    });

  const scene = useThree((state) => state.scene);
  useEffect(() => {
    scene.environmentIntensity = envMapIntensity;
  }, [envMapIntensity]);

  return (
    <>
      <Environment
        preset="sunset"
        ground={{
          height: envMapHeight,
          radius: envMapRadius,
          scale: envMapScale,
        }}
      ></Environment>

      {/* <BakeShadows /> */}
      {/* <SoftShadows size={25} samples={10} focus={0} /> */}
      <Perf position="top-left" />

      {/* <Sky sunPosition={sunPosition} /> */}

      <OrbitControls makeDefault />

      {/* <directionalLight
        ref={directionalLight}
        position={sunPosition}
        intensity={4.5}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={1}
        shadow-camera-far={10}
        shadow-camera-top={5}
        shadow-camera-right={5}
        shadow-camera-bottom={-5}
        shadow-camera-left={-5}
      /> */}

      {/* <ambientLight intensity={1.5} /> */}

      {/* <AccumulativeShadows
        position={[0, -0.99, 0]}
        scale={10}
        color="#316d39"
        opacity={0.8}
        frames={Infinity}
        temporal
        blend={100}
      >
        <RandomizedLight
          amount={8}
          radius={1}
          ambient={0.5}
          intensity={3}
          position={[1, 2, 3]}
          bias={0.001}
        />
      </AccumulativeShadows> */}

      <ContactShadows
        position={[0, 0, 0]}
        scale={10}
        resolution={512}
        far={5}
        color={color}
        opacity={opacity}
        blur={blur}
      />

      <mesh castShadow position-y={1} position-x={-2}>
        <sphereGeometry />
        <meshStandardMaterial color="orange" />
      </mesh>

      <mesh castShadow position-y={1} ref={cube} position-x={2} scale={1.5}>
        <boxGeometry />
        <meshStandardMaterial color="mediumpurple" />
      </mesh>

      <mesh position-y={0} rotation-x={-Math.PI * 0.5} scale={10}>
        <planeGeometry />
        <meshStandardMaterial color="greenyellow" />
      </mesh>
    </>
  );
}
