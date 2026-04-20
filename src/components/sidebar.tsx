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
import Image from 'next/image'
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
          <div className="h-8 w-8 relative flex items-center justify-center">
            <Image src="/logo-fox2.png" alt="AniTrack Fox Logo" fill className="object-contain" />
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
          <div className="flex items-center gap-3 mb-10 pl-2">
             <div className="h-10 w-10 relative flex items-center justify-center">
               <Image src="/logo-fox2.png" alt="AniTrack Fox Logo" fill className="object-contain" />
             </div>
             <span className="font-black text-xl italic uppercase font-syne">AniTrack</span>
          </div>
          <div id="drawer-links" className="flex-1 space-y-2">
            {navItems.map((item) => (
              <Link key={item.name} href={item.href} onClick={handleMobileToggle}
                className={cn(
                  "flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold transition-all",
                  pathname === item.href ? "bg-surface-container-low text-primary" : "text-text-subtle hover:text-white hover:bg-surface-container-low"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-sans tracking-tight">{item.name}</span>
              </Link>
            ))}
          </div>
          <div className="mt-auto pt-6 border-t border-white/5">
             {user ? (
               <div className="p-3 bg-white/5 rounded-2xl flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-surface-container-highest relative overflow-hidden flex items-center justify-center font-black text-white italic border border-white/10">
                    {user.user_metadata?.avatar_url || user.user_metadata?.picture ? (
                      <Image src={user.user_metadata?.avatar_url || user.user_metadata?.picture} alt="Avatar" fill className="object-cover" />
                    ) : (
                      user.email?.charAt(0).toUpperCase()
                    )}
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
                 <Button className="w-full bg-primary text-on-primary rounded-2xl h-14 font-black uppercase tracking-wider">
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
        className="hidden md:flex fixed inset-y-0 left-0 z-50 bg-background border-r border-transparent flex-col noise-overlay"
      >
        <div className="p-4 flex items-center h-[88px] relative z-20">
          <div className="flex items-center gap-3 overflow-hidden pl-2">
            <div className="h-10 w-10 flex-shrink-0 relative flex items-center justify-center">
              <Image src="/logo-fox2.png" alt="AniTrack Fox Logo" fill className="object-contain drop-shadow-[0_0_10px_rgba(124,58,237,0.5)]" />
            </div>
            <motion.span 
              initial={{ opacity: 1 }}
              animate={{ opacity: sidebarExpanded ? 1 : 0 }}
              className="font-black text-2xl tracking-tighter uppercase italic font-syne text-white truncate w-full"
            >
              Ani<span className="text-accent drop-shadow-[0_0_10px_rgba(124,58,237,0.5)]">Track</span>
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

        <div className="p-4 border-t border-transparent space-y-4 relative z-20">
          {user ? (
            <div className={cn("flex items-center gap-3 transition-all", sidebarExpanded ? "p-3 rounded-2xl bg-surface-container-low" : "justify-center")}>
              <div className="h-10 w-10 relative overflow-hidden rounded-full flex-shrink-0 flex items-center justify-center bg-surface border border-white/10">
                {user.user_metadata?.avatar_url || user.user_metadata?.picture ? (
                  <Image src={user.user_metadata?.avatar_url || user.user_metadata?.picture} alt="Avatar" fill className="object-cover" />
                ) : (
                  <div className="absolute inset-[2px] rounded-full bg-surface-container-highest flex items-center justify-center">
                     <span className="font-black text-white text-sm">{user.email?.charAt(0).toUpperCase()}</span>
                  </div>
                )}
              </div>
              
              {sidebarExpanded && (
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-black text-primary uppercase tracking-widest leading-none mb-1">Signed In</p>
                  <p className="text-sm font-bold text-white truncate">{user.email?.split('@')[0]}</p>
                </div>
              )}
              {sidebarExpanded && (
                <button onClick={() => supabase.auth.signOut()} className="p-2 text-text-subtle hover:text-red-400 rounded-xl transition-all">
                  <LogOut className="h-4 w-4" />
                </button>
              )}
            </div>
          ) : (
            <Link href="/login">
              <Button onClick={handleRipple} className={cn("w-full transition-all font-sans uppercase tracking-widest bg-primary text-on-primary", sidebarExpanded ? "h-12 rounded-xl text-xs" : "h-10 w-10 p-0 rounded-xl text-[10px]")}>
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
      <div className={cn("flex items-center relative group h-12 rounded-xl transition-colors", isActive ? "text-white" : "text-text-subtle hover:text-white")}>
        {isActive && (
          <motion.div layoutId="active-nav-pill" className="absolute inset-0 bg-surface-container-low rounded-xl" transition={{ type: "spring", stiffness: 300, damping: 30 }} />
        )}
        <div ref={isActive ? undefined : hoverProps.ref as any} {...(isActive ? {} : hoverProps.bind())} className="h-12 w-12 flex items-center justify-center relative z-10 shrink-0">
          <motion.div style={isActive ? {} : hoverProps.style as any}>
             <item.icon className={cn("h-5 w-5 transition-transform", isActive ? "scale-110 text-primary" : "group-hover:scale-110")} />
          </motion.div>
        </div>
        {expanded && (
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-sans font-bold text-sm ml-2 relative z-10 tracking-tight">
            {item.name}
          </motion.span>
        )}
        {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-lg z-10" />}
      </div>
    </Link>
  )
}
