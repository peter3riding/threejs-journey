import { Clone, useGLTF } from "@react-three/drei";

export default function Model() {
  const model = useGLTF("./hamburger-draco.glb");
  return <primitive object={model.scene} scale={0.35} position-y={-1} />;
}

useGLTF.preload("./hamburger-draco.glb");
