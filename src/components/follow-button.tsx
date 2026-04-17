'use client'

import React, { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { UserPlus, UserMinus, Loader2 } from 'lucide-react'
import { followUser, unfollowUser } from '@/app/(dashboard)/social-actions'
import { cn } from '@/lib/utils'

interface FollowButtonProps {
  followingId: string
  initialIsFollowing: boolean
}

export function FollowButton({ followingId, initialIsFollowing }: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing)
  const [isPending, startTransition] = useTransition()

  async function handleToggle() {
    startTransition(async () => {
      const result = isFollowing 
        ? await unfollowUser(followingId) 
        : await followUser(followingId)

      if (result.success) {
        setIsFollowing(!isFollowing)
      } else {
        console.error('Follow operation failed:', result.error)
      }
    })
  }

  return (
    <Button
      variant={isFollowing ? "outline" : "default"}
      size="sm"
      className={cn(
        "gap-2 transition-all duration-300 rounded-xl px-6",
        isFollowing 
          ? "border-slate-700 bg-transparent text-slate-400 hover:text-red-400 hover:border-red-400/50" 
          : "bg-anime-purple hover:bg-anime-purple-dark text-white shadow-lg shadow-anime-purple/20"
      )}
      onClick={handleToggle}
      disabled={isPending}
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isFollowing ? (
        <>
          <UserMinus className="h-4 w-4" /> Unfollow
        </>
      ) : (
        <>
          <UserPlus className="h-4 w-4" /> Follow Profile
        </>
      )}
    </Button>
  )
}
