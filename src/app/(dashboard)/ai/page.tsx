'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Sparkles, BrainCircuit, Cpu, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function AIRecsPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[80vh] px-4">
      <div className="relative">
        {/* Animated Brain Background */}
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute inset-0 bg-anime-teal/20 blur-[100px] rounded-full"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 text-center space-y-8 max-w-2xl"
        >
          <div className="flex justify-center">
            <div className="relative">
              <div className="h-24 w-24 bg-[#0F172A] border border-slate-800 rounded-[32px] flex items-center justify-center shadow-2xl shadow-anime-teal/20">
                <BrainCircuit className="h-12 w-12 text-anime-teal" />
              </div>
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-2 -right-2 h-8 w-8 bg-anime-sky rounded-full flex items-center justify-center text-white shadow-lg"
              >
                <Sparkles className="h-4 w-4" />
              </motion.div>
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase">
              Stitch<span className="text-anime-teal">Intelligence</span>
            </h1>
            <p className="text-slate-400 text-lg font-medium leading-relaxed">
              We're synthesizing your watching patterns and community interactions to generate high-fidelity DNA recommendations.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: Cpu, label: "Neural Net", val: "94%" },
              { icon: Zap, label: "Latency", val: "12ms" },
              { icon: BrainCircuit, label: "Accuracy", val: "High" }
            ].map((stat, i) => (
              <div key={i} className="bg-[#0F172A]/50 border border-slate-800 rounded-2xl p-4">
                <stat.icon className="h-5 w-5 text-anime-sky mb-2 mx-auto" />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{stat.label}</p>
                <p className="text-lg font-black text-white">{stat.val}</p>
              </div>
            ))}
          </div>

          <div className="pt-8">
            <Button disabled className="bg-anime-teal/10 border border-anime-teal/20 text-anime-teal rounded-full px-8 h-14 font-black uppercase text-xs tracking-[0.2em]">
              Processing DNA Sequence...
            </Button>
            <p className="text-[10px] text-slate-600 mt-4 uppercase font-bold tracking-widest">Available in Version 2.4 (Stitch Stable)</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
