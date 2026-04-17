'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { login, signup, signInWithGoogle } from '@/app/auth/actions'
import { Tv, Mail, Globe, ExternalLink } from 'lucide-react'
import Link from 'next/link'

export default function AuthPage() {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#020617] px-4">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <motion.div 
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-20%] left-[-10%] h-[70%] w-[70%] rounded-full bg-anime-teal/20 blur-[150px]" 
        />
        <motion.div 
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-20%] right-[-10%] h-[70%] w-[70%] rounded-full bg-anime-sky/15 blur-[150px]" 
        />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="z-10 w-full max-w-lg"
      >
        <div className="flex flex-col items-center mb-10">
          <motion.div 
            whileHover={{ rotate: 15, scale: 1.1 }}
            className="h-20 w-20 bg-gradient-to-br from-anime-teal to-anime-sky rounded-[24px] flex items-center justify-center shadow-2xl shadow-anime-teal/30 mb-6 group cursor-pointer"
          >
            <Tv className="text-white h-10 w-10 group-hover:scale-110 transition-transform" />
          </motion.div>
          <h1 className="text-4xl font-black text-white tracking-tighter text-center">
            ANIME<span className="text-anime-teal">TRACKER</span>
            <span className="block text-sm font-medium text-slate-500 tracking-[0.3em] uppercase mt-2">Professional Edition</span>
          </h1>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-[#0F172A]/50 border border-slate-800/50 p-1 rounded-2xl backdrop-blur-md">
            <TabsTrigger value="login" className="rounded-xl data-[state=active]:bg-anime-teal data-[state=active]:text-white transition-all font-bold">Login</TabsTrigger>
            <TabsTrigger value="signup" className="rounded-xl data-[state=active]:bg-anime-sky data-[state=active]:text-white transition-all font-bold">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="mt-6">
            <Card className="bg-[#0F172A]/40 border-slate-800/50 backdrop-blur-2xl rounded-[32px] overflow-hidden shadow-2xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl font-black text-white">Welcome Back</CardTitle>
                <CardDescription className="text-slate-400 font-medium">
                  Access your curated list and DNA recommendations.
                </CardDescription>
              </CardHeader>
              <form action={login}>
                <CardContent className="space-y-5 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-slate-500">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                      <Input id="email" name="email" type="email" placeholder="name@example.com" required className="bg-[#020617]/50 border-slate-800 pl-10 h-11 text-white focus:border-anime-teal transition-colors rounded-xl" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="password" className="text-xs font-bold uppercase tracking-widest text-slate-500">Password</Label>
                      <button type="button" className="text-[10px] text-anime-sky hover:underline font-bold uppercase">Forgot Password?</button>
                    </div>
                    <Input id="password" name="password" type="password" required className="bg-[#020617]/50 border-slate-800 h-11 text-white focus:border-anime-teal transition-colors rounded-xl" />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4 pt-4">
                  <Button type="submit" className="w-full bg-anime-teal hover:bg-anime-teal-dark text-white border-0 h-12 rounded-xl font-black text-base shadow-lg shadow-anime-teal/20 transition-all active:scale-95">
                    Sign In
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="signup" className="mt-6">
            <Card className="bg-[#0F172A]/40 border-slate-800/50 backdrop-blur-2xl rounded-[32px] overflow-hidden shadow-2xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl font-black text-white">Create Account</CardTitle>
                <CardDescription className="text-slate-400 font-medium">
                  Start tracking your journey with the community.
                </CardDescription>
              </CardHeader>
              <form action={signup}>
                <CardContent className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-xs font-bold uppercase tracking-widest text-slate-500">Username</Label>
                    <Input id="username" name="username" placeholder="otaku_123" required className="bg-[#020617]/50 border-slate-800 h-11 text-white focus:border-anime-sky transition-colors rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-xs font-bold uppercase tracking-widest text-slate-500">Email Address</Label>
                    <Input id="signup-email" name="email" type="email" placeholder="name@example.com" required className="bg-[#020617]/50 border-slate-800 h-11 text-white focus:border-anime-sky transition-colors rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-xs font-bold uppercase tracking-widest text-slate-500">Password</Label>
                    <Input id="signup-password" name="password" type="password" required className="bg-[#020617]/50 border-slate-800 h-11 text-white focus:border-anime-sky transition-colors rounded-xl" />
                  </div>
                </CardContent>
                <CardFooter className="pt-4">
                  <Button type="submit" className="w-full bg-anime-sky hover:bg-anime-sky-dark text-white border-0 h-12 rounded-xl font-black text-base shadow-lg shadow-anime-sky/20 transition-all active:scale-95">
                    Create Account
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="relative my-10">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-800/50" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase font-black tracking-[0.2em]">
            <span className="bg-[#020617] px-4 text-slate-500">Secure Protocol</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <form action={signInWithGoogle}>
            <Button variant="outline" type="submit" className="w-full bg-[#0F172A]/80 border-slate-800/50 text-white hover:bg-slate-800 h-11 rounded-xl font-bold transition-all">
              <Globe className="mr-2 h-4 w-4 text-anime-sky" />
              Google
            </Button>
          </form>
          <Link href="/api/auth/mal/authorize">
            <Button variant="outline" className="w-full bg-[#0F172A]/80 border-slate-800/50 text-white hover:bg-slate-800 h-11 rounded-xl font-bold transition-all">
              <ExternalLink className="mr-2 h-4 w-4 text-anime-sky" />
              MyAnimeList
            </Button>
          </Link>
        </div>

        <p className="mt-8 text-center text-xs text-slate-600 font-medium">
          By continuing, you agree to our <button className="hover:text-white underline">Terms</button> & <button className="hover:text-white underline">Privacy</button>
        </p>
      </motion.div>
    </div>
  )
}
