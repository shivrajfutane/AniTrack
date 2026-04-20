'use client'

import React, { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service if necessary
    console.error('Unhandled Global Error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-[#09090B] flex items-center justify-center p-6">
      <div className="max-w-xl w-full glass p-12 rounded-[48px] border border-red-500/20 relative overflow-hidden text-center space-y-8 animate-page-entry">
        {/* Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-64 w-64 bg-red-500/10 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="h-24 w-24 bg-red-500/10 border border-red-500/20 rounded-3xl mx-auto flex items-center justify-center text-red-500 shadow-[0_0_50px_rgba(239,68,68,0.2)]">
          <AlertCircle className="h-12 w-12" />
        </div>

        <div className="space-y-3">
          <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter font-syne">
            System <span className="text-red-500">Critical</span>
          </h1>
          <p className="text-text-subtle font-medium font-spaceGrotesk leading-relaxed">
            A fatal exception has occurred in the neural core. Transmission interrupted.
          </p>
          <div className="bg-black/40 border border-white/5 p-4 rounded-xl mt-6">
             <code className="text-xs text-red-400 font-mono break-all line-clamp-2">
               {error.message || 'Unknown sector malfunction'}
             </code>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button 
            onClick={() => reset()}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white border-0 h-16 rounded-2xl font-black uppercase text-xs tracking-widest italic font-syne transition-all shadow-xl shadow-red-500/20"
          >
            <RefreshCw className="mr-2 h-5 w-5" />
            Reboot Core
          </Button>
          <Link href="/" className="flex-1">
            <Button 
              variant="outline"
              className="w-full border-white/10 text-white hover:text-red-400 hover:border-red-500/50 hover:bg-red-500/10 rounded-2xl h-16 font-black uppercase text-xs tracking-widest italic font-syne transition-all glass"
            >
              <Home className="mr-2 h-5 w-5" />
              Emergency Exit
            </Button>
          </Link>
        </div>
        
        <p className="text-[10px] font-black text-text-subtle/40 uppercase tracking-[0.4em] pt-4 font-spaceGrotesk">
          Error Digest: {error.digest || 'N/A'}
        </p>
      </div>
    </div>
  )
}
