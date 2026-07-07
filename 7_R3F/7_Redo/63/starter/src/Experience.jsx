import { OrbitControls } from "@react-three/drei";
import {
  DepthOfField,
  Bloom,
  Noise,
  Glitch,
  ToneMapping,
  Vignette,
  EffectComposer,
} from "@react-three/postprocessing";
import { Perf } from "r3f-perf";
import { GlitchMode, BlendFunction, ToneMappingMode } from "postprocessing";
import Drunk from "./Drunk.jsx";
import { useRef, useEffect } from "react";
import { useControls } from "leva";

export default function Experience() {
  const drunkRef = useRef();

  useEffect(() => {
    console.log(drunkRef.current);
  }, []);

  const drunkProps = useControls("Drunk Effect", {
    frequency: { value: 2, min: 1, max: 20 },
    amplitude: { value: 0.1, min: 0, max: 1 },
    blendFunction: {
      value: BlendFunction.DARKEN,
      options: {
        DARKEN: BlendFunction.DARKEN,
        MULTIPLY: BlendFunction.MULTIPLY,
        OVERLAY: BlendFunction.OVERLAY,
        SCREEN: BlendFunction.SCREEN,
        NORMAL: BlendFunction.NORMAL,
      },
    },
  });

  return (
    <>
      <color args={["#ffffff"]} attach="background" />
      <EffectComposer>
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
        <Drunk ref={drunkRef} {...drunkProps} />
      </EffectComposer>

      <Perf position="top-left" />

      <OrbitControls makeDefault />

      <directionalLight castShadow position={[1, 2, 3]} intensity={4.5} />
      <ambientLight intensity={1.5} />

      <mesh castShadow position-x={-2}>
        <sphereGeometry />
        <meshStandardMaterial color="orange" />
      </mesh>

      <mesh castShadow position-x={2} scale={1.5}>
        <boxGeometry />
        <meshStandardMaterial color="mediumpurple" />
      </mesh>

      <mesh
        receiveShadow
        position-y={-1}
        rotation-x={-Math.PI * 0.5}
        scale={10}
      >
        <planeGeometry />
        <meshStandardMaterial color="greenyellow" />
      </mesh>
    </>
  );
}
