import { Physics } from "@react-three/rapier";
import useGame from "./stores/useGame.js";

// Components
import Lights from "./Lights.jsx";
import Level, {
  HorizontalBlockingBlock,
  SpinnerBlock,
  VerticalBlockingBlock,
} from "./Level.jsx";

export default function Experience() {
  const blocksCount = useGame((state) => state.blocksCount);
  const blockSeed = useGame((state) => state.blockSeed);

  return (
    <>
      <color args={["#00406b"]} attach={"background"} />

      <Physics>
        <Lights />
        <Level
          count={blocksCount}
          seed={blockSeed}
          obstacles={[
            SpinnerBlock,
            VerticalBlockingBlock,
            HorizontalBlockingBlock,
          ]}
        />
      </Physics>
    </>
  );
}
