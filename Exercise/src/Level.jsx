import { useFrame } from "@react-three/fiber";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { useMemo, useRef, useState } from "react";
import { useGLTF } from "@react-three/drei";
import * as T from "three";

import Boundary from "./Boundary";
import Player from "./Player";

const boxGeometry = new T.BoxGeometry(1, 1, 1);
const floorMaterial = new T.MeshStandardMaterial({ color: "#03468e" });
const wallMaterial = new T.MeshStandardMaterial({ color: "#1e3a7e" });
const obstacleMaterial = new T.MeshStandardMaterial({ color: "#01184f" });

const Level = ({
  count = 5,
  obstacles = [SpinnerBlock, VerticalBlockingBlock, HorizontalBlockingBlock],
  seed = 0,
}) => {
  const blocks = useMemo(() => {
    const blocks = [];

    for (let i = 0; i < count; i++) {
      blocks.push(obstacles[Math.floor(Math.random() * obstacles.length)]);
    }

    return blocks;
  }, [count, obstacles, seed]);
  return (
    <>
      {/* Player */}
      <Player />

      {/* Level Start */}
      <StartBlock />

      {/* Obstacles */}
      {blocks.map((Block, idx) => (
        <Block key={`obs_${idx}`} position={[0, 0, -(idx + 1) * 5]} />
      ))}

      {/* Level Walls */}
      <Boundary
        geometry={boxGeometry}
        material={wallMaterial}
        levelLength={count + 2}
      />

      {/* Level End */}
      <EndBlock position={[0, 0.01, -((count + 1) * 5)]} />
    </>
  );
};

export default Level;

export const StartBlock = ({ position = [0, 0, 0] }) => {
  return (
    <>
      <group position={position}>
        {/* Floor */}

        <mesh
          geometry={boxGeometry}
          position={[0, -0.25, 0]}
          scale={[5, 0.5, 5]}
          material={floorMaterial}
          receiveShadow
        />
      </group>
    </>
  );
};

export const EndBlock = ({ position = [0, 0, 0] }) => {
  const hamburger = useGLTF("./hamburger.glb");

  hamburger.scene.children.forEach((mesh) => (mesh.castShadow = true));

  return (
    <>
      <group position={position}>
        {/* Floor */}

        <mesh
          geometry={boxGeometry}
          material={floorMaterial}
          position={[0, -0.25, 0]}
          scale={[5, 0.5, 5]}
          receiveShadow
        />

        <RigidBody
          type="fixed"
          colliders={"hull"}
          restitution={0.2}
          friction={1}
          position-y={0.5}
        >
          <primitive object={hamburger.scene} scale={0.15} />
        </RigidBody>
      </group>
    </>
  );
};

export const SpinnerBlock = (props) => {
  const [speed] = useState(
    () => (Math.random() + 1) * (Math.random() < 0.5 ? -1 : 1)
  );
  const spinnerRef = useRef();

  const eulerRotation = new T.Euler(0, 0, 0);
  const quaternionRotation = new T.Quaternion();

  useFrame((state) => {
    eulerRotation.set(0, state.clock.elapsedTime * speed, 0);
    quaternionRotation.setFromEuler(eulerRotation);

    spinnerRef.current.setNextKinematicRotation(quaternionRotation);
  });

  return (
    <>
      <group {...props}>
        {/* Floor */}

        <mesh
          geometry={boxGeometry}
          material={floorMaterial}
          position={[0, -0.25, 0]}
          scale={[5, 0.5, 5]}
          receiveShadow
        />

        {/* Spinner */}
        <RigidBody
          restitution={0.3}
          position-y={0.26}
          colliders={false}
          ref={spinnerRef}
          type="kinematicPosition"
        >
          <mesh
            geometry={boxGeometry}
            material={obstacleMaterial}
            scale={[0.5, 0.5, 4.5]}
            castShadow
            receiveShadow
          />
          <CuboidCollider args={[0.25, 0.25, 2.25]} />
        </RigidBody>
      </group>
    </>
  );
};

export const VerticalBlockingBlock = (props) => {
  const [offset] = useState(() => Math.random() * Math.PI * 2);
  const obstacleRef = useRef();

  useFrame((state) => {
    const y = Math.sin(state.clock.elapsedTime + offset) + 2.26;

    obstacleRef.current.setNextKinematicTranslation({
      x: props.position[0],
      y: props.position[1] + y,
      z: props.position[2],
    });
  });
  return (
    <>
      <group {...props}>
        {/* Floor */}

        <mesh
          geometry={boxGeometry}
          material={floorMaterial}
          position={[0, -0.25, 0]}
          scale={[5, 0.5, 5]}
          receiveShadow
        />

        {/* Blocker */}

        <RigidBody
          restitution={0.3}
          type="kinematicPosition"
          position-y={2.6}
          ref={obstacleRef}
        >
          <mesh
            geometry={boxGeometry}
            material={obstacleMaterial}
            scale={[4.5, 2.5, 0.5]}
            castShadow
            receiveShadow
          />
        </RigidBody>
      </group>
    </>
  );
};

export const HorizontalBlockingBlock = (props) => {
  const [offset] = useState(() => Math.random() * Math.PI * 2);
  const obstacleRef = useRef();

  useFrame((state) => {
    const x = Math.sin(state.clock.elapsedTime + offset);

    obstacleRef.current.setNextKinematicTranslation({
      x: props.position[0] + x,
      y: props.position[1] + 2.1,
      z: props.position[2],
    });
  });
  return (
    <>
      <group {...props}>
        {/* Floor */}

        <mesh
          geometry={boxGeometry}
          material={floorMaterial}
          position={[0, -0.25, 0]}
          scale={[5, 0.5, 5]}
          receiveShadow
        />

        {/* Blocker */}

        <RigidBody position-y={5} type="kinematicPosition" ref={obstacleRef}>
          <mesh
            geometry={boxGeometry}
            material={obstacleMaterial}
            scale={[3, 4, 0.5]}
            castShadow
            receiveShadow
          />
        </RigidBody>
      </group>
    </>
  );
};
