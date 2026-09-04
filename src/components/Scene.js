'use client'

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Sparkles, Float, MeshDistortMaterial } from '@react-three/drei'
import { useNativeScroll } from '@/utils/useNativeScroll'
import { Suspense } from 'react'

function AbstractGoldBlob({ position, scale, speed, color }) {
  return (
    <Float speed={speed} rotationIntensity={2} floatIntensity={2} position={position}>
      <mesh castShadow receiveShadow scale={scale}>
        <sphereGeometry args={[1, 64, 64]} />
        <MeshDistortMaterial 
          color={color} 
          envMapIntensity={2} 
          clearcoat={1} 
          clearcoatRoughness={0.1} 
          metalness={0.9} 
          roughness={0.2} 
          distort={0.4} 
          speed={1.5} 
        />
      </mesh>
    </Float>
  )
}

function CinematicBackground() {
  const scrollRef = useNativeScroll()
  const groupRef = useRef()

  useFrame((state, delta) => {
    const offset = scrollRef.current
    if (groupRef.current) {
      // Parallax effect mapped to scroll across entire page
      // Increased wave frequency so it distinctly rotates back and forth in Story and Gallery
      const rotationProgress = offset * Math.PI * 4 
      groupRef.current.rotation.y = Math.sin(rotationProgress) * Math.PI * 0.6
      groupRef.current.position.y = Math.sin(offset * Math.PI * 2) * 3
      groupRef.current.position.z = Math.sin(offset * Math.PI * 2) * -5
    }
    // Keep camera fixed so it only rotates/moves when user scrolls
    state.camera.position.x = 0
    state.camera.lookAt(0, 0, 0)
  })

  return (
    <group ref={groupRef}>
      {/* Abstract Liquid Gold Elements */}
      <AbstractGoldBlob position={[-2, 1, 0]} scale={1.8} speed={1.5} color="#d4af37" />
      <AbstractGoldBlob position={[2.5, -1.5, -2]} scale={1.2} speed={2} color="#b8860b" />
      <AbstractGoldBlob position={[-1, -2, -3]} scale={2.5} speed={1} color="#080808" />
      
      {/* Atmospheric Particles (Mist alternative) */}
      <Sparkles count={300} scale={15} size={3} speed={0.2} opacity={0.3} color="#d4af37" />
      <Sparkles count={100} scale={10} size={1} speed={0.5} opacity={0.1} color="#ffffff" />
    </group>
  )
}

export default function Scene() {
  return (
    <div className="w-full h-screen fixed top-0 left-0 z-0 pointer-events-none">
      <Canvas shadows camera={{ position: [0, 0, 9], fov: 45 }}>
        <color attach="background" args={['#030508']} />
        <ambientLight intensity={0.1} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#d4af37" />
        <spotLight position={[-10, -10, -5]} intensity={0.8} color="#ffffff" />
        
        <Suspense fallback={null}>
          <Environment preset="night" />
          <CinematicBackground />
        </Suspense>
      </Canvas>
      
      {/* Gradient overlay for blending */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#030508]/50 to-[#0b0f19]" />
    </div>
  )
}
