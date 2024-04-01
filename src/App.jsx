import { useState } from 'react'
import Logo from '/face-blowing-a-kiss.svg'
import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import Experience from "./Experience";
import './index.css'

export default function App() {
  
  const [count, setCount] = useState(0)

 return (

  
    <Canvas shadows camera={{ position: [0, 0, 2], fov: 40 }}>
        <color 
          attach="background" 
          args={["#aaefef"]} />
      <Experience />
    </Canvas>
  
  );
}

