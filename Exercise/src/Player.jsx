import { useRef, useEffect, useState } from "react";
import { RigidBody, useRapier } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import * as T from "three";
import useGame from "./stores/useGame";

export default function Player() {
  const [subscribeKeys, getKeys] = useKeyboardControls();

  // get states.
  const start = useGame((state) => state.start);
  const end = useGame((state) => state.end);
  const restart = useGame((state) => state.restart);
  const blocksCount = useGame((state) => state.blocksCount);

  //   Access Rapier Library and native Rapier world;
  const { rapier, world } = useRapier();

  //   Ref to PLayer RigidBody
  const rigidBodyRef = useRef();

  //   Function for jump
  const jump = () => {
    // Get origin and set direction to cast ray.
    const origin = rigidBodyRef.current.translation();
    const direction = { x: 0, y: -1, z: 0 };

    // Move origin from ball centre to ball bottom. Ball size is 0.4 - so set it slightly below.
    origin.y -= 0.41;

    // Create and cast ray
    const ray = new rapier.Ray(origin, direction);
    const hit = world.castRay(ray, 10, true); //ray, max distance of ray, true sets all objects as filled rather than hollow

    // Apply jump if time of impact is less than 0.15.
    if (hit.timeOfImpact < 0.15) {
      rigidBodyRef.current.applyImpulse({ x: 0, y: 1, z: 0 });
    }
  };

  // Reset when falling from map
  const reset = () => {
    rigidBodyRef.current.setTranslation({ x: 0, y: 2, z: 0 });
    rigidBodyRef.current.setLinvel({ x: 0, y: 0, z: 0 });
    rigidBodyRef.current.setAngvel({ x: 0, y: 0, z: 0 });
  };

  //   Instead of listening to keys on each frame do it once in useEffect
  useEffect(() => {
    // Subscribe to store
    const unsubscribePhase = useGame.subscribe(
      (state) => state.phase,
      (phase) => {
        if (phase === "ready") reset();
        console.log(phase);
      }
    );
    // SubscribeKeys Function returns a function to unsubscribe
    const unsubscribeJump = subscribeKeys(
      // First function is the key to listen to
      (state) => state.jump,
      //   Second function is to trigger when value(v) changes
      (v) => {
        if (v) jump();
      }
    );

    // susbscribe to all defined key changes
    const unsubscribeAny = subscribeKeys(
      (s) => [s.forward, s.left, s.right],
      (v) => {
        if (v[0] || v[1] || v[2]) start();
      }
    );

    // subscribe to keyR
    const unsubscribeR = subscribeKeys(
      (s) => s.restart,
      (v) => {
        if (v) restart();
      }
    );

    return () => {
      unsubscribeJump();
      unsubscribeAny();
      unsubscribePhase();
      unsubscribeR();
    };
  }, []);

  //   Listen to key changes every frame to apply rotation and impulse.
  useFrame((state, delta) => {
    // Get keys defined in index.js using KeyboardControls
    const { forward, right, left, backward } = getKeys();

    // Define impulse and torque
    const impulse = { x: 0, y: 0, z: 0 };
    const torque = { x: 0, y: 0, z: 0 };

    // Make behaviour same across different frame rates by using delta.
    const impulseStrength = 1 * delta;
    const torqueStrength = 0.3 * delta;

    // Apply transformations to impulse and torque objects
    if (forward) (impulse.z -= impulseStrength), (torque.x -= torqueStrength);
    if (right) (impulse.x += impulseStrength), (torque.z -= torqueStrength);
    if (backward) (impulse.z += impulseStrength), (torque.x += torqueStrength);
    if (left) (impulse.x -= impulseStrength), (torque.z += torqueStrength);

    // Apply transformations to Player Rigid Body
    rigidBodyRef.current.applyImpulse(impulse);
    rigidBodyRef.current.applyTorqueImpulse(torque);
  });

  //   Camera Animation

  //   Values for lerping
  const [smoothCam] = useState(() => new T.Vector3(0, 10, 10));
  const [smoothCamTarget] = useState(() => new T.Vector3(0, 10, -2));

  useFrame((state, delta) => {
    // vec3 position of player.
    const playerPos = rigidBodyRef.current.translation();

    // Camera position - same as playerPos by slightly further back and higher.
    const cameraPosition = new T.Vector3();
    cameraPosition.copy(playerPos);
    cameraPosition.z += 3.5;
    cameraPosition.y += 1.2;

    // A vector 3 for the camera to look at so that the user can see the level infront.
    const cameraTarget = new T.Vector3();
    cameraTarget.copy(playerPos);
    cameraTarget.y += 0.5;

    smoothCam.lerp(cameraPosition, 5 * delta);
    smoothCamTarget.lerp(cameraTarget, 5 * delta);

    // Setting new objects to scene camera.
    state.camera.position.copy(smoothCam);
    state.camera.lookAt(smoothCamTarget);

    // Phases
    if (playerPos.z < -(blocksCount * 5 + 2.5)) end();
    if (playerPos.y < -2) restart();
  });
  return (
    <>
      <RigidBody
        position={[0, 2.5, 0]}
        restitution={0.2}
        friction={1}
        colliders="ball"
        canSleep={false}
        ref={rigidBodyRef}
        linearDamping={0.7}
        angularDamping={0.3}
      >
        <mesh castShadow>
          {/* <sphereGeometry args={[0.4, 12, 12, 32]} /> */}
          <icosahedronGeometry args={[0.4, 5]} />
          <meshStandardMaterial flatShading color={"#E7B900"} />
        </mesh>
      </RigidBody>
    </>
  );
}
