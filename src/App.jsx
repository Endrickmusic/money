import { useRef, useState, useMemo, useEffect } from 'react'
import { Canvas, useThree, useFrame } from "@react-three/fiber"
import { Environment, Detailed, useTexture, Text } from "@react-three/drei"
import { MathUtils, PlaneGeometry, Vector2, DoubleSide } from "three"
import { EffectComposer, DepthOfField, ToneMapping } from '@react-three/postprocessing'

import Logo from '/face-blowing-a-kiss.svg'
import './index.css'

import Experience from "./Experience"
import ModifiedShader from './ModifiedMaterial.jsx'

function Money({ index, z, speed }) {
  
  const ref = useRef()
  const materialRef = useRef()
  const meshRef = useRef()

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

  const [normalMap, roughnessMap] = useTexture(['./textures/waternormals.jpeg', './textures/SurfaceImperfections003_1K_var1.jpg'])
  const [ euro50, euro100, euro200, euro500 ] = useTexture(['./textures/50euro.jpg', './textures/100euro.jpg', './textures/200euro.jpg', './textures/500euro.jpg'])

  const options = useMemo(()=>({
    BigElevation: 0.88,
    BigFrequency: 0.4,
    BigSpeed: 0.4,
    NoiseRangeDown: -3.0,
    NoiseRangeUp: 3.0,
    Wireframe: false
  }),[])


    useEffect((state, delta) => {

        if (meshRef.current.material.userData.shader) {

          meshRef.current.material.userData.shader.uniforms.uBigWaveElevation.value = options.BigElevation
          meshRef.current.material.userData.shader.uniforms.uBigWaveFrequency.value = options.BigFrequency
          meshRef.current.material.userData.shader.uniforms.uBigWaveSpeed.value = options.BigSpeed
          meshRef.current.material.userData.shader.uniforms.uNoiseRangeDown.value = options.NoiseRangeDown
          meshRef.current.material.userData.shader.uniforms.uNoiseRangeUp.value = options.NoiseRangeUp
          
          materialRef.current.wireframe = options.Wireframe
        }
      },
      [options]

    )


    // Custom UV coordinates for the plane geometry
    const planeHigh = new PlaneGeometry(8, 4.64, 256, 256)
    const uvAttributeHigh = planeHigh.getAttribute('uv')
    const uvsHigh = uvAttributeHigh.count
  
    for (let i = 0; i < uvsHigh; i++) {
      const uv = new Vector2(uvAttributeHigh.getX(i), uvAttributeHigh.getY(i))
      if (uv.y > 0) {
        uv.y = 1 - uv.y
        uv.y *= 0.5
        uv.y += 0.5
      } else {
        uv.y = 1 - uv.y
        uv.y *= 0.5
        uv.y -= 0.5
      }
      uvAttributeHigh.setXY(i, uv.x, uv.y)
    }
    uvAttributeHigh.needsUpdate = true

    const planeMed = new PlaneGeometry(8, 4.64, 128, 128)
    const uvAttributeMed = planeMed.getAttribute('uv')
    const uvsMed = uvAttributeMed.count
  
    for (let i = 0; i < uvsMed; i++) {
      const uv = new Vector2(uvAttributeMed.getX(i), uvAttributeMed.getY(i))
      if (uv.y > 0) {
        uv.y = 1 - uv.y
        uv.y *= 0.5
        uv.y += 0.5
      } else {
        uv.y = 1 - uv.y
        uv.y *= 0.5
        uv.y -= 0.5
      }
      uvAttributeMed.setXY(i, uv.x, uv.y)
    }
    uvAttributeMed.needsUpdate = true

    const planeLow = new PlaneGeometry(8, 4.64, 64, 64)
    const uvAttributeLow = planeLow.getAttribute('uv')
    const uvsLow = uvAttributeLow.count
  
    for (let i = 0; i < uvsLow; i++) {
      const uv = new Vector2(uvAttributeLow.getX(i), uvAttributeLow.getY(i))
      if (uv.y > 0) {
        uv.y = 1 - uv.y
        uv.y *= 0.5
        uv.y += 0.5
      } else {
        uv.y = 1 - uv.y
        uv.y *= 0.5
        uv.y -= 0.5
      }
      uvAttributeLow.setXY(i, uv.x, uv.y)
    }
    uvAttributeLow.needsUpdate = true

  // Using drei's detailed is a nice trick to reduce the vertex count because
  // we don't need high resolution for objects in the distance. The model contains 3 decimated meshes ...
  return (
    <Detailed ref={ref} distances={[0, 65, 80]}>
      <mesh
      ref={meshRef}
      >
      <primitive object={planeHigh} />
        <meshStandardMaterial 
          ref={materialRef}
          side={DoubleSide}
          wireframe={false}
          roughness={0.15}
          // roughnessMap={roughnessMap}
          metalness={0.1}
          // envMap={envMap}
          normalMap={normalMap}
          normalScale={0.2}
          map={euro500}
        />
      </mesh>

      <mesh>
      <primitive object={planeMed} />
        <meshStandardMaterial 
          // ref={materialRef}
          side={DoubleSide}
          wireframe={false}
          roughness={0.15}
          // roughnessMap={roughnessMap}
          metalness={0.1}
          // envMap={envMap}
          normalMap={normalMap}
          normalScale={0.2}
          map={euro500}
        />
      </mesh>

      <mesh>
      <primitive object={planeLow} />
        <meshStandardMaterial 
          // ref={materialRef}
          side={DoubleSide}
          wireframe={false}
          roughness={0.15}
          // roughnessMap={roughnessMap}
          metalness={0.1}
          // envMap={envMap}
          normalMap={normalMap}
          normalScale={0.2}
          map={euro500}
        />
      </mesh>
      <ModifiedShader 
        options={options}
        meshRef={meshRef}
        /> 
    </Detailed>
  )
}

export default function App({ speed = 1, count = 120, depth = 120, easing = (x) => Math.sqrt(1 - Math.pow(x - 1, 2)) }) {



 return (

  
    <Canvas shadows camera={{ position: [0, 0, 5], fov: 40 }}>
        <color 
          attach="background" 
          args={["#000000"]} />
      {/* <Experience /> */}

            {/* As of three > r153 lights work differently in threejs, to get similar results as before you have to add decay={0} */}
      <spotLight position={[10, 20, 10]} penumbra={1} decay={0} intensity={3} color="orange" />

      <Text
      position={[0, 0, -3]}
      maxWidth={7}
      >
        Ich mache alles für Geld
      </Text>


      {/* Using cubic easing here to spread out objects a little more interestingly, i wanted a sole big object up front ... */}
        {Array.from({ length: count }, (_, i) => <Money key={i} index={i} z={Math.round(easing(i / count) * depth)} speed={speed} /> /* prettier-ignore */)}
        <Environment preset="sunset" />

            {/* Multisampling (MSAA) is WebGL2 antialeasing, we don't need it (faster)
          The normal-pass is not required either, saves a bit of performance */}
      <EffectComposer disableNormalPass multisampling={10}>
        <DepthOfField target={[0, 0, 70]} focalLength={0.1} bokehScale={10} height={700} />
        {/* As of three > r154 tonemapping is not applied on rendertargets any longer, it requires a pass */}
        {/* <ToneMapping /> */}
      </EffectComposer>

    </Canvas>
  
  );
}

