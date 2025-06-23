import { CuboidCollider, RigidBody } from "@react-three/rapier";

const Boundary = ({ levelLength = 1, geometry, material }) => {
  return (
    <>
      <RigidBody restitution={0.4} friction={0} type="fixed">
        <mesh
          position={[2.75, 1.5, -((levelLength * 5) / 2) + 2.5]}
          geometry={geometry}
          material={material}
          scale={[0.5, 4, levelLength * 5]}
          castShadow
        />
        <mesh
          position={[-2.75, 1.5, -((levelLength * 5) / 2) + 2.5]}
          geometry={geometry}
          material={material}
          scale={[0.5, 4, levelLength * 5]}
          castShadow
          receiveShadow
        />
        <mesh
          position={[0, 1.5, -(levelLength * 5) + 2.25]}
          geometry={geometry}
          material={material}
          scale={[5, 4, 0.5]}
        />
        <CuboidCollider
          position={[0, -0.25, -((levelLength * 5) / 2) + 2.5]}
          args={[2.5, 0.25, levelLength * 2.5]}
          restitution={0.2}
          friction={1}
        />
        <CuboidCollider args={[2.5, 2, 0.25]} position={[0, 1.5, 2.75]} />
      </RigidBody>
    </>
  );
};

export default Boundary;
