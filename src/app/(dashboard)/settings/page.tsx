'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Settings as SettingsIcon, ShieldCheck, Palette, UserCircle, BellRing } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function SettingsPage() {
  return (
    <div className="flex-1 max-w-4xl mx-auto py-12 px-6 space-y-12">
      <div className="flex items-end justify-between border-b border-slate-800 pb-8">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase mb-2">
            Design<span className="text-anime-teal">Suite</span>
          </h1>
          <p className="text-slate-500 font-medium">Control your environment DNA and security protocols.</p>
        </div>
        <div className="h-12 w-12 bg-[#0F172A] border border-slate-800 rounded-2xl flex items-center justify-center text-anime-sky shadow-2xl">
          <SettingsIcon className="h-6 w-6" />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {[
          { icon: Palette, title: "Interface DNA", desc: "Customize accent colors and UI density.", status: "Vibrant Cyan Active" },
          { icon: ShieldCheck, title: "Auth Protocol", desc: "Manage multi-agent authentication.", status: "Secure" },
          { icon: UserCircle, title: "Data Profile", desc: "View your calculated affinity scores.", status: "Otaku Node" },
          { icon: BellRing, title: "Pulse Alerts", desc: "Control real-time feed notifications.", status: "Live" }
        ].map((item, i) => (
          <motion.div 
            key={i}
            whileHover={{ scale: 1.02 }}
            className="p-6 bg-[#0F172A]/40 border border-slate-800/80 rounded-3xl backdrop-blur-xl group cursor-pointer transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-[#020617] rounded-2xl border border-slate-800 text-anime-sky group-hover:text-anime-teal transition-colors">
                <item.icon className="h-6 w-6" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#14B8A6] bg-[#14B8A6]/10 px-3 py-1 rounded-full">
                {item.status}
              </span>
            </div>
            <h3 className="text-lg font-black text-white mb-1 tracking-tight">{item.title}</h3>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">{item.desc}</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-gradient-to-br from-[#14B8A6]/10 to-transparent border border-[#14B8A6]/20 rounded-[40px] p-10 text-center">
        <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">System Update Pending</h2>
        <p className="text-slate-400 max-w-md mx-auto mb-8 font-medium">
          The Design Suite is currently being calibrated for the 2.4 "Stitch Stable" release. Premium customizations will be available soon.
        </p>
        <Button className="bg-[#E2E8F0] text-[#020617] hover:bg-white rounded-2xl px-12 h-14 font-black uppercase text-xs tracking-[0.2em] shadow-2xl">
          Return to Core
        </Button>
      </div>
    </div>
  )
}
