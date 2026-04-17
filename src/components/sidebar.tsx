'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Home, 
  Search, 
  List, 
  BarChart3, 
  MessageSquare, 
  Sparkles, 
  Calendar,
  Settings,
  Menu,
  X,
  Tv
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'

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
  const [isOpen, setIsOpen] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const supabase = createClient()

  React.useEffect(() => {
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

  return (
    <>
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => setIsOpen(!isOpen)}
          className="bg-[#0F172A] border-slate-800 text-white shadow-xl"
        >
          {isOpen ? <X /> : <Menu />}
        </Button>
      </div>

      <motion.aside
        initial={false}
        animate={{ width: isOpen ? 240 : 80 }}
        className={cn(
          "fixed inset-y-0 left-0 z-50 bg-[#020617] border-r border-slate-800 transition-all duration-300 flex flex-col",
          isOpen ? "w-[240px]" : "w-[80px]"
        )}
      >
        <div className="p-6 flex items-center gap-3">
          <div className="h-10 w-10 flex-shrink-0 bg-gradient-to-br from-anime-teal to-anime-sky rounded-xl flex items-center justify-center shadow-lg shadow-anime-teal/20">
            <Tv className="text-white h-5 w-5" />
          </div>
          <AnimatePresence>
            {isOpen && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="font-black text-white text-lg tracking-tight whitespace-nowrap"
              >
                AnimeTracker
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.name} href={item.href}>
                <motion.div
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 rounded-xl transition-colors relative group",
                    isActive ? "text-anime-teal" : "text-slate-400 hover:text-white hover:bg-slate-900/50"
                  )}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-pill"
                      className="absolute inset-0 bg-anime-teal/10 rounded-xl"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <item.icon className={cn(
                    "h-5 w-5 z-10 transition-colors",
                    isActive ? "text-anime-teal" : "group-hover:text-anime-teal"
                  )} />
                  <AnimatePresence>
                    {isOpen && (
                      <motion.span
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -5 }}
                        className="font-bold text-sm tracking-wide z-10 whitespace-nowrap"
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-slate-800/50 space-y-2">
          {user ? (
            <div className={cn(
              "flex items-center gap-3 p-2 rounded-2xl bg-[#0F172A]/50 border border-slate-800/30",
              !isOpen && "justify-center"
            )}>
              <div className="h-8 w-8 rounded-full bg-anime-teal flex-shrink-0 flex items-center justify-center font-bold text-xs text-white uppercase tracking-tighter shadow-lg shadow-anime-teal/20">
                {user.email?.charAt(0) || 'U'}
              </div>
              {isOpen && (
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Authenticated</p>
                  <p className="text-sm font-bold text-white truncate">{user.email?.split('@')[0]}</p>
                </div>
              )}
              {isOpen && (
                <button 
                  onClick={() => supabase.auth.signOut()}
                  className="p-1.5 hover:bg-red-500/10 hover:text-red-400 rounded-lg transition-colors text-slate-500"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          ) : (
            <Link href="/login">
              <Button 
                variant="outline" 
                className={cn(
                  "w-full bg-[#14B8A6]/10 border-[#14B8A6]/20 text-anime-teal hover:bg-anime-teal hover:text-white rounded-xl font-black uppercase text-[10px] tracking-[0.2em] h-11 shadow-lg shadow-anime-teal/5",
                  !isOpen && "p-0"
                )}
              >
                {isOpen ? "Initialize Session" : "LOGIN"}
              </Button>
            </Link>
          )}

          <Link href="/settings">
            <div className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 hover:text-white hover:bg-[#0F172A]/80 transition-all group",
              !isOpen && "justify-center"
            )}>
              <Settings className="h-5 w-5 group-hover:rotate-45 transition-transform" />
              {isOpen && <span className="font-bold text-sm">Design Suite</span>}
            </div>
          </Link>
        </div>
      </motion.aside>
    </>
  )
}
