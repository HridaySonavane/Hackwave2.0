"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Brain, Target } from "lucide-react";
import Link from "next/link";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  showBackButton?: boolean;
}

export function AuthLayout({
  children,
  title,
  subtitle,
  showBackButton = false,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">
      <div className="flex min-h-screen">
        {/* Left Side - Form */}
        <div className="flex-1 lg:flex-none lg:w-1/2 flex flex-col justify-center px-4 sm:px-6 lg:px-12">
          <div className="mx-auto w-full max-w-md">
            {/* Back Button */}
            {showBackButton && (
              <div className="mb-8">
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="text-slate-600 hover:text-slate-800 hover:bg-blue-50"
                >
                  <Link href="/">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                  </Link>
                </Button>
              </div>
            )}

            {/* Logo */}
            <div className="flex items-center mb-8">
              <div className="w-10 h-10 bg-blue-100 backdrop-blur-sm rounded-xl flex items-center justify-center border border-blue-200">
                <Brain className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-3">
                <h1 className="text-2xl font-bold text-slate-800">PureVibe</h1>
                <p className="text-sm text-slate-600">
                  AI-Powered Requirements Refinement
                </p>
              </div>
            </div>

            {/* Header */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-slate-800 mb-2">
                {title}
              </h2>
              <p className="text-slate-600">{subtitle}</p>
            </div>

            {/* Form */}
            {children}
          </div>
        </div>

        {/* Right Side - Visual */}
        <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:px-12">
          <div className="max-w-lg mx-auto">
            {/* Main Card */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-blue-100 shadow-xl mb-8">
              <div className="text-center text-slate-800 mb-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Target className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold mb-4">
                  What our Product Teams Said.
                </h3>
                <blockquote className="text-lg text-slate-700 mb-6">
                  "Refining product requirements is now easier than ever. Just
                  describe your idea and our AI agents handle the rest."
                </blockquote>
                <div className="flex items-center justify-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-300 to-indigo-400 rounded-full"></div>
                  <div className="text-left">
                    <div className="font-semibold">Sarah Chen</div>
                    <div className="text-sm text-slate-500">
                      Product Manager at TechCorp
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation dots */}
              <div className="flex justify-center gap-2 mb-6">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="w-2 h-2 bg-blue-200 rounded-full"></div>
                <div className="w-2 h-2 bg-blue-200 rounded-full"></div>
              </div>
            </div>

            {/* Bottom Card */}
            <div className="bg-blue-50/80 backdrop-blur-sm rounded-2xl p-6 border border-blue-100">
              <h4 className="text-slate-800 font-semibold mb-2">
                Get your requirements refined and ready to ship now
              </h4>
              <p className="text-slate-600 text-sm mb-4">
                Be among the first teams to experience the easiest way to refine
                product requirements.
              </p>
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-blue-300 to-indigo-400 rounded-full border-2 border-white"></div>
                  <div className="w-6 h-6 bg-gradient-to-br from-indigo-300 to-purple-400 rounded-full border-2 border-white"></div>
                  <div className="w-6 h-6 bg-gradient-to-br from-teal-300 to-blue-400 rounded-full border-2 border-white"></div>
                </div>
                <span className="text-slate-600 text-sm">
                  Join 500+ product teams
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
