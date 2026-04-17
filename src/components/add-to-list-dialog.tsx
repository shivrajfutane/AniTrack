'use client'

import React, { useState } from 'react'
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
import { Anime } from '@/lib/jikan'
import { AnimeStatus, upsertAnimeListItem } from '@/app/(dashboard)/actions'
import { createActivity } from '@/app/(dashboard)/social-actions'
import { Loader2, Share2 } from 'lucide-react'
import { Switch } from '@/components/ui/switch'

interface AddToListDialogProps {
  anime: Anime
  trigger: React.ReactNode
}

export function AddToListDialog({ anime, trigger }: AddToListDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<AnimeStatus>('plan_to_watch')
  const [episodes, setEpisodes] = useState(0)
  const [score, setScore] = useState(0)
  const [isShared, setIsShared] = useState(true)

  async function handleSubmit() {
    setLoading(true)
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
    } catch (error) {
      console.error('Failed to add to list:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-slate-900 border-slate-800 text-white shadow-2xl">
        <DialogHeader>
          <DialogTitle>Add to My List</DialogTitle>
          <DialogDescription className="text-slate-400">
            {anime.title_english || anime.title}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="status" className="text-slate-300">Status</Label>
            <Select value={status} onValueChange={(val) => setStatus(val as AnimeStatus)}>
              <SelectTrigger className="bg-slate-950 border-slate-800 text-white">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-800 text-white">
                <SelectItem value="plan_to_watch">Plan to Watch</SelectItem>
                <SelectItem value="watching">Watching</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="on_hold">On Hold</SelectItem>
                <SelectItem value="dropped">Dropped</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <div className="flex justify-between items-center">
              <Label className="text-slate-300">Episodes Watched</Label>
              <span className="text-xs text-slate-500 font-mono">
                {episodes} / {anime.episodes || '??'}
              </span>
            </div>
            <Slider
              value={[episodes]}
              max={anime.episodes || 100}
              step={1}
              onValueChange={(val) => setEpisodes(Array.isArray(val) ? val[0] : val)}
              className="py-4"
            />
            <Input 
              type="number" 
              value={episodes}
              onChange={(e) => setEpisodes(parseInt(e.target.value) || 0)}
              className="bg-slate-950 border-slate-800 text-white h-8 w-20 ml-auto"
            />
          </div>

          <div className="grid gap-2">
             <div className="flex justify-between items-center">
              <Label className="text-slate-300">Your Score</Label>
              <span className="text-xs text-amber-500 font-bold">
                {score > 0 ? `${score}/10` : 'Not Rated'}
              </span>
            </div>
            <Slider
              value={[score]}
              max={10}
              step={1}
              onValueChange={(val) => setScore(Array.isArray(val) ? val[0] : val)}
              className="py-4"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-anime-purple/10 text-anime-purple">
                <Share2 className="h-4 w-4" />
              </div>
              <div>
                <Label className="text-sm font-bold text-white">Share with Community</Label>
                <p className="text-[10px] text-slate-500">Post this update to the live feed.</p>
              </div>
            </div>
            <Switch checked={isShared} onCheckedChange={setIsShared} />
          </div>
        </div>

        <DialogFooter>
          <Button 
            className="w-full bg-anime-purple-dark hover:bg-anime-purple-dark/90 text-white border-0"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save to List
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
