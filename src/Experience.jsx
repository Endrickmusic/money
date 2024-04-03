import { OrbitControls, RoundedBox } from "@react-three/drei"
import { useLoader } from "@react-three/fiber"

import ModifiedShader from './ModifiedShader.jsx'

export default function Experience(){

  const position1 = [-1, -0.5, 1]
  const position2 = [-1, 1.5, -1]
  const position3 = [0.5, -0.5, 1.5]

  return (
    <>
      <OrbitControls />    
      <ModifiedShader 
      positions={position1}
      />
      <ModifiedShader 
      positions={position2}
      />
      <ModifiedShader 
      positions={position3}
      />
   </>
  )}
