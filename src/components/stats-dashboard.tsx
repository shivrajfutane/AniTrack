'use client'

import React, { useEffect, useRef } from 'react'
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { TrendingUp, Clock, Star, Trophy, Target, Zap, Activity } from 'lucide-react'
import { TrackedAnime, calculateSummaryStats, getStatusDistribution, getGenreDistribution, getWatcherArchetype } from '@/lib/stats'
import { cn } from '@/lib/utils'
import { useAnimateIn } from '@/hooks/useAnimateIn'
import { gsap } from '@/lib/gsap-config'
import { useGSAP } from '@gsap/react'

const COLORS = ['#7C3AED', '#EC4899', '#F59E0B', '#10b981', '#3b82f6']

export function StatsDashboard({ list }: { list: TrackedAnime[] }) {
  const summary = calculateSummaryStats(list)
  const statusData = getStatusDistribution(list)
  const genreData = getGenreDistribution(list)
  const archetype = getWatcherArchetype(list)
  
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    gsap.from('.stat-card', {
      opacity: 0,
      y: 30,
      stagger: 0.1,
      duration: 0.8,
      ease: 'power3.out',
    })
  }, { scope: containerRef })

  return (
    <div ref={containerRef} className="space-y-16 pb-20 relative">
      {/* Header */}
      <div className="flex flex-col gap-3 relative z-10 animate-page-entry">
        <div className="flex items-center gap-4">
           <div className="h-12 w-12 bg-accent/20 rounded-2xl flex items-center justify-center text-accent border border-accent/20 shadow-xl shadow-accent/10">
              <Activity className="h-6 w-6" />
           </div>
           <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic">
            Neural<span className="text-accent">Analytics</span>
          </h1>
        </div>
        <p className="text-text-subtle font-medium max-w-lg">Decoding your historical broadcast consumption signatures.</p>
      </div>

      {/* Top Level Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Days Streamed" 
          value={summary.totalDays} 
          icon={<Clock className="text-accent" />} 
          description="Total temporal displacement across segments."
        />
        <MetricCard 
          title="Mean Rating" 
          value={summary.meanScore} 
          icon={<Star className="text-gold" />} 
          description="Average qualitative node assessment."
        />
        <MetricCard 
          title="Packets Logged" 
          value={summary.totalEpisodes} 
          icon={<Zap className="text-pink" />} 
          description="Total count of broadcast units recorded."
        />
        <MetricCard 
          title="User Archetype" 
          value={archetype.name} 
          subValue={archetype.description}
          icon={<Trophy className="text-emerald-400" />} 
          description="Based on tracking behavioral patterns."
          variant="highlight"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Genre Radar Chart */}
        <Card className="bg-surface border-white/5 shadow-2xl rounded-[40px] overflow-hidden backdrop-blur-xl">
          <CardHeader className="p-8">
            <CardTitle className="text-2xl font-black uppercase italic tracking-tighter text-white flex items-center gap-3">
              <Target className="h-6 w-6 text-accent" />
              Genre<span className="text-accent">DNA</span>
            </CardTitle>
            <CardDescription className="text-text-subtle font-medium">Multi-vector analysis of your consumption habits.</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px] p-8 pt-0">
             {genreData.length > 0 ? (
               <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={genreData}>
                  <PolarGrid stroke="rgba(255,255,255,0.05)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 700 }} />
                  <Radar
                    name="Strength"
                    dataKey="A"
                    stroke="var(--color-accent)"
                    fill="var(--color-accent)"
                    fillOpacity={0.4}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
             ) : (
                <div className="h-full flex flex-col items-center justify-center text-text-subtle gap-4">
                  <Activity className="h-10 w-10 opacity-10" />
                  <p className="text-xs font-black uppercase tracking-widest">Insufficient Data</p>
                </div>
             )}
          </CardContent>
        </Card>

        {/* Status Breakdown Chart */}
        <Card className="bg-surface border-white/5 shadow-2xl rounded-[40px] overflow-hidden backdrop-blur-xl">
          <CardHeader className="p-8">
            <CardTitle className="text-2xl font-black uppercase italic tracking-tighter text-white">Vault<span className="text-pink">Allocation</span></CardTitle>
            <CardDescription className="text-text-subtle font-medium">Distribution of archived records by status.</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px] p-8 pt-0 flex flex-col items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="45%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ backgroundColor: '#18181B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                   itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-6 mt-4">
               {statusData.map((item, index) => (
                 <div key={item.name} className="flex items-center gap-2">
                   <div className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                   <span className="text-[10px] font-black uppercase tracking-widest text-text-subtle">{item.name}</span>
                 </div>
               ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function MetricCard({ title, value, subValue, icon, description, variant }: any) {
  const isHighlight = variant === 'highlight'
  
  return (
    <Card className={cn(
      "stat-card bg-surface border-white/5 hover:border-accent/30 transition-all duration-500 rounded-[32px] overflow-hidden relative group shadow-xl",
      isHighlight && "border-accent/40 bg-accent/5"
    )}>
      {isHighlight && (
        <div className="absolute top-0 right-0 p-4">
           <div className="bg-accent text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">Calculated</div>
        </div>
      )}
      <CardContent className="p-8">
        <div className="flex items-start justify-between mb-8">
          <div className={cn(
            "p-3 rounded-2xl border transition-transform duration-500 group-hover:scale-110",
            isHighlight ? "bg-accent text-white border-accent/20" : "bg-black/20 border-white/5"
          )}>
            {icon}
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-[10px] font-black text-text-subtle uppercase tracking-[0.3em]">{title}</p>
          <h3 className={cn(
            "text-4xl font-black italic tracking-tighter uppercase",
            isHighlight ? "text-accent" : "text-white"
          )}>{value}</h3>
          {subValue && <p className="text-sm text-text-muted font-bold leading-tight line-clamp-2">{subValue}</p>}
        </div>
        <p className="text-[10px] text-text-subtle/60 mt-6 font-medium leading-relaxed uppercase tracking-wider">{description}</p>
      </CardContent>
    </Card>
  )
}
