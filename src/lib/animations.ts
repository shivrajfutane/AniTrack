'use client'
import { gsap, ScrollTrigger } from './gsap-config'
import anime from 'animejs'

export { gsap, ScrollTrigger }

// ══════════════════════════════════════════════════
// GSAP — PAGE & LAYOUT ANIMATIONS
// ══════════════════════════════════════════════════

/** Fade + slide up on page mount */
export function animatePageEntry(selector = '#page-root') {
  return gsap.from(selector, {
    opacity: 0,
    y: 28,
    duration: 0.65,
    ease: 'power3.out',
    clearProps: 'all',
  })
}

/** Navbar reveal on scroll (add blur + border) */
export function animateNavbarScroll(navSelector = '#navbar') {
  ScrollTrigger.create({
    start: 'top+=80 top',
    onEnter: () =>
      gsap.to(navSelector, {
        backdropFilter: 'blur(20px)',
        backgroundColor: 'rgba(9,9,11,0.85)',
        borderBottomColor: 'rgba(124,58,237,0.2)',
        duration: 0.4,
        ease: 'power2.out',
      }),
    onLeaveBack: () =>
      gsap.to(navSelector, {
        backdropFilter: 'blur(0px)',
        backgroundColor: 'transparent',
        borderBottomColor: 'transparent',
        duration: 0.4,
      }),
  })
}

/** Staggered grid card reveal on scroll */
export function animateCardGrid(cardSelector = '.anime-card') {
  gsap.from(cardSelector, {
    opacity: 0,
    y: 48,
    scale: 0.95,
    duration: 0.6,
    stagger: {
      amount: 0.5,
      from: 'start',
    },
    ease: 'power3.out',
    scrollTrigger: {
      trigger: cardSelector,
      start: 'top 88%',
      toggleActions: 'play none none none',
    },
  })
}

/** Hero title word-by-word reveal */
export function animateHeroTitle(selector = '#hero-title') {
  const el = document.querySelector<HTMLElement>(selector)
  if (!el) return
  const text = el.textContent?.trim() || ''
  const words = text.split(' ')
  el.innerHTML = words
    .map(
      w =>
        `<span class="word" style="display:inline-block;overflow:hidden;margin-right:0.25em">
           <span class="word-inner" style="display:inline-block">${w}</span>
         </span>`
    )
    .join('')
  gsap.from(`${selector} .word-inner`, {
    y: '115%',
    opacity: 0,
    rotateX: -40,
    transformOrigin: 'top center',
    duration: 0.7,
    stagger: 0.07,
    ease: 'power4.out',
    delay: 0.15,
  })
}

/** Anime card hover — scale + glow effect */
export function bindCardHover(cardEl: HTMLElement) {
  const img = cardEl.querySelector<HTMLElement>('.card-poster')
  const info = cardEl.querySelector<HTMLElement>('.card-info')

  const enter = () => {
    gsap.to(cardEl, { scale: 1.04, duration: 0.25, ease: 'power2.out' })
    if (img) gsap.to(img, { scale: 1.08, duration: 0.45, ease: 'power2.out' })
    if (info) gsap.to(info, { y: -4, duration: 0.25, ease: 'power2.out' })
  }
  const leave = () => {
    gsap.to(cardEl, { scale: 1, duration: 0.3, ease: 'power2.inOut' })
    if (img) gsap.to(img, { scale: 1, duration: 0.35, ease: 'power2.inOut' })
    if (info) gsap.to(info, { y: 0, duration: 0.3, ease: 'power2.inOut' })
  }

  cardEl.addEventListener('mouseenter', enter)
  cardEl.addEventListener('mouseleave', leave)
  
  return () => {
    cardEl.removeEventListener('mouseenter', enter)
    cardEl.removeEventListener('mouseleave', leave)
  }
}

/** Mobile drawer — slide in from left */
export function openMobileDrawer() {
  gsap.set('#mobile-drawer', { display: 'flex' })
  const tl = gsap.timeline()
  tl.from('#mobile-drawer-panel', {
    x: '-100%',
    duration: 0.4,
    ease: 'power3.out',
  })
  tl.from(
    '#drawer-backdrop',
    { opacity: 0, duration: 0.3, ease: 'power2.out' },
    0
  )
  tl.from(
    '#drawer-links > *',
    { x: -24, opacity: 0, duration: 0.35, stagger: 0.06, ease: 'power3.out' },
    0.15
  )
  return tl
}

export function closeMobileDrawer() {
  const tl = gsap.timeline({
    onComplete: () => gsap.set('#mobile-drawer', { display: 'none' }),
  })
  tl.to('#mobile-drawer-panel', {
    x: '-100%',
    duration: 0.35,
    ease: 'power3.in',
  })
  tl.to('#drawer-backdrop', { opacity: 0, duration: 0.25 }, 0)
  return tl
}

/** Hamburger ↔ X morph */
export function morphHamburger(open: boolean) {
  const l1 = '#ham-l1', l2 = '#ham-l2', l3 = '#ham-l3'
  if (open) {
    gsap.to(l1, { rotation: 45, y: 7, duration: 0.3, ease: 'power2.inOut' })
    gsap.to(l2, { opacity: 0, scaleX: 0, duration: 0.2 })
    gsap.to(l3, { rotation: -45, y: -7, duration: 0.3, ease: 'power2.inOut' })
  } else {
    gsap.to(l1, { rotation: 0, y: 0, duration: 0.3, ease: 'power2.inOut' })
    gsap.to(l2, { opacity: 1, scaleX: 1, duration: 0.25 })
    gsap.to(l3, { rotation: 0, y: 0, duration: 0.3, ease: 'power2.inOut' })
  }
}

