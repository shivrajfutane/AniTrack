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
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-slate-950 px-4">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-anime-purple/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-anime-teal/10 blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="z-10 w-full max-w-md"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="h-16 w-16 bg-gradient-to-br from-anime-purple-dark to-anime-teal-dark rounded-2xl flex items-center justify-center shadow-2xl shadow-anime-purple/20 mb-4">
            <Tv className="text-white h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Anime Tracker</h1>
          <p className="text-slate-400 text-sm mt-2">Track. Discover. Share.</p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-900/50 border border-slate-800">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="mt-4">
            <Card className="bg-slate-900/40 border-slate-800 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white">Welcome Back</CardTitle>
                <CardDescription className="text-slate-400">
                  Enter your credentials to access your list.
                </CardDescription>
              </CardHeader>
              <form action={login}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" placeholder="name@example.com" required className="bg-slate-950/50 border-slate-800 text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" name="password" type="password" required className="bg-slate-950/50 border-slate-800 text-white" />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <Button type="submit" className="w-full bg-anime-purple-dark hover:bg-anime-purple-dark/90 text-white border-0">
                    Sign In
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="signup" className="mt-4">
            <Card className="bg-slate-900/40 border-slate-800 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white">Create Account</CardTitle>
                <CardDescription className="text-slate-400">
                  Join the community and start tracking.
                </CardDescription>
              </CardHeader>
              <form action={signup}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" name="username" placeholder="otaku_123" required className="bg-slate-950/50 border-slate-800 text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input id="signup-email" name="email" type="email" placeholder="name@example.com" required className="bg-slate-950/50 border-slate-800 text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input id="signup-password" name="password" type="password" required className="bg-slate-950/50 border-slate-800 text-white" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full bg-anime-teal-dark hover:bg-anime-teal-dark/90 text-white border-0">
                    Create Account
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-800" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-slate-950 px-2 text-slate-500">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <form action={signInWithGoogle}>
            <Button variant="outline" type="submit" className="w-full bg-slate-900 border-slate-800 text-white hover:bg-slate-800">
              <Globe className="mr-2 h-4 w-4" />
              Google
            </Button>
          </form>
          <Link href="/api/auth/mal/authorize">
            <Button variant="outline" className="w-full bg-slate-900 border-slate-800 text-white hover:bg-slate-800">
              <ExternalLink className="mr-2 h-4 w-4" />
              MyAnimeList
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
