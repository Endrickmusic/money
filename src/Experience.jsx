import { OrbitControls, RoundedBox } from "@react-three/drei"
import { useLoader } from "@react-three/fiber"

import ModifiedShader from './ModifiedShader.jsx'

export default function Experience(){


  return (
    <>
      <OrbitControls />    
      <ModifiedShader />
   </>
  )}