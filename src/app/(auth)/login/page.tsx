'use client'

import React, { useRef } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { login, signup, signInWithGoogle } from '@/app/auth/actions'
import { Tv, Mail, Globe, ExternalLink, Lock } from 'lucide-react'
import Link from 'next/link'
import { gsap } from '@/lib/gsap-config'
import { useGSAP } from '@gsap/react'
import { rippleButton } from '@/lib/animations'

export default function AuthPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  
  useGSAP(() => {
    // Cinematic background orbs
    gsap.to('.blob-1', {
      scale: 1.4,
      x: 100,
      y: 50,
      duration: 15,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })
    gsap.to('.blob-2', {
      scale: 0.9,
      x: -50,
      y: -100,
      duration: 12,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: 2
    })
    gsap.to('.blob-3', {
      scale: 1.2,
      x: -100,
      y: 100,
      duration: 18,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: 1
    })

    // Entry animation
    gsap.from('.auth-card', {
      opacity: 0,
      y: 50,
      scale: 0.95,
      duration: 1,
      ease: 'power3.out'
    })
  }, { scope: containerRef })

  const handleRipple = (e: React.MouseEvent<HTMLElement>) => {
    rippleButton(e.currentTarget, e.nativeEvent)
  }

  return (
    <div ref={containerRef} className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#09090B] px-4">
      {/* Background Orbs */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden mix-blend-screen">
        <div className="blob-1 absolute top-[-10%] left-[20%] h-[60%] w-[60%] rounded-full bg-accent blur-[140px] opacity-20" />
        <div className="blob-2 absolute bottom-[10%] right-[10%] h-[50%] w-[50%] rounded-full bg-sakura blur-[120px] opacity-15" />
        <div className="blob-3 absolute top-[30%] left-[-20%] h-[40%] w-[40%] rounded-full bg-cyan blur-[120px] opacity-15" />
        <div className="absolute inset-0 noise-overlay mix-blend-overlay opacity-30" />
      </div>

      <div className="auth-card z-10 w-full max-w-[480px] space-y-10 relative">
        <div className="flex flex-col items-center">
          <div className="h-24 w-24 bg-accent/20 rounded-[32px] flex items-center justify-center shadow-glow border border-accent/20 mb-6 cursor-pointer hover:scale-105 transition-transform duration-500">
            <Tv className="text-white h-10 w-10 drop-shadow-[0_0_10px_rgba(124,58,237,0.8)]" />
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter text-center uppercase italic font-syne">
            Ani<span className="text-accent gradient-text drop-shadow-[0_0_10px_rgba(124,58,237,0.5)]">Track</span>
            <span className="block text-xs font-black text-accent-light tracking-[0.4em] uppercase mt-4 font-spaceGrotesk">Security Protocol V8.0</span>
          </h1>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-surface/50 border border-white/5 p-1.5 rounded-3xl backdrop-blur-xl h-14 relative z-20">
            <TabsTrigger value="login" className="rounded-2xl data-[state=active]:bg-accent data-[state=active]:text-white transition-all font-black uppercase text-[10px] tracking-widest italic font-syne data-[state=active]:shadow-glow">Node Access</TabsTrigger>
            <TabsTrigger value="signup" className="rounded-2xl data-[state=active]:bg-sakura data-[state=active]:text-white transition-all font-black uppercase text-[10px] tracking-widest italic font-syne data-[state=active]:shadow-glow">New Signature</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="mt-8">
            <Card className="glass-elevated border-white/10 rounded-[40px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.5)] p-2">
              <CardHeader className="pb-4 pt-8 px-8">
                <CardTitle className="text-3xl font-black text-white italic uppercase tracking-tighter font-syne">Welcome Operator</CardTitle>
                <CardDescription className="text-text-subtle font-medium font-spaceGrotesk">
                  Synchronize your terminal with the global feed.
                </CardDescription>
              </CardHeader>
              <form action={login}>
                <CardContent className="space-y-6 pt-6 px-8">
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-accent font-spaceGrotesk">Identification Email</Label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-subtle group-focus-within:text-accent transition-colors" />
                      <Input name="email" type="email" placeholder="operator@nexus.com" required className="bg-surface/50 border-white/10 pl-14 h-14 text-white focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all rounded-2xl font-bold font-spaceGrotesk" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center px-1">
                      <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-accent font-spaceGrotesk">Passcode</Label>
                      <button type="button" className="text-[10px] text-text-subtle hover:text-white font-black uppercase tracking-widest transition-colors font-spaceGrotesk">Recover Keys?</button>
                    </div>
                    <div className="relative group">
                       <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-subtle group-focus-within:text-accent transition-colors" />
                       <Input name="password" type="password" placeholder="••••••••" required className="bg-surface/50 border-white/10 pl-14 h-14 text-white focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all rounded-2xl font-bold font-spaceGrotesk" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-6 pt-6 pb-8 px-8">
                  <Button 
                    onMouseDown={handleRipple}
                    type="submit" 
                    className="w-full bg-accent text-white border-0 h-16 rounded-2xl font-black uppercase text-sm tracking-[0.2em] shadow-glow transition-all active:scale-95 italic font-syne hover:bg-accent-light"
                  >
                    Initiate Link
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="signup" className="mt-8">
            <Card className="glass-elevated border-white/10 rounded-[40px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.5)] p-2">
              <CardHeader className="pb-4 pt-8 px-8">
                <CardTitle className="text-3xl font-black text-white italic uppercase tracking-tighter font-syne">New Registry</CardTitle>
                <CardDescription className="text-text-subtle font-medium font-spaceGrotesk">
                  Establish your signature in the archival stream.
                </CardDescription>
              </CardHeader>
              <form action={signup}>
                <CardContent className="space-y-6 pt-6 px-8">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-sakura font-spaceGrotesk">Codename</Label>
                      <Input name="username" placeholder="Watcher_X" required className="bg-surface/50 border-white/10 h-14 text-white focus:border-sakura focus:ring-4 focus:ring-sakura/10 transition-all rounded-2xl font-bold font-spaceGrotesk" />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-sakura font-spaceGrotesk">Email</Label>
                      <Input name="email" type="email" placeholder="hq@nexus.com" required className="bg-surface/50 border-white/10 h-14 text-white focus:border-sakura focus:ring-4 focus:ring-sakura/10 transition-all rounded-2xl font-bold font-spaceGrotesk" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-sakura font-spaceGrotesk">Secure Passcode</Label>
                    <Input name="password" type="password" placeholder="••••••••" required className="bg-surface/50 border-white/10 h-14 text-white focus:border-sakura focus:ring-4 focus:ring-sakura/10 transition-all rounded-2xl font-bold font-spaceGrotesk" />
                  </div>
                </CardContent>
                <CardFooter className="pt-6 pb-8 px-8">
                  <Button 
                    onMouseDown={handleRipple}
                    type="submit" 
                    className="w-full bg-sakura hover:bg-sakura-light text-white border-0 h-16 rounded-2xl font-black uppercase text-sm tracking-[0.2em] shadow-[0_0_20px_rgba(255,107,158,0.5)] transition-all active:scale-95 italic font-syne"
                  >
                    Establish Node
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase font-black tracking-[0.4em] font-spaceGrotesk">
            <span className="bg-[#09090B] px-4 text-text-subtle">External Verification</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <form action={signInWithGoogle}>
            <Button 
              onMouseDown={handleRipple}
              variant="outline" 
              type="submit" 
              className="w-full h-14 bg-surface border-white/5 text-text-subtle hover:text-white hover:border-accent hover:bg-accent/10 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all italic font-syne"
            >
              <Globe className="mr-2 h-4 w-4 text-accent" />
              Google Node
            </Button>
          </form>
          <Link href="/api/auth/mal/authorize" className="w-full">
            <Button 
              onMouseDown={handleRipple}
              variant="outline" 
              className="w-full h-14 bg-surface border-white/5 text-text-subtle hover:text-white hover:border-sakura hover:bg-sakura/10 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all italic font-syne"
            >
              <ExternalLink className="mr-2 h-4 w-4 text-sakura" />
              MAL Archival
            </Button>
          </Link>
        </div>

        <p className="text-center text-[10px] text-text-subtle font-black uppercase tracking-[0.2em] cursor-default font-spaceGrotesk">
          Bypassing access controls constitutes a <span className="text-red-400 drop-shadow-[0_0_5px_rgba(248,113,113,0.5)]">Class-A Violation</span>.
        </p>
      </div>
    </div>
  )
}
