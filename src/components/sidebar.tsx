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
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { 
  gsap, 
  morphHamburger, 
  openMobileDrawer, 
  closeMobileDrawer,
  animateNavbarScroll,
  rippleButton
} from '@/lib/animations'
import { useGSAP } from '@gsap/react'

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const supabase = createClient()
  
  const sidebarRef = useRef<HTMLDivElement>(null)
  const navbarRef = useRef<HTMLElement>(null)
  const drawerRef = useRef<HTMLDivElement>(null)

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
  }, [])

  useGSAP(() => {
    animateNavbarScroll('#navbar')
  }, { scope: navbarRef })

  const toggleMobileDrawer = () => {
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
      {/* Mobile Navbar Overlay */}
      <nav 
        id="navbar" 
        ref={navbarRef}
        className="md:hidden fixed top-0 w-full z-50 h-16 border-b border-white/5 flex items-center justify-between px-4 transition-all"
      >
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 bg-accent rounded-lg flex items-center justify-center shadow-lg shadow-accent/20">
            <Tv className="text-white h-4 w-4" />
          </div>
          <span className="font-black text-white text-base tracking-tighter uppercase italic">
            Ani<span className="text-accent underline decoration-2 underline-offset-4">Track</span>
          </span>
        </Link>
        
        <button 
          onClick={toggleMobileDrawer}
          className="h-10 w-10 flex flex-col items-center justify-center gap-1.5 focus:outline-none"
        >
          <div id="ham-l1" className="w-6 h-0.5 bg-white rounded-full transition-all origin-center" />
          <div id="ham-l2" className="w-6 h-0.5 bg-white rounded-full transition-all" />
          <div id="ham-l3" className="w-6 h-0.5 bg-white rounded-full transition-all origin-center" />
        </button>
      </nav>

      {/* Mobile Drawer */}
      <div id="mobile-drawer" className="fixed inset-0 z-[60] hidden flex">
        <div id="drawer-backdrop" onClick={toggleMobileDrawer} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
        <div id="mobile-drawer-panel" className="relative w-72 h-full bg-elevated border-r border-white/10 flex flex-col p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-10">
            <div className="h-10 w-10 bg-accent rounded-xl flex items-center justify-center shadow-xl shadow-accent/25">
              <Tv className="text-white h-5 w-5" />
            </div>
            <button onClick={toggleMobileDrawer} className="p-2 text-white/50 hover:text-white">
              <XIcon className="h-6 w-6" />
            </button>
          </div>
          
          <div id="drawer-links" className="flex-1 space-y-2">
            {navItems.map((item) => (
              <Link 
                key={item.name} 
                href={item.href} 
                onClick={toggleMobileDrawer}
                className={cn(
                  "flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold transition-all",
                  pathname === item.href ? "bg-accent/10 text-accent" : "text-white/60 hover:text-white hover:bg-white/5"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
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
                    <p className="text-xs font-black text-accent uppercase tracking-widest">Active Node</p>
                    <p className="text-sm font-bold truncate text-white">{user.email?.split('@')[0]}</p>
                  </div>
                  <button onClick={() => supabase.auth.signOut()} className="p-2 text-white/40 hover:text-red-400">
                    <LogOut className="h-4 w-4" />
                  </button>
               </div>
             ) : (
               <Link href="/login" onClick={toggleMobileDrawer}>
                 <Button className="w-full bg-accent hover:bg-accent-dark text-white rounded-2xl h-14 font-black uppercase tracking-[0.2em] italic">
                   Initiate Session
                 </Button>
               </Link>
             )}
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside
        ref={sidebarRef}
        className={cn(
          "hidden md:flex fixed inset-y-0 left-0 z-50 bg-[#09090B] border-r border-white/5 transition-all duration-500 flex-col",
          isSidebarOpen ? "w-[260px]" : "w-[90px]"
        )}
      >
        <div className="p-8 flex items-center justify-between">
          <div className="flex items-center gap-4 overflow-hidden">
            <div 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="h-12 w-12 flex-shrink-0 bg-accent rounded-2xl flex items-center justify-center shadow-xl shadow-accent/20 cursor-pointer hover:scale-105 active:scale-95 transition-all"
            >
              <Tv className="text-white h-6 w-6" />
            </div>
            {isSidebarOpen && (
              <span className="font-black text-white text-xl tracking-tighter uppercase italic transition-all">
                Ani<span className="text-accent">Track</span>
              </span>
            )}
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto scrollbar-hide">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.name} href={item.href}>
                <div
                  onMouseDown={handleRipple}
                  className={cn(
                    "flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all relative group overflow-hidden",
                    isActive ? "text-accent bg-accent/10" : "text-white/40 hover:text-white hover:bg-white/5"
                  )}
                >
                  <item.icon className={cn(
                    "h-5 w-5 shrink-0 transition-transform duration-300",
                    isActive ? "scale-110" : "group-hover:scale-110"
                  )} />
                  {isSidebarOpen && (
                    <span className="font-bold text-sm tracking-wide whitespace-nowrap">
                      {item.name}
                    </span>
                  )}
                  {isActive && (
                    <div className="absolute left-0 w-1 h-6 bg-accent rounded-full" />
                  )}
                </div>
              </Link>
            )
          })}
        </nav>

        <div className="p-6 border-t border-white/5 space-y-4">
          {user ? (
            <div className={cn(
              "p-3 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-3 transition-all",
              !isSidebarOpen && "bg-transparent border-transparent justify-center"
            )}>
              <div className="h-10 w-10 rounded-full bg-accent flex-shrink-0 flex items-center justify-center shadow-lg shadow-accent/25">
                <span className="font-black text-white italic">{user.email?.charAt(0).toUpperCase()}</span>
              </div>
              {isSidebarOpen && (
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-black text-accent uppercase tracking-widest leading-none mb-1">Authenticated</p>
                  <p className="text-sm font-bold text-white truncate">{user.email?.split('@')[0]}</p>
                </div>
              )}
              {isSidebarOpen && (
                <button 
                  onClick={() => supabase.auth.signOut()}
                  className="p-2 text-white/30 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              )}
            </div>
          ) : (
            <Link href="/login">
              <Button 
                onClick={handleRipple}
                className={cn(
                  "w-full bg-accent hover:bg-accent-dark text-white rounded-2xl h-14 font-black uppercase text-xs tracking-widest transition-all",
                  !isSidebarOpen && "h-12 w-12 p-0 rounded-full"
                )}
              >
                {isSidebarOpen ? "Initiate Session" : "IN"}
              </Button>
            </Link>
          )}

          <Link href="/settings">
            <div className={cn(
              "flex items-center gap-4 px-4 py-4 rounded-2xl text-white/30 hover:text-white hover:bg-white/5 transition-all group",
              !isSidebarOpen && "justify-center"
            )}>
              <Settings className="h-5 w-5 shrink-0 group-hover:rotate-90 transition-transform duration-500" />
              {isSidebarOpen && <span className="font-bold text-sm">Design Suite</span>}
            </div>
          </Link>
        </div>
      </aside>
    </>
  )
}

function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}

function LogOut(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" x2="9" y1="12" y2="12" />
    </svg>
  )
}
