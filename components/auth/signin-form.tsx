/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Loader2, Eye, EyeOff, Mail, Lock, Github } from "lucide-react"
import { supabase, authService } from "@/lib/supabase/auth"
import Link from "next/link"

export function SignInForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState({
    email: false,
    magic: false,
    google: false,
    github: false,
  })
  const [error, setError] = useState("")
  const [magicLinkSent, setMagicLinkSent] = useState(false)

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading((prev) => ({ ...prev, email: true }))
    setError("")

    try {
      await authService.signIn(formData.email, formData.password)

      // Poll for session hydration (up to 2 seconds)
      let sessionUser = null
      for (let i = 0; i < 20; i++) {
        const {
          data: { user: currentUser },
        } = await supabase.auth.getUser()
        if (currentUser) {
          sessionUser = currentUser
          break
        }
        await new Promise((res) => setTimeout(res, 100))
      }

      console.log("Signed in user:", sessionUser)

      if (!sessionUser) {
        setError("Session not established. Please try again.")
        return
      }

      // Fetch the user's profile to get the real role
      const { data: profile, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", sessionUser.id)
        .single()

      if (error || !profile) {
        setError("Could not fetch user profile.")
        return
      }

      if (profile.role === "admin") {
        window.location.href = "/admin"
      } else {
        window.location.href = `/dashboard/${sessionUser.id}?role=${profile.role}`
      }
    } catch (err: any) {
      setError(err.message || "Failed to sign in")
    } finally {
      setIsLoading((prev) => ({ ...prev, email: false }))
    }
  }

  const handleMagicLink = async () => {
    if (!formData.email) {
      setError("Please enter your email address")
      return
    }

    setIsLoading((prev) => ({ ...prev, magic: true }))
    setError("")

    try {
      await authService.signInWithOTP(formData.email)
      setMagicLinkSent(true)
    } catch (err: any) {
      setError(err.message || "Failed to send magic link")
    } finally {
      setIsLoading((prev) => ({ ...prev, magic: false }))
    }
  }

  const handleSocialSignIn = async (provider: "google" | "github") => {
    setIsLoading((prev) => ({ ...prev, [provider]: true }))
    setError("")

    try {
      // Implement social sign-in
      console.log(`Sign in with ${provider}`)
    } catch (err: any) {
      setError(err.message || `Failed to sign in with ${provider}`)
    } finally {
      setIsLoading((prev) => ({ ...prev, [provider]: false }))
    }
  }

  if (magicLinkSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-2xl rounded-3xl">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Check your email</h3>
              <p className="text-gray-600 mb-6">
                We&apos;ve sent a magic link to <strong>{formData.email}</strong>
              </p>
              <Button
                variant="outline"
                onClick={() => setMagicLinkSent(false)}
                className="w-full bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all rounded-full"
              >
                Back to sign in
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        {/* Social Sign In */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={() => handleSocialSignIn("google")}
            disabled={Object.values(isLoading).some(Boolean)}
            className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all"
          >
            {isLoading.google ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </>
            )}
          </Button>

          <Button
            variant="outline"
            onClick={() => handleSocialSignIn("github")}
            disabled={Object.values(isLoading).some(Boolean)}
            className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all"
          >
            {isLoading.github ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Github className="w-4 h-4 mr-2" />
                GitHub
              </>
            )}
          </Button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 px-2 text-gray-500 dark:text-gray-400">
              Or continue with email
            </span>
          </div>
        </div>

        {/* Email Sign In Form */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-2xl rounded-3xl">
          <CardContent className="p-8">
            <form onSubmit={handleEmailSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    className="pl-10 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    id="remember"
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <Label htmlFor="remember" className="text-sm text-gray-600">
                    Remember me
                  </Label>
                </div>
                <Link href="/auth/forgot-password" className="text-sm text-blue-600 dark:text-blue-500 hover:underline">
                  Forgot password?
                </Link>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-full"
                disabled={isLoading.email}
              >
                {isLoading.email ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all rounded-full"
                onClick={handleMagicLink}
                disabled={isLoading.magic || !formData.email}
              >
                {isLoading.magic ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending magic link...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Send magic link
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Sign Up Link */}
        <div className="text-center mb-8">
          <span className="text-gray-600">Don&apos;t have an account? </span>
          <Link href="/auth/signup" className="text-blue-600 dark:text-blue-500 hover:underline font-medium">
            Sign up for free
          </Link>
        </div>
      </div>
    </div>
  )
}
