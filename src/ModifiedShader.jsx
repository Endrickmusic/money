import { OrbitControls, useEnvironment, useTexture, Detailed } from "@react-three/drei"
import { useRef, useEffect, useMemo, useState } from "react"
import { useThree, useFrame } from "@react-three/fiber"
import { DoubleSide, PlaneGeometry, Vector2, MathUtils } from "three"

import ModifiedShader from './ModifiedMaterial.jsx'


export default function Shader({positions}){

    const meshRef = useRef()
    const materialRef = useRef()
    const debugObject = {}

    debugObject.Color = '#4242c1'

    const options = useMemo(()=>({
      BigElevation: 0.18,
      BigFrequency: 2.1,
      BigSpeed: 0.2,
      NoiseRangeDown: -1.3,
      NoiseRangeUp: 1.3,
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
  
  const envMap = useEnvironment({files:'./hdri/aerodynamics_workshop_2k.hdr'})
  const [normalMap, roughnessMap] = useTexture(['./textures/waternormals.jpeg', './textures/SurfaceImperfections003_1K_var1.jpg'])
  const [ euro50, euro100, euro200, euro500 ] = useTexture(['./textures/50euro.jpg', './textures/100euro.jpg', './textures/200euro.jpg', './textures/500euro.jpg'])

  
    // Custom UV coordinates for the plane geometry
    const planeGeometry = new PlaneGeometry(2, 1.16, 256, 256)
    const uvAttribute = planeGeometry.getAttribute('uv')
    const numUvs = uvAttribute.count
  
    for (let i = 0; i < numUvs; i++) {
      const uv = new Vector2(uvAttribute.getX(i), uvAttribute.getY(i))
      if (uv.y > 0) {
        uv.y = 1 - uv.y
        uv.y *= 0.5
        uv.y += 0.5
      } else {
        uv.y = 1 - uv.y
        uv.y *= 0.5
        uv.y -= 0.5
      }
      uvAttribute.setXY(i, uv.x, uv.y)
    }
    uvAttribute.needsUpdate = true

  return (
    <>
      <OrbitControls />  

      <directionalLight 
      position={[0, 2, 0]}
      intensity={3}
      />

      <Money />

      <group>      
        <mesh 
        ref={meshRef}
        rotation={[Math.PI, 0, 0.2 * Math.PI]}
        position={positions}
        >
            {/* <planeGeometry 
            args={[2, 2, 256, 256]} 
            /> */}

            <primitive object={planeGeometry} />
            <meshStandardMaterial
              ref={materialRef}
              side={DoubleSide}
              wireframe={false}
              roughness={0.15}
              // roughnessMap={roughnessMap}
              metalness={0.1}
              envMap={envMap}
              normalMap={normalMap}
              normalScale={0.2}
              map={euro500}
            />
        </mesh>

        <ModifiedShader 
        options={options}
        meshRef={meshRef}
        /> 

      </group>
   
   </>
  )}
