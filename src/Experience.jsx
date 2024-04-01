import { OrbitControls, RoundedBox } from "@react-three/drei"
import { useLoader } from "@react-three/fiber"
import * as THREE from "three"


export default function Experience(){


  return (
    <>
      <OrbitControls />    
      <mesh>   
        <planeGeometry args={[1, 1, 32, 32]}/>
          <meshNormalMaterial />
          </mesh>
   </>
  )}