'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Sparkles, BrainCircuit, Cpu, Zap, Activity } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function AIRecsPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[80vh] px-4 md:px-12 py-12">
      <div className="relative w-full max-w-4xl flex flex-col items-center">
        {/* Animated Brain Background layer */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-cyan/10 blur-[100px] rounded-full pointer-events-none mix-blend-screen"
        />
        <motion.div 
          animate={{ scale: [1, 0.9, 1], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] md:w-[400px] md:h-[400px] bg-accent/20 blur-[80px] rounded-full pointer-events-none mix-blend-screen"
        />
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 text-center space-y-10 w-full glass p-10 md:p-16 rounded-[40px] border border-white/5 shadow-2xl backdrop-blur-3xl overflow-hidden"
        >
          <div className="absolute inset-0 noise-overlay opacity-50 mix-blend-overlay pointer-events-none" />

          <div className="flex justify-center relative z-10">
            <div className="relative">
              <div className="h-28 w-28 md:h-32 md:w-32 bg-surface/50 border border-white/10 rounded-[40px] flex items-center justify-center shadow-glow backdrop-blur-xl relative z-10 transition-transform duration-500 hover:scale-105">
                <BrainCircuit className="h-14 w-14 md:h-16 md:w-16 text-cyan drop-shadow-[0_0_15px_rgba(0,240,255,0.8)]" />
              </div>
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute -top-4 -right-4 h-12 w-12 bg-accent/20 border border-accent/40 rounded-full flex items-center justify-center text-white shadow-glow backdrop-blur-xl z-20"
              >
                <Sparkles className="h-6 w-6 text-accent drop-shadow-[0_0_10px_rgba(124,58,237,0.8)]" />
              </motion.div>

              {/* Scanning laser line */}
              <motion.div 
                animate={{ top: ['0%', '100%', '0%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                className="absolute left-0 right-0 h-1 bg-cyan shadow-[0_0_20px_#00F0FF] z-20 opacity-50 rounded-full"
              />
            </div>
          </div>

          <div className="space-y-4 relative z-10">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tighter uppercase italic font-syne">
              Neural<span className="text-cyan drop-shadow-[0_0_15px_rgba(0,240,255,0.6)]">Intelligence</span>
            </h1>
            <p className="text-text-subtle text-base md:text-xl font-medium leading-relaxed font-spaceGrotesk max-w-2xl mx-auto">
              Synthesizing temporal broadcast patterns and collective node interactions to generate high-fidelity DNA recommendations.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 relative z-10">
            {[
              { icon: Cpu, label: "Core Processing", val: "Neural Net", color: "text-accent", glow: "rgba(124,58,237,0.5)" },
              { icon: Zap, label: "Response Latency", val: "12ms", color: "text-gold-neon", glow: "rgba(255,215,0,0.5)" },
              { icon: BrainCircuit, label: "Pattern Accuracy", val: "99.4%", color: "text-cyan", glow: "rgba(0,240,255,0.5)" },
              { icon: Activity, label: "Network Pulse", val: "Syncing", color: "text-sakura", glow: "rgba(255,107,158,0.5)", pulse: true }
            ].map((stat, i) => (
              <div key={i} className="bg-surface/40 border border-white/5 rounded-3xl p-6 glass hover:bg-white/5 transition-colors">
                <stat.icon className={`h-8 w-8 mb-4 mx-auto ${stat.color} ${stat.pulse ? 'animate-pulse' : ''}`} style={{ filter: `drop-shadow(0 0 10px ${stat.glow})` }} />
                <p className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-text-subtle font-spaceGrotesk">{stat.label}</p>
                <p className="text-lg md:text-xl font-black text-white mt-2 font-syne">{stat.val}</p>
              </div>
            ))}
          </div>

          <div className="pt-8 relative z-10">
            <Button disabled className="bg-cyan/10 border border-cyan/30 text-cyan rounded-full px-8 md:px-12 h-14 md:h-16 font-black uppercase text-xs md:text-sm tracking-[0.2em] shadow-glow font-syne opacity-80 cursor-not-allowed">
              <span className="animate-pulse flex items-center gap-3">
                <Zap className="h-5 w-5" />
                Training Network...
              </span>
            </Button>
            <p className="text-[10px] md:text-xs text-text-subtle mt-6 uppercase font-black tracking-widest font-spaceGrotesk">
              Available in Sequence <span className="text-white">v3.0</span> (Neural Stable)
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
