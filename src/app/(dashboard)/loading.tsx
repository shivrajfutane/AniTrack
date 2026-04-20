import React from 'react'

export default function DiscoverLoading() {
  return (
    <div className="flex flex-col gap-12 pb-24 w-full h-full max-w-[2000px] mx-auto animate-pulse">
      {/* Hero Skeleton */}
      <section className="relative w-full h-[60vh] md:h-[80vh] min-h-[500px] max-h-[800px] bg-surface-container overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-[#09090B]/60 to-transparent z-10" />
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 lg:p-20 z-20 flex flex-col justify-end">
          <div className="h-6 w-32 bg-surface-container-highest rounded mb-4" />
          <div className="h-16 w-3/4 md:w-1/2 bg-surface-container-highest rounded-lg mb-6" />
          <div className="h-4 w-full md:w-1/3 bg-surface-container-highest rounded mb-2" />
          <div className="h-4 w-2/3 md:w-1/4 bg-surface-container-highest rounded mb-8" />
          <div className="flex gap-4">
            <div className="h-14 w-40 bg-surface-container-highest rounded-2xl" />
            <div className="h-14 w-40 bg-surface-container-highest rounded-2xl" />
          </div>
        </div>
      </section>

      {/* Rows Skeleton */}
      {Array.from({ length: 3 }).map((_, i) => (
        <section key={i} className="px-4 md:px-8 lg:px-12">
          <div className="flex justify-between items-end mb-6">
            <div className="h-8 w-64 bg-surface-container rounded-lg" />
            <div className="h-6 w-20 bg-surface-container rounded" />
          </div>
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 5 }).map((_, j) => (
              <div key={j} className="h-72 w-52 bg-surface-container rounded-3xl flex-shrink-0" />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
