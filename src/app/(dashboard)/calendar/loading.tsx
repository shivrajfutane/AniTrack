import React from 'react'

export default function CalendarLoading() {
  return (
    <div className="flex flex-col h-full w-full max-w-[1600px] mx-auto pt-6 px-4 pb-20 animate-pulse">
      {/* Header and Controls Skeleton */}
      <div className="flex items-end justify-between mb-8 flex-wrap py-4 gap-4">
        <div className="space-y-4">
          <div className="h-10 w-64 bg-surface-container rounded-lg" />
          <div className="h-5 w-96 bg-surface-container rounded-md" />
        </div>
        <div className="flex gap-2 bg-surface-container-low p-1 rounded-[16px]">
          <div className="h-10 w-24 bg-surface-container rounded-xl" />
          <div className="h-10 w-24 bg-surface-container rounded-xl" />
          <div className="h-10 w-24 bg-surface-container rounded-xl" />
        </div>
      </div>

      {/* Main View Area Skeleton (Week View Simulation) */}
      <div className="flex-1 min-h-[500px] overflow-hidden">
        <div className="flex gap-4 min-w-max pb-4">
          {Array.from({ length: 7 }).map((_, colIdx) => (
            <div key={colIdx} className="flex flex-col flex-shrink-0 w-[280px] p-4 rounded-3xl min-h-[500px] bg-surface-container-low/50">
              <div className="h-8 w-1/2 bg-surface-container rounded-md mb-6" />
              <div className="flex flex-col gap-4">
                {Array.from({ length: 3 }).map((_, cardIdx) => (
                  <div key={cardIdx} className="h-40 w-full bg-surface-container rounded-2xl" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
