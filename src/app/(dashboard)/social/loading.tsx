import React from 'react'

export default function SocialLoading() {
  return (
    <div className="max-w-[800px] w-full mx-auto px-4 py-8 md:py-12 animate-pulse">
      {/* Header Skeleton */}
      <div className="mb-10 text-center space-y-4 flex flex-col items-center">
        <div className="h-16 w-16 bg-surface-container rounded-2xl" />
        <div className="h-10 w-64 bg-surface-container rounded-lg" />
        <div className="h-4 w-96 bg-surface-container rounded" />
      </div>

      {/* Tabs Skeleton */}
      <div className="w-full flex justify-center mb-8">
        <div className="h-14 w-60 bg-surface-container-low rounded-3xl" />
      </div>

      {/* Feed Layout Skeleton */}
      <div className="space-y-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-surface border border-white/5 p-6 rounded-3xl flex gap-6">
            <div className="h-14 w-14 rounded-full bg-surface-container flex-shrink-0" />
            <div className="flex-1 space-y-3">
              <div className="flex justify-between items-center">
                <div className="h-5 w-40 bg-surface-container rounded" />
                <div className="h-4 w-20 bg-surface-container rounded" />
              </div>
              <div className="h-4 w-3/4 bg-surface-container rounded" />
              <div className="h-20 w-full bg-surface-container/50 rounded-2xl mt-4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
