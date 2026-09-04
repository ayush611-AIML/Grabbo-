'use client'

import { useRef, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sparkles, Float, MeshDistortMaterial, BakeShadows, AdaptiveDpr } from '@react-three/drei'
import { useNativeScroll } from '@/utils/useNativeScroll'
import StoreInterior from './StoreInterior'

function CinematicBackground() {
  const scrollRef = useNativeScroll()
  const groupRef = useRef()

  useFrame((state, delta) => {
    const offset = scrollRef.current
    
    // Instead of rotating, we push the camera forward down the Z-axis.
    // We map the scroll offset (0 to 1) to a Z position (0 to -30).
    const maxZ = -30
    const targetZ = offset * maxZ
    
    // Add subtle camera sway to make it feel cinematic and handheld
    const swayX = Math.sin(state.clock.elapsedTime * 0.5) * 0.5
    const swayY = Math.cos(state.clock.elapsedTime * 0.3) * 0.2
    
    // Smoothly interpolate the camera position
    state.camera.position.z += (targetZ - state.camera.position.z) * 0.1
    state.camera.position.x = swayX
    state.camera.position.y = 2 + swayY // Camera at eye level (2 units up)
    
    // Keep camera looking straight ahead down the aisle
    state.camera.lookAt(swayX, 2 + swayY, targetZ - 10)
  })

  return (
    <group ref={groupRef}>
      <StoreInterior />
      
      {/* Atmospheric Fog to blend the end of the aisle */}
      <fog attach="fog" args={['#030508', 15, 45]} />
      
      {/* Subtle floating dust particles */}
      <Sparkles count={300} scale={[10, 5, 40]} position={[0, 2, -15]} size={1} speed={0.2} opacity={0.1} color="#ffffff" />
    </group>
  )
}

export default function Scene() {
  return (
    <div className="w-full h-screen fixed top-0 left-0 z-0 pointer-events-none">
      <Canvas shadows dpr={[1, 1.5]} camera={{ position: [0, 2, 0], fov: 45 }}>
        <color attach="background" args={['#030508']} />
        <ambientLight intensity={2} />
        <directionalLight position={[10, 10, 5]} intensity={3} color="#d4af37" />
        <spotLight position={[-10, -10, -5]} intensity={2} color="#ffffff" />
        
        <BakeShadows />
        <AdaptiveDpr pixelated />

        <Suspense fallback={null}>
          <CinematicBackground />
        </Suspense>
      </Canvas>
      
      {/* Gradient overlay for blending */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#030508]/50 to-[#0b0f19]" />
    </div>
  )
}
