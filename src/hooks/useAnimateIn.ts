'use client'
import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap-config'

interface Options {
  from?: gsap.TweenVars
  scrollTrigger?: boolean
  delay?: number
}

export function useAnimateIn<T extends HTMLElement>(opts: Options = {}) {
  const ref = useRef<T>(null)
  useEffect(() => {
    if (!ref.current) return
    const el = ref.current
    const from: gsap.TweenVars = opts.from ?? { opacity: 0, y: 32 }
    const vars: gsap.TweenVars = {
      ...from,
      duration: 0.6,
      ease: 'power3.out',
      delay: opts.delay ?? 0,
      clearProps: 'all',
    }
    if (opts.scrollTrigger !== false) {
      vars.scrollTrigger = {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none none',
      }
    }
    const ctx = gsap.context(() => gsap.from(el, vars))
    return () => {
      ctx.revert()
      // Note: We don't kill all ScrollTriggers globally here 
      // as it might affect other components. 
      // Killing instances is handled by ctx.revert().
    }
  }, [opts])
  return ref
}
