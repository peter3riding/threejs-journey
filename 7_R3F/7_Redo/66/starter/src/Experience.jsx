import { OrbitControls } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import useGame from "./stores/useGame.jsx";
import Lights from "./Lights.jsx";
import { Level } from "./Level.jsx";
import Player from "./Player.jsx";

export default function Experience() {
  const blocksCount = useGame((state) => state.blocksCount);
  const blocksSeed = useGame((state) => state.blocksSeed);
  const test = useGame((state) => {
    return state;
  });
  return (
    <>
      <color args={["#bdedfc"]} attach="background" />
      <Physics>
        <Lights />
        <Level count={blocksCount} seed={blocksSeed} />
        <Player />
      </Physics>
    </>
  );
}
