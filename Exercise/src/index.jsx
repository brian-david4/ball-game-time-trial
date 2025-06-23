import "./style.css";
import ReactDOM from "react-dom/client";
import { Canvas } from "@react-three/fiber";
import { KeyboardControls } from "@react-three/drei";
import Experience from "./Experience.jsx";
import Interface from "./Interface.jsx";

const root = ReactDOM.createRoot(document.querySelector("#root"));

root.render(
  <KeyboardControls
    map={[
      { name: "forward", keys: ["KeyW", "ArrowUp"] },
      { name: "right", keys: ["KeyD", "ArrowRight"] },
      { name: "backward", keys: ["KeyS", "ArrowDown"] },
      { name: "left", keys: ["KeyA", "ArrowLeft"] },
      { name: "jump", keys: ["Space"] },
      { name: "restart", keys: ["KeyR"] },
    ]}
  >
    <Canvas
      shadows
      camera={{
        fov: 75,
        near: 0.1,
        far: 200,
        position: [2.5, 4, 6],
      }}
    >
      <Experience />
    </Canvas>

    <Interface />
  </KeyboardControls>
);
