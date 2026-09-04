'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import { useNativeScroll } from '@/utils/useNativeScroll'

export function CoffeeCup({ position }) {
  const group = useRef()
  const lid = useRef()
  const sleeve = useRef()
  const liquid = useRef()
  const drop1 = useRef()
  const drop2 = useRef()
  const drop3 = useRef()
  
  const scrollRef = useNativeScroll()

  useFrame((state, delta) => {
    // scroll.offset goes from 0 to 1 as the user scrolls natively
    const offset = scrollRef.current
    
    if (group.current) {
      group.current.rotation.y += delta * 0.3
    }

    // Spread out the parts based on scroll
    if (lid.current) {
      lid.current.position.y = 1.2 + offset * 4 // Lid flies up
      lid.current.rotation.x = offset * 1.5 // Lid tilts
      lid.current.rotation.z = offset * 0.5
    }
    
    if (sleeve.current) {
      sleeve.current.position.y = 0 + offset * -2.5 // Sleeve slides down
      sleeve.current.rotation.z = offset * -0.5 
    }
    
    if (liquid.current) {
      liquid.current.position.y = 0.9 + offset * 1.5 // Coffee rises
      liquid.current.scale.y = 1 + offset * 3 // Coffee stretches
    }

    // Coffee drops spreading out wider
    if (drop1.current) {
      drop1.current.position.set(offset * 4.5, 1.5 + offset * 6, offset * 3.5)
      drop1.current.scale.setScalar(offset * 1.5)
    }
    if (drop2.current) {
      drop2.current.position.set(offset * -3.5, 1.2 + offset * 5.5, offset * -4)
      drop2.current.scale.setScalar(offset * 2)
    }
    if (drop3.current) {
      drop3.current.position.set(offset * 2.5, 1.0 + offset * 4.5, offset * -3.5)
      drop3.current.scale.setScalar(offset * 1.2)
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
      <group ref={group} position={position} dispose={null}>
        {/* Cup Body */}
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.9, 0.7, 2.4, 32]} />
          <meshStandardMaterial color="#f8f9fa" roughness={0.5} />
        </mesh>
        
        {/* Sleeve */}
        <mesh ref={sleeve} castShadow receiveShadow position={[0, 0, 0]}>
          <cylinderGeometry args={[0.92, 0.82, 0.8, 32]} />
          <meshStandardMaterial color="#d4af37" roughness={0.6} metalness={0.4} />
        </mesh>
        
        {/* Coffee Liquid Center */}
        <mesh ref={liquid} position={[0, 0.9, 0]}>
          <cylinderGeometry args={[0.85, 0.85, 0.2, 32]} />
          <meshStandardMaterial color="#3b200b" roughness={0.1} metalness={0.2} transparent opacity={0.9} />
        </mesh>

        {/* Coffee Drops */}
        <mesh ref={drop1} position={[0, 1.5, 0]} scale={0}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial color="#3b200b" roughness={0.1} metalness={0.2} />
        </mesh>
        <mesh ref={drop2} position={[0, 1.5, 0]} scale={0}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial color="#3b200b" roughness={0.1} metalness={0.2} />
        </mesh>
        <mesh ref={drop3} position={[0, 1.5, 0]} scale={0}>
          <sphereGeometry args={[0.25, 16, 16]} />
          <meshStandardMaterial color="#3b200b" roughness={0.1} metalness={0.2} />
        </mesh>

        {/* Lid */}
        <mesh ref={lid} castShadow position={[0, 1.2, 0]}>
          <cylinderGeometry args={[0.95, 0.95, 0.2, 32]} />
          <meshStandardMaterial color="#111111" roughness={0.4} />
        </mesh>
      </group>
    </Float>
  )
}
