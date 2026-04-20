import React from 'react'

export default function MyListLoading() {
  return (
    <div className="space-y-12 pb-24 max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 pt-6 md:pt-10 animate-pulse">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 -mx-4 sm:mx-0 px-4 sm:px-0">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
             <div className="h-16 w-16 bg-surface-container rounded-[20px]" />
             <div className="h-16 w-64 bg-surface-container rounded-lg" />
          </div>
          <div className="h-6 w-96 bg-surface-container rounded-md" />
        </div>
        <div className="flex items-center gap-3">
           <div className="h-14 w-24 bg-surface-container rounded-2xl" />
           <div className="h-14 w-32 bg-surface-container rounded-2xl" />
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-12">
        {/* Desktop Sidebar Filter Skeleton */}
        <aside className="hidden xl:block w-[300px] shrink-0 space-y-8">
           <div className="space-y-4">
              <div className="h-4 w-32 bg-surface-container rounded mb-4" />
              <div className="space-y-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-14 w-full bg-surface-container rounded-2xl" />
                ))}
              </div>
           </div>
        </aside>

        {/* Main List Grid Skeleton */}
        <div className="flex-1 min-w-0">
           <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="bg-surface border border-white/5 rounded-[32px] overflow-hidden h-56 flex">
                  <div className="w-40 h-full bg-surface-container flex-shrink-0" />
                  <div className="flex-1 p-5 flex flex-col justify-between">
                     <div className="space-y-3">
                        <div className="h-6 w-3/4 bg-surface-container rounded" />
                        <div className="h-4 w-1/3 bg-surface-container rounded" />
                     </div>
                     <div className="h-8 w-full bg-surface-container rounded-xl" />
                  </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  )
}
