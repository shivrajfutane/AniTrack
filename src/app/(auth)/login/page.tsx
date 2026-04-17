'use client'

import React, { useRef } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { login, signup, signInWithGoogle } from '@/app/auth/actions'
import { Tv, Mail, Globe, ExternalLink, Zap, Lock } from 'lucide-react'
import Link from 'next/link'
import { gsap } from '@/lib/gsap-config'
import { useGSAP } from '@gsap/react'
import { rippleButton } from '@/lib/animations'

export default function AuthPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  
  useGSAP(() => {
    // Background blobs animation
    gsap.to('.blob-1', {
      scale: 1.3,
      opacity: 0.15,
      duration: 10,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })
    gsap.to('.blob-2', {
      scale: 0.8,
      opacity: 0.1,
      duration: 8,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: 1
    })

    // Entry animation
    gsap.from('.auth-card', {
      opacity: 0,
      y: 40,
      scale: 0.95,
      duration: 0.8,
      ease: 'power3.out'
    })
  }, { scope: containerRef })

  const handleRipple = (e: React.MouseEvent<HTMLElement>) => {
    rippleButton(e.currentTarget, e.nativeEvent)
  }

  return (
    <div ref={containerRef} className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#09090B] px-4 font-sans">
      {/* Cinematic Background Blobs */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="blob-1 absolute top-[-10%] left-[-10%] h-[60%] w-[60%] rounded-full bg-accent/20 blur-[120px] opacity-10" />
        <div className="blob-2 absolute bottom-[-10%] right-[-10%] h-[50%] w-[50%] rounded-full bg-pink/10 blur-[100px] opacity-5" />
      </div>

      <div className="auth-card z-10 w-full max-w-[520px] space-y-12">
        <div className="flex flex-col items-center">
          <div className="h-24 w-24 bg-accent rounded-[32px] flex items-center justify-center shadow-2xl shadow-accent/20 mb-8 cursor-pointer hover:rotate-12 transition-transform duration-500">
            <Tv className="text-white h-12 w-12" />
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter text-center uppercase italic italic">
            Ani<span className="text-accent underline decoration-4 underline-offset-8">Track</span>
            <span className="block text-xs font-black text-text-subtle tracking-[0.4em] uppercase mt-4">Security Protocol 7.2</span>
          </h1>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-muted/30 border border-white/5 p-1.5 rounded-3xl backdrop-blur-xl h-14">
            <TabsTrigger value="login" className="rounded-2xl data-[state=active]:bg-accent data-[state=active]:text-white transition-all font-black uppercase text-[10px] tracking-widest italic">Node Access</TabsTrigger>
            <TabsTrigger value="signup" className="rounded-2xl data-[state=active]:bg-pink data-[state=active]:text-white transition-all font-black uppercase text-[10px] tracking-widest italic">New Signature</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="mt-8">
            <Card className="bg-surface border-white/5 backdrop-blur-3xl rounded-[40px] overflow-hidden shadow-2xl p-4">
              <CardHeader className="pb-4">
                <CardTitle className="text-3xl font-black text-white italic uppercase tracking-tighter">Welcome Operator</CardTitle>
                <CardDescription className="text-text-subtle font-medium">
                  Synchronize your list with the global broadcast feed.
                </CardDescription>
              </CardHeader>
              <form action={login}>
                <CardContent className="space-y-6 pt-6">
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">Identification Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-subtle" />
                      <Input name="email" type="email" placeholder="operator@nexus.com" required className="bg-black/20 border-white/5 pl-14 h-14 text-white focus:border-accent transition-all rounded-2xl font-bold" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center px-1">
                      <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">Passcode</Label>
                      <button type="button" className="text-[10px] text-text-subtle hover:text-white font-black uppercase tracking-widest transition-colors">Recover Keys?</button>
                    </div>
                    <div className="relative">
                       <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-subtle" />
                       <Input name="password" type="password" required className="bg-black/20 border-white/5 pl-14 h-14 text-white focus:border-accent transition-all rounded-2xl font-bold" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-6 pt-6 p-8">
                  <Button 
                    onMouseDown={handleRipple}
                    type="submit" 
                    className="w-full bg-accent hover:bg-accent-dark text-white border-0 h-16 rounded-2xl font-black uppercase text-sm tracking-[0.2em] shadow-2xl shadow-accent/20 transition-all active:scale-95 italic"
                  >
                    Initiate Link
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="signup" className="mt-8">
            <Card className="bg-surface border-white/5 backdrop-blur-3xl rounded-[40px] overflow-hidden shadow-2xl p-4">
              <CardHeader className="pb-4">
                <CardTitle className="text-3xl font-black text-white italic uppercase tracking-tighter">New Registry</CardTitle>
                <CardDescription className="text-text-subtle font-medium">
                  Establish your signature in the archival stream.
                </CardDescription>
              </CardHeader>
              <form action={signup}>
                <CardContent className="space-y-6 pt-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-pink">Codename</Label>
                      <Input name="username" placeholder="Watcher_X" required className="bg-black/20 border-white/5 h-14 text-white focus:border-pink transition-all rounded-2xl font-bold" />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-pink">Email</Label>
                      <Input name="email" type="email" placeholder="hq@nexus.com" required className="bg-black/20 border-white/5 h-14 text-white focus:border-pink transition-all rounded-2xl font-bold" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-pink">Secure Passcode</Label>
                    <Input name="password" type="password" required className="bg-black/20 border-white/5 h-14 text-white focus:border-pink transition-all rounded-2xl font-bold" />
                  </div>
                </CardContent>
                <CardFooter className="pt-6 p-8">
                  <Button 
                    onMouseDown={handleRipple}
                    type="submit" 
                    className="w-full bg-pink hover:bg-pink-dark text-white border-0 h-16 rounded-2xl font-black uppercase text-sm tracking-[0.2em] shadow-2xl shadow-pink/20 transition-all active:scale-95 italic"
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
            <span className="w-full border-t border-white/5" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase font-black tracking-[0.5em]">
            <span className="bg-[#09090B] px-4 text-text-subtle">External Verification</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <form action={signInWithGoogle}>
            <Button 
              onMouseDown={handleRipple}
              variant="outline" 
              type="submit" 
              className="w-full h-14 bg-surface border-white/5 text-text-muted hover:text-white hover:border-accent rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all italic"
            >
              <Globe className="mr-2 h-4 w-4 text-accent" />
              Google Node
            </Button>
          </form>
          <Link href="/api/auth/mal/authorize">
            <Button 
              onMouseDown={handleRipple}
              variant="outline" 
              className="w-full h-14 bg-surface border-white/5 text-text-muted hover:text-white hover:border-accent rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all italic"
            >
              <ExternalLink className="mr-2 h-4 w-4 text-accent" />
              MAL Archival
            </Button>
          </Link>
        </div>

        <p className="text-center text-[10px] text-text-subtle font-black uppercase tracking-widest cursor-default">
          Bypassing access controls constitutes a <span className="text-red-400">Class-A Violation</span>.
        </p>
      </div>
    </div>
  )
}
