import { Environment, OrbitControls, useTexture } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import React, { useContext } from "react";
import { Jaka } from "./Jaka";
import { Sopia } from "./Sopia";
import { dataContext } from "../Context/user_context";

export const Experience = () => {
  const { selectedGender, selectedBackground, animation } = useContext(dataContext);
  const texture = useTexture(selectedBackground || "textures/room1.jpg");
  const viewport = useThree((state) => state.viewport);

  return (
    <>
      <OrbitControls />
      {selectedGender === "male" && <Jaka position={[0, -5, 2]} scale={3.6} animation={animation} />}
      {selectedGender === "female" && <Sopia position={[0, -5, 2]} scale={3.6} animation={animation} />}
      <Environment preset="sunset" />
      <mesh>
        <planeGeometry args={[viewport.width, viewport.height]} />
        <meshBasicMaterial map={texture} />
      </mesh>
    </>
  );
};
