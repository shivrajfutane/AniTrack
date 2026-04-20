'use client'

import React, { useEffect, useState } from 'react'
import { useCursorGlow } from '@/hooks/animations/useCursorGlow'
import { motion, AnimatePresence } from 'framer-motion'

export function CustomCursor() {
  const [mounted, setMounted] = useState(false)
  useCursorGlow()
  
  // Custom cursor position state
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [isClicking, setIsClicking] = useState(false)

  useEffect(() => {
    setMounted(true)

    const unbindCursor = () => {
        // Nothing for now
    }

    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      // Check if hovering over clickable elements
      const isClickable = target.closest('a, button, input-[type="submit"], input-[type="image"], label[for], select, div.cursor-pointer, .custom-cursor-hover') !== null
      setIsHovering(isClickable)
    }

    const handleMouseDown = () => setIsClicking(true)
    const handleMouseUp = () => setIsClicking(false)

    window.addEventListener('mousemove', updateMousePosition)
    window.addEventListener('mouseover', handleMouseOver)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', updateMousePosition)
      window.removeEventListener('mouseover', handleMouseOver)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      unbindCursor()
    }
  }, [])

  if (!mounted) return null

  return (
    <>
      <AnimatePresence>
        {/* Core Dot */}
        <motion.div
           key="cursor-dot"
           className="fixed top-0 left-0 w-3 h-3 bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference"
           animate={{
             x: mousePosition.x - 6,
             y: mousePosition.y - 6,
             scale: isClicking ? 0.5 : (isHovering ? 0 : 1),
             opacity: isHovering ? 0 : 1
           }}
           transition={{ type: "tween", ease: "backOut", duration: 0.1 }}
        />
        
        {/* Hover Ring */}
        <motion.div
           key="cursor-ring"
           className="fixed top-0 left-0 w-10 h-10 border border-white/50 rounded-full pointer-events-none z-[9998] flex items-center justify-center mix-blend-difference"
           animate={{
             x: mousePosition.x - 20,
             y: mousePosition.y - 20,
             scale: isHovering ? 1.5 : (isClicking ? 0.8 : 1),
             borderColor: isHovering ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.2)',
             backgroundColor: isHovering ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0)'
           }}
           transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.5 }}
        >
          {isHovering && (
             <motion.div 
               initial={{ scale: 0, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               exit={{ scale: 0, opacity: 0 }}
               className="w-1.5 h-1.5 bg-white rounded-full"
             />
          )}
        </motion.div>
      </AnimatePresence>
    </>
  )
}
