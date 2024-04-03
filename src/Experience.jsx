import { OrbitControls, RoundedBox } from "@react-three/drei"
import { useLoader } from "@react-three/fiber"

import ModifiedShader from './ModifiedShader.jsx'

export default function Experience(){

  const position1 = [2, 0, 0]
  const position2 = [0, 2, 0]
  const position3 = [0, -2, 1]

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
