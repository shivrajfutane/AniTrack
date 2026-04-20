'use client'

import React, { useState, useEffect } from 'react'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Star, Plus, Loader2, Share2, Tv, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Anime } from '@/lib/jikan'
import { AnimeStatus, upsertAnimeListItem } from '@/app/(dashboard)/actions'
import { createActivity } from '@/app/(dashboard)/social-actions'
import Link from 'next/link'
import { rippleButton } from '@/lib/animations'

interface AddToListDialogProps {
  anime: Anime
  trigger: React.ReactElement
}

export function AddToListDialog({ anime, trigger }: AddToListDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<AnimeStatus>('plan_to_watch')
  const [episodes, setEpisodes] = useState(0)
  const [score, setScore] = useState(0)
  const [isShared, setIsShared] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user))
  }, [])

  async function handleSubmit() {
    setLoading(true)
    setError(null)
    try {
      await upsertAnimeListItem({
        anime_id: anime.mal_id,
        anime_title: anime.title_english || anime.title,
        anime_image_url: anime.images.webp.large_image_url,
        genres: anime.genres.map(g => g.name),
        status,
        episodes_watched: episodes,
        total_episodes: anime.episodes,
        score: score > 0 ? score : null
      })

      if (isShared) {
        await createActivity({
          anime_id: anime.mal_id,
          anime_title: anime.title_english || anime.title,
          action_type: status === 'completed' ? 'completed' : 'updated',
          details: status === 'completed' ? 'Finished watching!' : `Reached episode ${episodes}`
        })
      }

      setOpen(false)
    } catch (err: any) {
      console.error('Failed to add to list:', err)
      setError(err.message || 'Failed to save. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleRipple = (e: React.MouseEvent<HTMLElement>) => {
    rippleButton(e.currentTarget, e.nativeEvent)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger} />
      <DialogContent className="sm:max-w-[480px] bg-elevated border-white/5 text-text shadow-2xl rounded-[40px] p-0 overflow-hidden">
        <DialogHeader className="p-8 pb-0">
          <div className="flex items-center gap-4 mb-4">
             <div className="h-12 w-12 bg-accent/20 rounded-2xl flex items-center justify-center text-accent">
                <Plus className="h-6 w-6" />
             </div>
             <div>
                <DialogTitle className="text-2xl font-black uppercase tracking-tighter italic">Add to My List</DialogTitle>
                <DialogDescription className="text-text-subtle font-medium">
                  {anime.title_english || anime.title}
                </DialogDescription>
             </div>
          </div>
        </DialogHeader>
        
        {user ? (
          <div className="p-8 space-y-8">
            <div className="space-y-6">
              <div className="grid gap-3">
                <Label className="text-xs font-black uppercase tracking-widest text-accent">Status</Label>
                <Select value={status} onValueChange={(val) => setStatus(val as AnimeStatus)}>
                  <SelectTrigger className="bg-surface/50 border-white/5 text-white h-14 rounded-2xl focus:ring-accent/20">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="bg-elevated border-white/10 text-white rounded-2xl">
                    <SelectItem value="plan_to_watch">Plan to Watch</SelectItem>
                    <SelectItem value="watching">Watching</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="on_hold">On Hold</SelectItem>
                    <SelectItem value="dropped">Dropped</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-xs font-black uppercase tracking-widest text-accent">Episodes Watched</Label>
                  <span className="text-sm font-black text-white font-mono">
                    {episodes} <span className="text-white/20">/</span> {anime.episodes || '??'}
                  </span>
                </div>
                <Slider
                  value={[episodes]}
                  max={anime.episodes || 100}
                  step={1}
                  onValueChange={(val: number | readonly number[]) => setEpisodes(typeof val === 'number' ? val : val[0])}
                  className="py-2"
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-xs font-black uppercase tracking-widest text-accent">Your Rating</Label>
                  <span className="text-sm font-black text-gold font-mono uppercase tracking-widest italic">
                    {score > 0 ? `${score}.0` : 'NOT RATED'}
                  </span>
                </div>
                <Slider
                  value={[score]}
                  max={10}
                  step={1}
                  onValueChange={(val: number | readonly number[]) => setScore(typeof val === 'number' ? val : val[0])}
                  className="py-2"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-surface/30 border border-white/5 group hover:bg-surface/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-accent/10 text-accent group-hover:scale-110 transition-transform">
                    <Share2 className="h-5 w-5" />
                  </div>
                  <div>
                    <Label className="text-sm font-bold text-white">Share with Hive</Label>
                    <p className="text-[10px] text-text-subtle uppercase tracking-widest font-black mt-0.5">Share update with activity feed</p>
                  </div>
                </div>
                <Switch checked={isShared} onCheckedChange={setIsShared} />
              </div>
             {error && (
               <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest animate-pulse">
                 {error}
               </div>
             )}
            </div>

            <DialogFooter className="pt-4">
              <Button 
                onMouseDown={handleRipple}
                className="w-full bg-accent hover:bg-accent-dark text-white border-0 h-16 rounded-2xl font-black uppercase text-sm tracking-[0.2em] shadow-2xl shadow-accent/20 italic active:scale-95 transition-all"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Plus className="mr-2 h-5 w-5" />}
                Save to List
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <div className="p-12 flex flex-col items-center justify-center text-center space-y-8">
            <div className="h-20 w-20 bg-accent/10 border border-accent/20 rounded-3xl flex items-center justify-center text-accent shadow-2xl shadow-accent/10">
              <Tv className="h-10 w-10" />
            </div>
            <div className="space-y-2">
              <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic leading-none">Access <span className="text-accent">Denied</span></h3>
              <p className="text-sm text-text-subtle font-medium max-w-[240px]">Please sign in to track your anime and sync with your profile.</p>
            </div>
            <Link href="/login" className="w-full">
              <Button className="w-full bg-accent hover:bg-accent-dark text-white rounded-2xl h-16 font-black uppercase text-xs tracking-[0.2em] italic shadow-xl shadow-accent/20">
                Sign In
              </Button>
            </Link>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
