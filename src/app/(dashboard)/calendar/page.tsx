'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Calendar as CalendarIcon, Clock, Bell, Layers } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function CalendarPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[80vh] px-4">
      <div className="relative">
        <motion.div 
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 bg-anime-sky/10 blur-[80px] rounded-full scale-150"
        />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 text-center space-y-8 max-w-xl"
        >
          <div className="flex justify-center">
            <div className="h-20 w-20 bg-[#0F172A] border border-slate-800 rounded-full flex items-center justify-center shadow-inner">
              <CalendarIcon className="h-10 w-10 text-anime-sky" />
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">
              Temporal<span className="text-anime-sky">Tracking</span>
            </h1>
            <p className="text-slate-400 text-base font-medium">
              Synchronizing with the Japanese broadcast grid. Prepare for a seamless seasonal viewing schedule.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { label: "Spring 2026", color: "bg-anime-teal" },
              { label: "Simulcast Sync", color: "bg-anime-sky" }
            ].map((p, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-[#0F172A]/80 border border-slate-800 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className={`h-2 w-2 rounded-full ${p.color} animate-pulse`} />
                  <span className="text-sm font-bold text-white">{p.label}</span>
                </div>
                <Button variant="ghost" size="sm" className="text-slate-500 font-black text-[10px] uppercase">Pending</Button>
              </div>
            ))}
          </div>

          <div className="pt-6">
            <Button size="lg" disabled className="bg-anime-sky/20 text-anime-sky border border-anime-sky/30 rounded-xl font-black uppercase text-xs tracking-widest px-10 h-14">
              Calibrating Clock Speed...
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
