import React, {  useRef, useEffect } from "react";
import { useGLTF, useFBX, useAnimations } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";


export function Sopia(props) {
  const { nodes, materials } = useGLTF("/models/sopia.glb");
  const { animations: idleAnimation } = useFBX("/animations/Idle.fbx");
  const { animations: angryAnimation } = useFBX("/animations/Angry.fbx");
  const { animations: laughingAnimation } = useFBX("/animations/Laughing.fbx");
  const { animations: greetingAnimation } = useFBX(
    "/animations/Standing Greeting.fbx"
  );
  const { animations: talkingAnimation } = useFBX("/animations/Talking.fbx");

  idleAnimation[0].name = "Idle";
  angryAnimation[0].name = "Angry";
  laughingAnimation[0].name = "Laugh";
  greetingAnimation[0].name = "Greeting";
  talkingAnimation[0].name = "Talking";

  const { animation = "Idle" } = props;
  const group = useRef();
  const { actions } = useAnimations(
    [
      idleAnimation[0],
      angryAnimation[0],
      laughingAnimation[0],
      greetingAnimation[0],
      talkingAnimation[0],
    ],
    group
  );

  useEffect(() => {
    if (actions[animation]) {
      actions[animation].reset().fadeIn(0.5).play();
    }

    return () => {
      if (actions[animation]) {
        actions[animation].fadeOut(0.5);
      }
    };
  }, [animation, actions]);

  useFrame((state) => {

    const headFollow = true;
    if (headFollow && group.current) {
      const head = group.current.getObjectByName("Head");
      if (head) {
        head.lookAt(state.camera.position);
      }
    }
    const bodyFollow = true;
    if (bodyFollow && group.current) {
      const head = group.current.getObjectByName("Body");
      if (head) {
        head.lookAt(state.camera.position);
      }
    }
  });
  return (
    <group {...props} dispose={null} ref={group}>
      <primitive object={nodes.Hips} />
      <skinnedMesh
        geometry={nodes.Wolf3D_Headwear.geometry}
        material={materials.Wolf3D_Headwear}
        skeleton={nodes.Wolf3D_Headwear.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Outfit_Top.geometry}
        material={materials.Wolf3D_Outfit_Top}
        skeleton={nodes.Wolf3D_Outfit_Top.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Outfit_Bottom.geometry}
        material={materials.Wolf3D_Outfit_Bottom}
        skeleton={nodes.Wolf3D_Outfit_Bottom.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Outfit_Footwear.geometry}
        material={materials.Wolf3D_Outfit_Footwear}
        skeleton={nodes.Wolf3D_Outfit_Footwear.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Body.geometry}
        material={materials.Wolf3D_Body}
        skeleton={nodes.Wolf3D_Body.skeleton}
      />
      <skinnedMesh
        name="EyeLeft"
        geometry={nodes.EyeLeft.geometry}
        material={materials.Wolf3D_Eye}
        skeleton={nodes.EyeLeft.skeleton}
        morphTargetDictionary={nodes.EyeLeft.morphTargetDictionary}
        morphTargetInfluences={nodes.EyeLeft.morphTargetInfluences}
      />
      <skinnedMesh
        name="EyeRight"
        geometry={nodes.EyeRight.geometry}
        material={materials.Wolf3D_Eye}
        skeleton={nodes.EyeRight.skeleton}
        morphTargetDictionary={nodes.EyeRight.morphTargetDictionary}
        morphTargetInfluences={nodes.EyeRight.morphTargetInfluences}
      />
      <skinnedMesh
        name="Wolf3D_Head"
        geometry={nodes.Wolf3D_Head.geometry}
        material={materials.Wolf3D_Skin}
        skeleton={nodes.Wolf3D_Head.skeleton}
        morphTargetDictionary={nodes.Wolf3D_Head.morphTargetDictionary}
        morphTargetInfluences={nodes.Wolf3D_Head.morphTargetInfluences}
      />
      <skinnedMesh
        name="Wolf3D_Teeth"
        geometry={nodes.Wolf3D_Teeth.geometry}
        material={materials.Wolf3D_Teeth}
        skeleton={nodes.Wolf3D_Teeth.skeleton}
        morphTargetDictionary={nodes.Wolf3D_Teeth.morphTargetDictionary}
        morphTargetInfluences={nodes.Wolf3D_Teeth.morphTargetInfluences}
      />
    </group>
  );
}

useGLTF.preload("/models/sopia.glb");
