import { useRef, useState } from 'react'
import Logo from '/face-blowing-a-kiss.svg'
import { Canvas, useThree, useFrame } from "@react-three/fiber"
import { Environment, Detailed } from "@react-three/drei"
import { MathUtils } from "three"

import './index.css'

import Experience from "./Experience"

function Money({ index, z, speed }) {
  const ref = useRef()
  // useThree gives you access to the R3F state model
  const { viewport, camera } = useThree()
  // getCurrentViewport is a helper that calculates the size of the viewport
  const { width, height } = viewport.getCurrentViewport(camera, [0, 0, -z])

  // Local component state, it is safe to mutate because it's fixed data
  const [data] = useState({
    // Randomly distributing the objects along the vertical
    y: MathUtils.randFloatSpread(height * 2),
    // This gives us a random value between -1 and 1, we will multiply it with the viewport width
    x: MathUtils.randFloatSpread(2),
    // How fast objects spin, randFlost gives us a value between min and max, in this case 8 and 12
    spin: MathUtils.randFloat(8, 12),
    // Some random rotations, Math.PI represents 360 degrees in radian
    rX: Math.random() * Math.PI,
    rZ: Math.random() * Math.PI
  })

  // useFrame executes 60 times per second
  useFrame((state, dt) => {
    // Make the X position responsive, slowly scroll objects up at the Y, distribute it along the Z
    // dt is the delta, the time between this frame and the previous, we can use it to be independent of the screens refresh rate
    // We cap dt at 0.1 because now it can't accumulate while the user changes the tab, it will simply stop
    if (dt < 0.1) ref.current.position.set(index === 0 ? 0 : data.x * width, (data.y += dt * speed), -z)
    // Rotate the object around
    ref.current.rotation.set((data.rX += dt / data.spin), Math.sin(index * 1000 + state.clock.elapsedTime / 10) * Math.PI, (data.rZ += dt / data.spin))
    // If they're too far up, set them back to the bottom
    if (data.y > height * (index === 0 ? 4 : 1)) data.y = -(height * (index === 0 ? 4 : 1))
  })

  // Using drei's detailed is a nice trick to reduce the vertex count because
  // we don't need high resolution for objects in the distance. The model contains 3 decimated meshes ...
  return (
    <Detailed ref={ref} distances={[0, 65, 80]}>
      <mesh>
        <planeGeometry args={[2, 1.16, 256, 256]}/>
        <meshStandardMaterial />
      </mesh>

      <mesh>
        <planeGeometry args={[2, 1.16, 128, 128]}/>
        <meshStandardMaterial />
      </mesh>

      <mesh>
        <planeGeometry args={[2, 1.16, 64, 64]}/>
        <meshStandardMaterial />
      </mesh>

    </Detailed>
  )
}

export default function App({ speed = 1, count = 100, depth = 80, easing = (x) => Math.sqrt(1 - Math.pow(x - 1, 2)) }) {

 return (

  
    <Canvas shadows camera={{ position: [0, 0, 5], fov: 40 }}>
        <color 
          attach="background" 
          args={["#000000"]} />
      {/* <Experience /> */}

            {/* As of three > r153 lights work differently in threejs, to get similar results as before you have to add decay={0} */}
            <spotLight position={[10, 20, 10]} penumbra={1} decay={0} intensity={3} color="orange" />
      {/* Using cubic easing here to spread out objects a little more interestingly, i wanted a sole big object up front ... */}
        {Array.from({ length: count }, (_, i) => <Money key={i} index={i} z={Math.round(easing(i / count) * depth)} speed={speed} /> /* prettier-ignore */)}
        <Environment preset="sunset" />
    </Canvas>
  
  );
}

