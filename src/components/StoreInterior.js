import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { MeshReflectorMaterial, Text, useTexture } from '@react-three/drei'
import * as THREE from 'three'

// Helper to create random colored products
function Products({ count = 20, width, height, depth }) {
  const products = useMemo(() => {
    const items = []
    const colors = ['#d4af37', '#1a2235', '#2a3b5c', '#ffffff', '#8a7322']
    
    for (let i = 0; i < count; i++) {
      items.push({
        position: [
          (Math.random() - 0.5) * width * 0.9,
          (Math.random() - 0.5) * height * 0.8,
          (Math.random() - 0.5) * depth * 0.9,
        ],
        scale: [
          0.1 + Math.random() * 0.1, // width
          0.2 + Math.random() * 0.3, // height
          0.1 + Math.random() * 0.1, // depth
        ],
        color: colors[Math.floor(Math.random() * colors.length)],
        isGlowing: Math.random() > 0.8
      })
    }
    return items
  }, [count, width, height, depth])

  return (
    <group>
      {products.map((p, i) => (
        <mesh key={i} position={p.position}>
          <boxGeometry args={p.scale} />
          <meshStandardMaterial 
            color={p.color} 
            metalness={0.5} 
            roughness={0.2}
            emissive={p.isGlowing ? p.color : '#000'}
            emissiveIntensity={p.isGlowing ? 0.5 : 0}
          />
        </mesh>
      ))}
    </group>
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

function FridgeUnit({ position, rotation }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Fridge Body */}
      <mesh position={[0, 2, -0.4]} castShadow receiveShadow>
        <boxGeometry args={[4, 4, 1]} />
        <meshStandardMaterial color="#050814" metalness={0.9} roughness={0.1} />
      </mesh>
      
      {/* Glass Door */}
      <mesh position={[0, 2, 0.15]}>
        <boxGeometry args={[3.8, 3.8, 0.05]} />
        <meshPhysicalMaterial 
          color="#88ccff" 
          transmission={0.9} 
          opacity={1} 
          metalness={1} 
          roughness={0} 
          ior={1.5} 
          thickness={0.05} 
        />
      </mesh>

      {/* Internal Cool Light */}
      <pointLight color="#baddff" intensity={30} position={[0, 2, 0.1]} distance={6} />

      {/* Drinks Inside */}
      {[0.5, 1.2, 1.9, 2.6, 3.3].map((y, i) => (
        <group key={i} position={[0, y, -0.2]}>
          <Products count={20} width={3.6} height={0.3} depth={0.4} />
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

      {/* Right Aisle (Mix of Fridges and Shelves) */}
      {rightShelves.map((z, i) => (
        i % 3 === 0 
          ? <FridgeUnit key={`r-${i}`} position={[aisleWidth / 2, 0, -z]} rotation={[0, -Math.PI / 2, 0]} />
          : <ShelfUnit key={`r-${i}`} position={[aisleWidth / 2, 0, -z]} rotation={[0, -Math.PI / 2, 0]} />
      ))}
      
      {/* End of Aisle Wall / Cash Wrap Placeholder */}
      <group position={[0, 0, -aisleLength]}>
        <mesh position={[0, 2.5, 0]}>
          <boxGeometry args={[aisleWidth * 2, 5, 1]} />
          <meshStandardMaterial color="#080a0f" />
        </mesh>
        
        {/* Glowing Logo Sign at the back */}
        <group position={[0, 3.5, 0.61]}>
          <mesh position={[-2, 0, 0]}>
            <circleGeometry args={[0.5, 64]} />
            <meshBasicMaterial map={logoTexture} toneMapped={false} />
          </mesh>
          <Text
            position={[0.5, 0, 0]}
            fontSize={0.8}
            color="#d4af37"
            letterSpacing={0.2}
            anchorX="center"
            anchorY="middle"
          >
            GRABBO
            <meshBasicMaterial color="#d4af37" toneMapped={false} />
          </Text>
        </group>
      </group>
    </group>
  )
}
