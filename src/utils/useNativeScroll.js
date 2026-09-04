'use client'

import { useEffect, useRef } from 'react'

export function useNativeScroll() {
  const scrollRef = useRef(0)
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      // Track scroll over the entire document height
      const maxScroll = Math.max(document.body.scrollHeight - window.innerHeight, 1)
      scrollRef.current = Math.min(Math.max(scrollY / maxScroll, 0), 1)
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  return scrollRef
}
