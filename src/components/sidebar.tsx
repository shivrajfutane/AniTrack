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

  return (
    <>
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => setIsOpen(!isOpen)}
          className="bg-slate-900 border-slate-800 text-white"
        >
          {isOpen ? <X /> : <Menu />}
        </Button>
      </div>

      <motion.aside
        initial={false}
        animate={{ width: isOpen ? 240 : 80 }}
        className={cn(
          "fixed left-0 top-0 h-screen z-40 bg-slate-950 border-r border-slate-800 flex flex-col",
          !isOpen && "items-center"
        )}
      >
        <div className="p-6 flex items-center gap-3">
          <div className="h-10 w-10 flex-shrink-0 bg-gradient-to-br from-anime-purple-dark to-anime-teal-dark rounded-xl flex items-center justify-center shadow-lg shadow-anime-purple/20">
            <Tv className="text-white h-5 w-5" />
          </div>
          <AnimatePresence>
            {isOpen && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="font-bold text-white text-lg tracking-tight whitespace-nowrap"
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
                    isActive ? "text-white" : "text-slate-400 hover:text-white hover:bg-slate-900/50"
                  )}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-pill"
                      className="absolute inset-0 bg-slate-900 rounded-xl"
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
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="z-10 font-medium whitespace-nowrap"
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

        <div className="p-4 border-t border-slate-800">
           <Link href="/settings">
            <div className={cn(
              "flex items-center gap-3 px-3 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900/50 transition-colors",
              !isOpen && "justify-center"
            )}>
              <Settings className="h-5 w-5" />
              {isOpen && <span className="font-medium">Settings</span>}
            </div>
           </Link>
        </div>
      </motion.aside>
    </>
  )
}
