'use client'

import React from 'react'
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
import { TrendingUp, Clock, Star, Trophy, Target } from 'lucide-react'
import { TrackedAnime, calculateSummaryStats, getStatusDistribution, getGenreDistribution, getWatcherArchetype } from '@/lib/stats'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444']

export function StatsDashboard({ list }: { list: TrackedAnime[] }) {
  const summary = calculateSummaryStats(list)
  const statusData = getStatusDistribution(list)
  const genreData = getGenreDistribution(list)
  const archetype = getWatcherArchetype(list)

  return (
    <div className="space-y-12 pb-20 relative overflow-hidden">
      {/* Dynamic Background Scanning Effect */}
      <div className="fixed top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-anime-purple-border to-transparent z-50 pointer-events-none" 
           style={{ animation: 'scan 4s linear infinite' }} />
      
      <div className="flex flex-col gap-2 relative z-10">
        <h1 className="text-4xl font-black text-white tracking-tight flex items-center gap-4">
          Insights & DNA
          {list.length > 0 && (
             <span className="h-2 w-2 rounded-full bg-anime-teal animate-ping" />
          )}
        </h1>
        <p className="text-slate-400">Your anime watching habits visualized.</p>
      </div>

      {/* Top Level Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Days Watched" 
          value={summary.totalDays} 
          icon={<Clock className="text-anime-teal" />} 
          description="Total time spent across all shows"
        />
        <MetricCard 
          title="Mean Score" 
          value={summary.meanScore} 
          icon={<Star className="text-amber-400" />} 
          description="Your average rating across your list"
        />
        <MetricCard 
          title="Episodes" 
          value={summary.totalEpisodes} 
          icon={<TrendingUp className="text-anime-purple" />} 
          description="Total count of episodes logged"
        />
        <MetricCard 
          title="Archetype" 
          value={archetype.name} 
          subValue={archetype.description}
          icon={<Trophy className="text-anime-teal" />} 
          description="Based on your tracking behavior"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Genre Radar Chart */}
        <Card className="bg-slate-900/40 border-slate-800 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Target className="h-5 w-5 text-anime-purple" />
              Genre DNA
            </CardTitle>
            <CardDescription className="text-slate-400">Analysis of your top 7 most watched genres.</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
             {genreData.length > 0 ? (
               <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={genreData}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <Radar
                    name="Strength"
                    dataKey="A"
                    stroke="#8b5cf6"
                    fill="#8b5cf6"
                    fillOpacity={0.5}
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
             ) : (
                <div className="h-full flex items-center justify-center text-slate-500">Track more anime to see your DNA</div>
             )}
          </CardContent>
        </Card>

        {/* Status Breakdown Chart */}
        <Card className="bg-slate-900/40 border-slate-800 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white">Status Breakdown</CardTitle>
            <CardDescription className="text-slate-400">How your library is distributed.</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff' }}
                   itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
               {statusData.map((item, index) => (
                 <div key={item.name} className="flex items-center gap-2">
                   <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                   <span className="text-xs text-slate-400">{item.name} ({item.value})</span>
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className={cn(
        "bg-slate-900/40 border-slate-800 backdrop-blur-xl transition-all duration-300 relative overflow-hidden",
        isHighlight ? "border-anime-teal/40 shadow-[0_0_20px_rgba(93,202,165,0.1)] scale-105" : "hover:border-slate-700"
      )}>
        {isHighlight && (
          <div className="absolute top-0 right-0 p-2">
             <div className="bg-anime-teal/10 text-anime-teal text-[8px] font-black px-2 py-0.5 rounded-md uppercase tracking-tighter">Unique</div>
          </div>
        )}
        <CardContent className="pt-6">
          <div className="flex items-start justify-between mb-4">
            <div className={cn(
              "p-2 rounded-xl border",
              isHighlight ? "bg-anime-teal/10 border-anime-teal/20" : "bg-slate-950 border-slate-800"
            )}>
              {icon}
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{title}</p>
            <h3 className={cn(
              "text-3xl font-black",
              isHighlight ? "text-anime-teal" : "text-white"
            )}>{value}</h3>
            {subValue && <p className="text-sm text-slate-400 font-medium leading-tight">{subValue}</p>}
          </div>
          <p className="text-[10px] text-slate-500 mt-4 leading-relaxed">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

