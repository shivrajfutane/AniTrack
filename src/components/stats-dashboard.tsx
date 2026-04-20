'use client'

import React, { useRef } from 'react'
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip
} from 'recharts'
import { TrendingUp, Clock, Star, Trophy, Target, Zap, Activity } from 'lucide-react'
import { TrackedAnime, calculateSummaryStats, getStatusDistribution, getGenreDistribution, getWatcherArchetype } from '@/lib/stats'
import { cn } from '@/lib/utils'
import { useScrollReveal } from '@/hooks/animations/useScrollReveal'
import { useCountUp } from '@/hooks/animations/useCountUp'
import { StaggerGrid } from '@/components/animations/StaggerGrid'

const COLORS = ['#7C3AED', '#EC4899', '#F59E0B', '#10b981', '#3b82f6']

export function StatsDashboard({ list }: { list: TrackedAnime[] }) {
  const summary = calculateSummaryStats(list)
  const statusData = getStatusDistribution(list)
  const genreData = getGenreDistribution(list)
  const archetype = getWatcherArchetype(list)

  const headerRevealRef = useScrollReveal<HTMLDivElement>({ y: -30 })

  return (
    <div className="space-y-12 pb-24 max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 pt-6 md:pt-10">
      {/* Header */}
      <div 
        ref={headerRevealRef}
        className="flex flex-col gap-3 relative z-10 -mx-4 sm:mx-0 px-4 sm:px-0 opacity-0"
      >
        <div className="flex items-center gap-4">
           <div className="h-16 w-16 bg-accent/10 rounded-[20px] flex items-center justify-center text-accent shadow-glow border border-accent/20">
              <Activity className="h-8 w-8 drop-shadow-[0_0_10px_rgba(124,58,237,0.5)]" />
           </div>
           <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic font-syne">
            Neural<span className="text-accent drop-shadow-[0_0_15px_rgba(124,58,237,0.5)]">Analytics</span>
          </h1>
        </div>
        <p className="text-text-subtle font-medium max-w-lg leading-relaxed font-spaceGrotesk">Decoding your historical broadcast consumption signatures.</p>
      </div>

      <StaggerGrid className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[240px]">
        
        {/* Days Streamed - Bento Item spanning 1 col, 1 row */}
        <MetricCard 
          title="Days Streamed" 
          value={summary.totalDays} 
          icon={<Clock className="text-cyan drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]" />} 
          description="Total temporal displacement across segments."
          className="col-span-1"
          borderColor="hover:border-cyan/50"
          accentColor="text-cyan drop-shadow-[0_0_10px_rgba(0,240,255,0.4)]"
          isFloat
        />

        {/* Mean Rating - Bento Item spanning 1 col, 1 row */}
        <MetricCard 
          title="Mean Rating" 
          value={summary.meanScore} 
          icon={<Star className="text-gold-neon drop-shadow-[0_0_8px_rgba(255,215,0,0.8)]" />} 
          description="Average qualitative node assessment."
          className="col-span-1"
          borderColor="hover:border-gold-neon/50"
          accentColor="text-gold-neon drop-shadow-[0_0_10px_rgba(255,215,0,0.4)]"
          isFloat
        />

        {/* User Archetype - Feature Card spanning 2 cols */}
        <div className="col-span-1 md:col-span-2 row-span-1 glass-elevated border border-accent/40 rounded-[32px] overflow-hidden relative group shadow-[0_0_30px_rgba(124,58,237,0.15)] flex flex-col p-8">
          <div className="absolute top-0 right-0 p-6 hidden sm:block">
             <div className="bg-accent/20 text-accent border border-accent/30 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-[0.2em] shadow-glow">Classification Status</div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-transparent pointer-events-none" />
          
          <div className="flex items-start justify-between mb-auto relative z-10">
            <div className="p-4 rounded-[20px] bg-accent/20 border border-accent/30 text-accent transition-transform duration-500 group-hover:scale-110 shadow-glow">
              <Trophy className="h-8 w-8 drop-shadow-[0_0_10px_rgba(124,58,237,0.5)]" />
            </div>
          </div>
          <div className="space-y-3 relative z-10 mt-6">
            <p className="text-[10px] font-black text-text-subtle uppercase tracking-[0.3em] font-spaceGrotesk">User Archetype</p>
            <h3 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase text-white font-syne drop-shadow-md">
              {archetype.name}
            </h3>
            {archetype.description && <p className="text-sm text-text-subtle font-medium leading-relaxed font-spaceGrotesk max-w-sm">{archetype.description}</p>}
          </div>
        </div>

        {/* Packets Logged - Bento Item hidden on very small, spanning 1 col */}
        <MetricCard 
          title="Packets Logged" 
          value={summary.totalEpisodes} 
          icon={<Zap className="text-sakura drop-shadow-[0_0_8px_rgba(255,107,158,0.8)]" />} 
          description="Total broadcast units recorded."
          className="col-span-1 md:col-span-1 lg:col-span-1"
          borderColor="hover:border-sakura/50"
          accentColor="text-sakura drop-shadow-[0_0_10px_rgba(255,107,158,0.4)]"
          isFloat={false}
        />

        {/* Genre Radar Chart - Spanning cols/rows */}
        <div className="col-span-1 md:col-span-2 lg:col-span-3 row-span-2 glass border border-white/10 shadow-xl rounded-[40px] flex flex-col relative overflow-hidden group hover:border-white/20 transition-colors duration-500">
           <div className="p-8 pb-0 shrink-0 relative z-10 flex justify-between items-start">
             <div>
               <h3 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter text-white flex items-center gap-3 font-syne">
                 <Target className="h-6 w-6 text-accent drop-shadow-[0_0_8px_rgba(124,58,237,0.5)]" />
                 Genre<span className="text-accent drop-shadow-[0_0_10px_rgba(124,58,237,0.8)]">DNA</span>
               </h3>
               <p className="text-text-subtle font-medium mt-2 font-spaceGrotesk text-sm">Multi-vector analysis of consumption habits.</p>
             </div>
             <div className="h-10 w-10 border border-white/10 rounded-full flex items-center justify-center -rotate-45 group-hover:bg-white/10 transition-colors">
               <TrendingUp className="h-4 w-4 text-white/50" />
             </div>
           </div>
           
           <div className="flex-1 min-h-0 relative z-10 p-4">
             {genreData.length > 0 ? (
               <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={genreData}>
                  <PolarGrid stroke="rgba(255,255,255,0.1)" strokeDasharray="3 3" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 11, fontFamily: 'Space Grotesk' }} />
                  <Radar
                    name="Strength"
                    dataKey="A"
                    stroke="var(--color-accent)"
                    strokeWidth={3}
                    fill="url(#colorAccent)"
                    fillOpacity={0.6}
                  />
                  <defs>
                    <linearGradient id="colorAccent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#7C3AED" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(9,9,11,0.8)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}
                    itemStyle={{ color: '#fff', fontSize: '14px', fontWeight: 'bold' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
             ) : (
                <div className="h-full flex flex-col items-center justify-center text-text-subtle gap-4">
                  <Activity className="h-10 w-10 opacity-20" />
                  <p className="text-xs font-black uppercase tracking-widest font-spaceGrotesk">Insufficient Data Vectors</p>
                </div>
             )}
           </div>
        </div>

        {/* Status Breakdown - Remaining col */}
        <div className="col-span-1 md:col-span-3 lg:col-span-4 xl:col-span-4 row-span-1 glass border border-white/10 shadow-xl rounded-[40px] flex flex-col justify-center px-8 lg:px-12 relative overflow-hidden group hover:border-white/20 transition-colors">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 h-full">
            <div className="space-y-4 text-center md:text-left flex-1 py-8 md:py-0">
               <h3 className="text-2xl md:text-4xl font-black uppercase italic tracking-tighter text-white font-syne">Vault<span className="text-sakura drop-shadow-[0_0_10px_rgba(255,107,158,0.5)]">Allocation</span></h3>
               <p className="text-text-subtle font-medium font-spaceGrotesk max-w-xs mx-auto md:mx-0">Distribution of archived records by status.</p>
               <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-4">
                 {statusData.map((item, index) => (
                   <div key={item.name} className="flex items-center gap-2 bg-white/5 border border-white/5 px-3 py-1.5 rounded-xl">
                     <div className="h-2.5 w-2.5 rounded-full shadow-glow" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                     <span className="text-[10px] font-black uppercase tracking-widest text-white/80 font-spaceGrotesk">{item.name}</span>
                   </div>
                 ))}
              </div>
            </div>
            
            <div className="h-full w-full md:w-[300px] shrink-0 min-h-[200px] md:min-h-[250px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius="60%"
                    outerRadius="90%"
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                    cornerRadius={8}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                     contentStyle={{ backgroundColor: 'rgba(9,9,11,0.8)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}
                     itemStyle={{ color: '#fff', fontSize: '14px', fontWeight: 'bold' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Inner Glow */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <div className="h-20 w-20 rounded-full bg-white/5 blur-xl" />
              </div>
            </div>
          </div>
        </div>

      </StaggerGrid>
    </div>
  )
}

function MetricCard({ title, value, icon, description, className, borderColor, accentColor, isFloat }: any) {
  const isNumber = typeof value === 'number'
  const { ref, value: countValue } = useCountUp<HTMLHeadingElement>(
    isNumber ? value : 0, 
    2000, 
    isFloat ? 2 : 0
  )

  return (
    <div className={cn(
      "glass border border-white/5 transition-all duration-500 rounded-[32px] overflow-hidden relative group shadow-card flex flex-col p-8",
      borderColor,
      className
    )}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none" />
      <div className="flex items-start justify-between mb-auto">
        <div className={cn(
          "p-3 rounded-2xl bg-white/5 border border-white/10 transition-transform duration-500 group-hover:scale-110 shadow-glow"
        )}>
          {icon}
        </div>
      </div>
      <div className="space-y-3 mt-6">
        <p className="text-[10px] font-black text-text-subtle uppercase tracking-[0.3em] font-spaceGrotesk">{title}</p>
        <h3 
          ref={isNumber ? ref : undefined}
          className={cn(
            "text-4xl md:text-5xl font-black italic tracking-tighter uppercase font-syne drop-shadow-md",
            accentColor || "text-white"
          )}
        >
          {isNumber ? countValue : value}
        </h3>
      </div>
      <p className="text-[10px] text-text-subtle/60 mt-4 font-bold leading-relaxed uppercase tracking-wider font-spaceGrotesk opacity-0 max-h-0 overflow-hidden group-hover:opacity-100 group-hover:max-h-[30px] transition-all duration-500">{description}</p>
    </div>
  )
}
