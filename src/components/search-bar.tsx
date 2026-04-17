'use client'

import React, { useRef } from 'react'
import { Search as SearchIcon } from 'lucide-react'
import { animateSearchExpand } from '@/lib/animations'

interface SearchBarProps {
  placeholder?: string
  onSearch?: (value: string) => void
}

export function SearchBar({ placeholder = "Search for an anime...", onSearch }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFocus = () => {
    if (inputRef.current) {
      animateSearchExpand(inputRef.current)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch?.(e.target.value)
  }

  return (
    <div className="relative w-full max-w-lg mx-auto group">
      <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-subtle group-focus-within:text-accent transition-colors" />
      <input
        ref={inputRef}
        type="text"
        onChange={handleChange}
        onFocus={handleFocus}
        className="w-full bg-muted/30 border border-white/5 rounded-full pl-12 pr-6 py-3 text-sm placeholder:text-text-subtle text-text focus:outline-none focus:border-accent/50 focus:ring-4 focus:ring-accent/10 transition-all duration-300 min-h-[48px] backdrop-blur-md"
        placeholder={placeholder}
      />
    </div>
  )
}
