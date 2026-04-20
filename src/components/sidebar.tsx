'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Home, 
  Search, 
  List, 
  BarChart3, 
  MessageSquare, 
  Sparkles, 
  Calendar,
  Settings,
  Tv,
  ChevronRight,
  LogOut
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { 
  morphHamburger, 
  openMobileDrawer, 
  closeMobileDrawer,
  animateNavbarScroll,
  rippleButton
} from '@/lib/animations'
import { useGSAP } from '@gsap/react'
import { motion } from 'framer-motion'
import { useUiStore } from '@/store/ui.store'
import { useTextScramble } from '@/hooks/animations/useTextScramble'
import { useMagneticHover } from '@/hooks/animations/useMagneticHover'

const navItems = [
  { name: 'Discover', icon: Home, href: '/' },
  { name: 'Search', icon: Search, href: '/search' },
  { name: 'My List', icon: List, href: '/my-list' },
  { name: 'Stats', icon: BarChart3, href: '/stats' },
  { name: 'Social', icon: MessageSquare, href: '/social' },
  { name: 'AI Recs', icon: Sparkles, href: '/ai' },
  { name: 'Calendar', icon: Calendar, href: '/calendar' },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  
  const { sidebarExpanded, toggleSidebar } = useUiStore()
  const [user, setUser] = useState<User | null>(null)
  const supabase = createClient()
  
  const navbarRef = useRef<HTMLElement>(null)
  
  const { displayText: logoText, scramble } = useTextScramble<HTMLSpanElement>("AniTrack", "mount")

  useGSAP(() => {
    animateNavbarScroll('#navbar')
  }, { scope: navbarRef })

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const handleMobileToggle = () => {
    if (isMobileOpen) {
      closeMobileDrawer()
      morphHamburger(false)
    } else {
      openMobileDrawer()
      morphHamburger(true)
    }
    setIsMobileOpen(!isMobileOpen)
  }

  const handleRipple = (e: React.MouseEvent<HTMLElement>) => {
    rippleButton(e.currentTarget, e.nativeEvent)
  }

  return (
    <>
      <nav 
        id="navbar" 
        ref={navbarRef}
        className="md:hidden fixed top-0 w-full z-50 h-[64px] border-b border-white/5 bg-[#09090B]/80 backdrop-blur-xl flex items-center justify-between px-4 transition-all"
      >
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 bg-accent rounded-lg flex items-center justify-center shadow-glow">
            <Tv className="text-white h-4 w-4" />
          </div>
          <span 
            className="font-black text-white text-base tracking-tighter uppercase italic font-syne"
            onMouseEnter={scramble}
          >
            {logoText}
          </span>
        </Link>
        <button 
          onClick={handleMobileToggle}
          className="h-10 w-10 flex flex-col items-center justify-center gap-1.5 focus:outline-none"
        >
          <div id="ham-l1" className="w-6 h-0.5 bg-white rounded-full transition-all origin-center" />
          <div id="ham-l2" className="w-6 h-0.5 bg-white rounded-full transition-all" />
          <div id="ham-l3" className="w-6 h-0.5 bg-white rounded-full transition-all origin-center" />
        </button>
      </nav>

      <div id="mobile-drawer" className="fixed inset-0 z-[60] hidden flex">
        <div id="drawer-backdrop" onClick={handleMobileToggle} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
        <div id="mobile-drawer-panel" className="relative w-[280px] h-full bg-surface border-r border-white/10 flex flex-col p-6 shadow-2xl glass-elevated">
          <div className="flex items-center gap-4 mb-10">
             <div className="h-10 w-10 bg-accent rounded-xl flex items-center justify-center shadow-glow">
               <Tv className="text-white h-5 w-5" />
             </div>
             <span className="font-black text-xl italic uppercase font-syne">AniTrack</span>
          </div>
          <div id="drawer-links" className="flex-1 space-y-2">
            {navItems.map((item) => (
              <Link key={item.name} href={item.href} onClick={handleMobileToggle}
                className={cn(
                  "flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold transition-all",
                  pathname === item.href ? "bg-accent/10 border-l-4 border-accent text-accent" : "text-white/60 hover:text-white hover:bg-white/5"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-syne">{item.name}</span>
              </Link>
            ))}
          </div>
          <div className="mt-auto pt-6 border-t border-white/5">
             {user ? (
               <div className="p-3 bg-white/5 rounded-2xl flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center font-black text-white italic">
                    {user.email?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black text-accent uppercase tracking-widest">Logged In</p>
                    <p className="text-sm font-bold truncate text-white">{user.email?.split('@')[0]}</p>
                  </div>
                  <button onClick={() => supabase.auth.signOut()} className="p-2 text-white/40 hover:text-red-400">
                    <LogOut className="h-4 w-4" />
                  </button>
               </div>
             ) : (
               <Link href="/login" onClick={handleMobileToggle}>
                 <Button className="w-full bg-accent text-white rounded-2xl h-14 font-black uppercase font-syne italic">
                   Sign In
                 </Button>
               </Link>
             )}
          </div>
        </div>
      </div>

      <motion.aside
        initial={{ width: 260 }}
        animate={{ width: sidebarExpanded ? 260 : 72 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="hidden md:flex fixed inset-y-0 left-0 z-50 bg-[#09090B] border-r border-white/5 flex-col noise-overlay"
      >
        <div className="p-4 flex items-center h-[88px] relative z-20">
          <div className="flex items-center gap-4 overflow-hidden pl-2">
            <div className="h-10 w-10 flex-shrink-0 bg-accent rounded-xl flex items-center justify-center shadow-glow border border-accent-light/20 relative">
              <Tv className="text-white h-5 w-5" />
            </div>
            <motion.span 
              initial={{ opacity: 1 }}
              animate={{ opacity: sidebarExpanded ? 1 : 0 }}
              className="font-black text-xl tracking-tighter uppercase italic font-syne gradient-text whitespace-nowrap"
            >
              AniTrack
            </motion.span>
          </div>
          
          <button onClick={toggleSidebar} className="absolute -right-4 top-8 bg-surface border border-white/10 rounded-full p-1 z-30">
             <motion.div animate={{ rotate: sidebarExpanded ? 180 : 0 }}>
               <ChevronRight className="h-4 w-4 text-white/60" />
             </motion.div>
          </button>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto scrollbar-hide relative z-20">
          {navItems.map((item) => (
            <NavItem key={item.name} item={item} isActive={pathname === item.href} expanded={sidebarExpanded} />
          ))}
        </nav>

        <div className="p-4 border-t border-white/5 space-y-4 relative z-20">
          {user ? (
            <div className={cn("flex items-center gap-3 transition-all", sidebarExpanded ? "p-3 rounded-2xl bg-white/5 border border-white/5" : "justify-center")}>
              <div className="h-10 w-10 relative overflow-hidden rounded-full flex-shrink-0 flex items-center justify-center bg-surface">
                <div className="absolute inset-0 animate-spin" style={{ background: "conic-gradient(from 0deg, transparent 0 340deg, #7C3AED 360deg)" }} />
                <div className="absolute inset-[2px] rounded-full bg-elevated flex items-center justify-center">
                   <span className="font-black text-white italic text-sm">{user.email?.charAt(0).toUpperCase()}</span>
                </div>
              </div>
              
              {sidebarExpanded && (
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-black text-accent uppercase tracking-widest leading-none mb-1">Signed In</p>
                  <p className="text-sm font-bold text-white truncate">{user.email?.split('@')[0]}</p>
                </div>
              )}
              {sidebarExpanded && (
                <button onClick={() => supabase.auth.signOut()} className="p-2 text-white/30 hover:text-red-400 rounded-xl transition-all">
                  <LogOut className="h-4 w-4" />
                </button>
              )}
            </div>
          ) : (
            <Link href="/login">
              <Button onClick={handleRipple} className={cn("w-full bg-accent text-white transition-all font-syne uppercase tracking-widest italic shadow-glow", sidebarExpanded ? "h-12 rounded-xl text-xs" : "h-10 w-10 p-0 rounded-xl text-[10px]")}>
                {sidebarExpanded ? "Sign In" : "IN"}
              </Button>
            </Link>
          )}
        </div>
      </motion.aside>
    </>
  )
}

function NavItem({ item, isActive, expanded }: { item: any; isActive: boolean; expanded: boolean }) {
  const hoverProps = useMagneticHover<HTMLDivElement>(0.2)
  return (
    <Link href={item.href}>
      <div className={cn("flex items-center relative group h-12 rounded-xl transition-colors", isActive ? "text-white" : "text-white/40 hover:text-white")}>
        {isActive && (
          <motion.div layoutId="active-nav-pill" className="absolute inset-0 bg-accent/15 rounded-xl border border-accent/20" transition={{ type: "spring", stiffness: 300, damping: 30 }} />
        )}
        <div ref={isActive ? undefined : hoverProps.ref as any} {...(isActive ? {} : hoverProps.bind())} className="h-12 w-12 flex items-center justify-center relative z-10 shrink-0">
          <motion.div style={isActive ? {} : hoverProps.style as any}>
             <item.icon className={cn("h-5 w-5 transition-transform", isActive ? "scale-110 text-accent glow-violet" : "group-hover:scale-110")} />
          </motion.div>
        </div>
        {expanded && (
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-syne font-bold text-sm ml-2 relative z-10">
            {item.name}
          </motion.span>
        )}
        {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-accent rounded-r-lg shadow-glow z-10" />}
      </div>
    </Link>
  )
}
