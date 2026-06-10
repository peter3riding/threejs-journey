import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import CustomObject from "./CustomObject.jsx";

export default function Experience() {
  const cubeRef = useRef();
  useFrame((state, delta) => {
    cubeRef.current.rotation.y += delta;
  });
  return (
    <>
      <directionalLight position={[1, 2, 3]} intensity={4.5} />
      <ambientLight intensity={1.5} />

      <group>
        <mesh position-x={-2}>
          <sphereGeometry />
          <meshStandardMaterial color="orange" />
        </mesh>

        <mesh
          ref={cubeRef}
          rotation-y={Math.PI * 0.25}
          position-x={2}
          scale={1.5}
        >
          <boxGeometry />
          <meshStandardMaterial color="mediumpurple" />
        </mesh>
      </group>

      <mesh position-y={-1} rotation-x={-Math.PI * 0.5} scale={10}>
        <planeGeometry />
        <meshStandardMaterial color="greenyellow" />
      </mesh>

      <CustomObject />
    </>
  );
}