/** Filter tab switch (watchlist status tabs) */
export function animateTabSwitch(inEl: Element | null, outEl: Element | null) {
  if (outEl) {
    gsap.to(outEl, {
      opacity: 0,
      y: -10,
      duration: 0.18,
      ease: 'power2.in',
      onComplete: () => ((outEl as HTMLElement).style.display = 'none'),
    })
  }
  if (inEl) {
    ;(inEl as HTMLElement).style.display = 'block'
    gsap.from(inEl, {
      opacity: 0,
      y: 10,
      duration: 0.28,
      ease: 'power3.out',
    })
  }
}

/** Skeleton cards pulse entrance */
export function animateSkeletonIn(selector = '.skeleton-card') {
  gsap.from(selector, {
    opacity: 0,
    scale: 0.97,
    duration: 0.4,
    stagger: 0.05,
    ease: 'power2.out',
  })
}

// ══════════════════════════════════════════════════
// ANIME.JS — MICRO-INTERACTIONS & COUNTERS
// ══════════════════════════════════════════════════

/** Animated stat/score counter (e.g. score 8.7, episodes 24) */
export function animateCounter(
  el: HTMLElement,
  to: number,
  decimals = 0,
  suffix = '',
  duration = 1600
) {
  const obj = { val: 0 }
  anime({
    targets: obj,
    val: to,
    duration,
    easing: 'easeOutExpo',
    update() {
      el.textContent = obj.val.toFixed(decimals) + suffix
    },
  })
}

/** Episode countdown timer pulse (heartbeat on each tick) */
export function pulseCountdown(selector: string) {
  anime({
    targets: selector,
    scale: [1, 1.06, 1],
    duration: 600,
    easing: 'easeInOutSine',
  })
}

/** Search bar expand animation */
export function animateSearchExpand(inputSelector: string | HTMLElement) {
  anime({
    targets: inputSelector,
    width: ['0%', '100%'],
    opacity: [0, 1],
    duration: 350,
    easing: 'easeOutCubic',
  })
}

/** Badge pop-in (status badges: Watching, Completed, etc.) */
export function animateBadgeIn(selector: string | HTMLElement) {
  anime({
    targets: selector,
    scale: [0.5, 1.1, 1],
    opacity: [0, 1],
    duration: 400,
    delay: anime.stagger(60),
    easing: 'easeOutBack',
  })
}

/** Button ripple on click */
export function rippleButton(btn: HTMLElement, event: MouseEvent) {
  const rect = btn.getBoundingClientRect()
  const ripple = document.createElement('span')
  const size = Math.max(rect.width, rect.height) * 2
  Object.assign(ripple.style, {
    position: 'absolute',
    borderRadius: '50%',
    width: `${size}px`,
    height: `${size}px`,
    left: `${event.clientX - rect.left - size / 2}px`,
    top: `${event.clientY - rect.top - size / 2}px`,
    background: 'rgba(124,58,237,0.35)',
    pointerEvents: 'none',
    transform: 'scale(0)',
  })
  btn.style.position = 'relative'
  btn.style.overflow = 'hidden'
  btn.appendChild(ripple)
  anime({
    targets: ripple,
    scale: [0, 1],
    opacity: [0.8, 0],
    duration: 600,
    easing: 'easeOutExpo',
    complete: () => ripple.remove(),
  })
}

/** Toast / notification slide-in from right */
export function animateToastIn(el: HTMLElement) {
  anime({
    targets: el,
    translateX: ['100%', '0%'],
    opacity: [0, 1],
    duration: 420,
    easing: 'easeOutBack',
  })
}

export function animateToastOut(el: HTMLElement) {
  anime({
    targets: el,
    translateX: ['0%', '110%'],
    opacity: [1, 0],
    duration: 300,
    easing: 'easeInCubic',
  })
}

/** Watchlist add confirmation — heart burst */
export function animateHeartBurst(heartEl: HTMLElement) {
  anime
    .timeline()
    .add({
      targets: heartEl,
      scale: [1, 1.5, 0.9, 1.15, 1],
      duration: 600,
      easing: 'easeInOutElastic(1, 0.6)',
    })
    .add(
      {
        targets: heartEl,
        color: ['#94a3b8', '#ef4444'],
        duration: 300,
        easing: 'easeOutCubic',
      },
      0
    )
}

/** Score ring progress (circular SVG progress for anime score) */
export function animateScoreRing(
  circleEl: SVGCircleElement,
  score: number,
  maxScore = 10
) {
  const radius = parseFloat(circleEl.getAttribute('r') || '36')
  const circumference = 2 * Math.PI * radius
  circleEl.style.strokeDasharray = `${circumference}`
  circleEl.style.strokeDashoffset = `${circumference}`
  const target = circumference - (score / maxScore) * circumference
  anime({
    targets: circleEl,
    strokeDashoffset: [circumference, target],
    duration: 1400,
    delay: 300,
    easing: 'easeOutExpo',
  })
}

/** Skeleton shimmer loop */
export function animateSkeletonShimmer(selector: string) {
  anime({
    targets: selector,
    opacity: [0.3, 0.7, 0.3],
    duration: 1500,
    loop: true,
    easing: 'easeInOutSine',
    delay: anime.stagger(80),
  })
}
