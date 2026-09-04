import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { MeshReflectorMaterial, Text, useTexture } from '@react-three/drei'
import * as THREE from 'three'

// Helper to create random colored products
function Products({ count = 20, width, height, depth }) {
  const meshRef = useRef()
  const { matrices, colors } = useMemo(() => {
    const colorArray = ['#0f172a', '#ffffff', '#d4af37']
    const matrices = new Float32Array(count * 16)
    const colors = new Float32Array(count * 3)
    const tempMatrix = new THREE.Matrix4()
    const tempColor = new THREE.Color()

    for (let i = 0; i < count; i++) {
      const px = (Math.random() - 0.5) * width * 0.9
      const py = (Math.random() - 0.5) * height * 0.8
      const pz = (Math.random() - 0.5) * depth * 0.9
      const sx = 0.1 + Math.random() * 0.1
      const sy = 0.2 + Math.random() * 0.3
      const sz = 0.1 + Math.random() * 0.1
      
      tempMatrix.identity()
      tempMatrix.setPosition(px, py, pz)
      tempMatrix.scale(new THREE.Vector3(sx, sy, sz))
      tempMatrix.toArray(matrices, i * 16)
      
      tempColor.set(colorArray[Math.floor(Math.random() * colorArray.length)])
      tempColor.toArray(colors, i * 3)
    }
    return { matrices, colors }
  }, [count, width, height, depth])

  useEffect(() => {
    if (meshRef.current) {
      const instancedMesh = meshRef.current
      for (let i = 0; i < count; i++) {
        const matrix = new THREE.Matrix4().fromArray(matrices, i * 16)
        instancedMesh.setMatrixAt(i, matrix)
        const color = new THREE.Color().fromArray(colors, i * 3)
        instancedMesh.setColorAt(i, color)
      }
      instancedMesh.instanceMatrix.needsUpdate = true
      if (instancedMesh.instanceColor) instancedMesh.instanceColor.needsUpdate = true
    }
  }, [matrices, colors, count])

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial metalness={0.5} roughness={0.2} />
    </instancedMesh>
  )
}

function ShelfUnit({ position, rotation }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Backboard */}
      <mesh position={[0, 2, -0.4]} castShadow receiveShadow>
        <boxGeometry args={[4, 4, 0.1]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Shelves */}
      {[0.5, 1.5, 2.5, 3.5].map((y, i) => (
        <group key={i}>
          <mesh position={[0, y, 0]} castShadow receiveShadow>
            <boxGeometry args={[3.8, 0.05, 0.8]} />
            <meshStandardMaterial color="#111" metalness={0.6} roughness={0.4} />
          </mesh>
          
          {/* LED Strip under shelf */}
          <mesh position={[0, y - 0.03, 0.35]}>
            <boxGeometry args={[3.8, 0.02, 0.02]} />
            <meshBasicMaterial color="#d4af37" />
          </mesh>
          <pointLight position={[0, y - 0.2, 0.2]} intensity={10} distance={3} color="#d4af37" />

          {/* Products on this specific shelf */}
          <group position={[0, y + 0.2, 0]}>
             <Products count={15} width={3.6} height={0.3} depth={0.6} />
          </group>
        </group>
      ))}
    </group>
  )
}



export default function StoreInterior() {
  const aisleLength = 40
  const aisleWidth = 6
  
  // Create arrays for left and right shelves
  const leftShelves = Array.from({ length: 8 }, (_, i) => i * 5)
  const rightShelves = Array.from({ length: 8 }, (_, i) => i * 5)

  const logoTexture = useTexture('/logo.jpg')

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -aisleLength / 2]} receiveShadow>
        <planeGeometry args={[aisleWidth * 3, aisleLength + 10]} />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={1024}
          mixBlur={1}
          mixStrength={80}
          roughness={0.1}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#050505"
          metalness={0.8}
        />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 5, -aisleLength / 2]}>
        <planeGeometry args={[aisleWidth * 3, aisleLength + 10]} />
        <meshStandardMaterial color="#020202" roughness={0.9} />
      </mesh>

      {/* Overhead Fluorescent Lights */}
      {Array.from({ length: 10 }, (_, i) => (
        <group key={i} position={[0, 4.9, -i * 4]}>
          <mesh>
            <boxGeometry args={[0.2, 0.1, 2]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          <pointLight intensity={20} distance={15} color="#ffffff" />
        </group>
      ))}

      {/* Left Aisle (Standard Shelves) */}
      {leftShelves.map((z, i) => (
        <ShelfUnit key={`l-${i}`} position={[-aisleWidth / 2, 0, -z]} rotation={[0, Math.PI / 2, 0]} />
      ))}

      {/* Right Aisle (All Shelves) */}
      {rightShelves.map((z, i) => (
        <ShelfUnit key={`r-${i}`} position={[aisleWidth / 2, 0, -z]} rotation={[0, -Math.PI / 2, 0]} />
      ))}
      
      {/* End of Aisle Wall / Cash Wrap Placeholder */}
      <group position={[0, 0, -aisleLength]}>
        <mesh position={[0, 2.5, 0]}>
          <boxGeometry args={[aisleWidth * 2, 5, 1]} />
          <meshStandardMaterial color="#080a0f" />
        </mesh>
        
        {/* Glowing Logo Sign at the back */}
        <group position={[0, 3.5, 0.61]}>
          <Text
            position={[-0.12, 0.4, 0]}
            fontSize={0.9}
            color="#ffffff"
            letterSpacing={0.2}
            anchorX="center"
            anchorY="middle"
          >
            GRABBO
            <meshBasicMaterial color="#ffffff" toneMapped={false} />
          </Text>
          <mesh position={[0, -1.0, 0]}>
            <circleGeometry args={[0.7, 64]} />
            <meshBasicMaterial map={logoTexture} toneMapped={false} />
          </mesh>
        </group>
      </group>
    </group>
  )
}
