'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'

export function SodaCan({ position, color = '#ff4040' }) {
  const meshRef = useRef(null)
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5
      meshRef.current.rotation.z += delta * 0.2
    }
  })

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2} position={position}>
      <mesh ref={meshRef} castShadow>
        <cylinderGeometry args={[0.5, 0.5, 1.5, 32]} />
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.2} />
      </mesh>
    </Float>
  )
}

export function ChipsBag({ position, color = '#4080ff' }) {
  const meshRef = useRef(null)
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y -= delta * 0.4
      meshRef.current.rotation.x += delta * 0.3
    }
  })

  return (
    <Float speed={2.5} rotationIntensity={1.5} floatIntensity={1.5} position={position}>
      <mesh ref={meshRef} castShadow>
        <boxGeometry args={[1.2, 1.8, 0.4]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
    </Float>
  )
}

export function CandyBar({ position, color = '#ffd700' }) {
  const meshRef = useRef(null)
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.6
      meshRef.current.rotation.x -= delta * 0.2
    }
  })

  return (
    <Float speed={3} rotationIntensity={2} floatIntensity={2} position={position}>
      <mesh ref={meshRef} castShadow>
        <boxGeometry args={[1.5, 0.4, 0.3]} />
        <meshStandardMaterial color={color} roughness={0.4} />
      </mesh>
    </Float>
  )
}
