import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export function Algo(props) {
  const { nodes, materials } = useGLTF('/models/algorand.glb')
  
  // Check if Plane geometry exists, otherwise use a fallback box geometry
  const geometry = nodes?.Plane?.geometry || null
  
  return (
    <group {...props} dispose={null}>
      {geometry ? (
        <mesh
          castShadow
          receiveShadow
          geometry={geometry}
          material={<meshStandardMaterial color="#3b82f6" />}
          position={[0, -0.765, 0.758]}
          rotation={[0, 0.079, -Math.PI / 2]}
          scale={10}
        />
      ) : (
        // Fallback: render a box if the Plane geometry is not found
        <mesh
          castShadow
          receiveShadow
          position={[0, 0, 0]}
          scale={1}
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#3b82f6" />
        </mesh>
      )}
    </group>
  )
}

useGLTF.preload('/models/algorand.glb')
