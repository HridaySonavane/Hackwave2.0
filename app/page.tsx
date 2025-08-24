"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import {
  ArrowRight,
  Brain,
  Zap,
  Target,
  CheckCircle,
  Star,
  Moon,
  Sun,
  FileText,
  Rocket,
  UserCheck,
  Settings,
  Shield,
  BarChart3,
} from "lucide-react";
import { useEffect, useState } from "react";

function ThemeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem("theme");
    if (
      savedTheme === "dark" ||
      (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setIsDarkMode(!isDarkMode);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="w-9 h-9 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
    >
      {isDarkMode ? (
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem]" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 transition-colors duration-300">
      <header className="px-6 py-6 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center dark:bg-gray-700">
            <Brain className="w-5 h-5 text-white" />
          </div>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <a
            href="#about"
            className="text-gray-600 hover:text-gray-900 transition-colors uppercase tracking-wide dark:text-gray-300 dark:hover:text-white"
          >
            About
          </a>
          <a
            href="#features"
            className="text-gray-600 hover:text-gray-900 transition-colors uppercase tracking-wide dark:text-gray-300 dark:hover:text-white"
          >
            Features
          </a>
          <a
            href="#collection"
            className="text-gray-600 hover:text-gray-900 transition-colors uppercase tracking-wide dark:text-gray-300 dark:hover:text-white"
          >
            Collection
          </a>
          <a
            href="#support"
            className="text-gray-600 hover:text-gray-900 transition-colors uppercase tracking-wide dark:text-gray-300 dark:hover:text-white"
          >
            Support
          </a>
        </nav>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <div className="flex items-center gap-3">
            <Link href="/auth/signin">
              <Button
                variant="outline"
                className="rounded-full px-6 text-sm border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button className="bg-gray-900 hover:bg-gray-800 text-white rounded-full px-6 text-sm dark:bg-gray-700 dark:hover:bg-gray-600">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="px-6 py-8 max-w-7xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 lg:p-12 dark:bg-gray-800/80 transition-colors duration-300">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wider dark:text-gray-400">
                  Trending AI Solutions
                </p>
                <h1 className="text-5xl lg:text-6xl font-black leading-tight text-gray-900 dark:text-white">
                  PUREVIBE
                  <br />
                  <span className="text-4xl lg:text-5xl">MULTI-AGENT</span>
                </h1>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-md dark:border-gray-800"></div>
                    <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-md dark:border-gray-800"></div>
                    <div className="w-4 h-4 bg-blue-400 rounded-full border-2 border-white shadow-md dark:border-gray-800"></div>
                  </div>
                </div>
              </div>
              <Button className="bg-gray-900 hover:bg-gray-800 text-white rounded-full px-8 py-3 text-sm font-medium dark:bg-gray-700 dark:hover:bg-gray-600">
                ADD TO WORKSPACE
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <div className="grid grid-cols-2 gap-6 pt-8">
                <div className="bg-blue-50 rounded-2xl p-6 dark:bg-blue-900/30">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center dark:bg-blue-800">
                      <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      98%
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    Accuracy rate in
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    Requirements Analysis
                  </p>
                </div>
                <div className="bg-cyan-50 rounded-2xl p-6 dark:bg-cyan-900/30">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center dark:bg-cyan-800">
                      <Zap className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      2.5s
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    Average processing
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    time per requirement
                  </p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-200 to-blue-300 rounded-3xl p-12 relative overflow-hidden dark:from-blue-900 dark:to-indigo-900">
                <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500 dark:bg-gray-800/90">
                  <CardContent className="p-8">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center dark:from-blue-600 dark:to-indigo-600">
                            <Brain className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 dark:text-white">
                              AI Agent Network
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              5 agents active
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            Requirements Analysis
                          </span>
                          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden dark:bg-gray-700">
                            <div className="w-20 h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full dark:from-blue-500 dark:to-indigo-500"></div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            Validation Process
                          </span>
                          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden dark:bg-gray-700">
                            <div className="w-16 h-full bg-gradient-to-r from-cyan-400 to-cyan-600 rounded-full dark:from-cyan-500 dark:to-teal-500"></div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            Optimization
                          </span>
                          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden dark:bg-gray-700">
                            <div className="w-18 h-full bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-full dark:from-indigo-500 dark:to-purple-500"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <div className="absolute top-8 right-8 w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center shadow-lg dark:bg-blue-600">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-white/30 rounded-full dark:bg-gray-700/30"></div>
                <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-white/20 rounded-full dark:bg-gray-700/20"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <section id="features" className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
              Meet Your AI Agent Team
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto dark:text-gray-300">
              Six specialized AI agents work together to transform your vague
              ideas into crystal-clear, actionable requirements.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl hover:shadow-xl transition-shadow dark:bg-gray-800/80">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 dark:bg-blue-900/50">
                  <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">
                  📝 Clarifier
                </h3>
                <p className="text-xs text-gray-500 mb-2 dark:text-gray-400">
                  Idea Refiner & Critical Thinker
                </p>
                <p className="text-gray-600 text-sm dark:text-gray-300">
                  Transforms vague ideas into clear, structured requirements.
                  Challenges assumptions, highlights conflicts, and ensures
                  every requirement is well-defined and conflict-free.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl hover:shadow-xl transition-shadow dark:bg-gray-800/80">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 dark:bg-purple-900/50">
                  <Rocket className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">
                  🚀 Product Visionary
                </h3>
                <p className="text-xs text-gray-500 mb-2 dark:text-gray-400">
                  Value Aligner
                </p>
                <p className="text-gray-600 text-sm dark:text-gray-300">
                  Aligns requirements with the bigger product vision. Focuses on
                  features that bring the most value and support long-term
                  growth.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl hover:shadow-xl transition-shadow dark:bg-gray-800/80">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 dark:bg-green-900/50">
                  <UserCheck className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">
                  👩‍💻 Customer Voice
                </h3>
                <p className="text-xs text-gray-500 mb-2 dark:text-gray-400">
                  User Advocate
                </p>
                <p className="text-gray-600 text-sm dark:text-gray-300">
                  Represents real customer needs and expectations. Ensures
                  requirements solve genuine problems and create better user
                  experiences.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl hover:shadow-xl transition-shadow dark:bg-gray-800/80">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4 dark:bg-orange-900/50">
                  <Settings className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">
                  🔧 Engineer
                </h3>
                <p className="text-xs text-gray-500 mb-2 dark:text-gray-400">
                  Solution Architect
                </p>
                <p className="text-gray-600 text-sm dark:text-gray-300">
                  Evaluates technical feasibility and complexity. Suggests
                  practical approaches that balance innovation with scalability
                  and reliability.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl hover:shadow-xl transition-shadow dark:bg-gray-800/80">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4 dark:bg-red-900/50">
                  <Shield className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">
                  🛡 Risk Guardian
                </h3>
                <p className="text-xs text-gray-500 mb-2 dark:text-gray-400">
                  Compliance Expert
                </p>
                <p className="text-gray-600 text-sm dark:text-gray-300">
                  Identifies risks, compliance gaps, and security concerns
                  early. Keeps requirements safe, legal, and aligned with
                  industry standards.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl hover:shadow-xl transition-shadow dark:bg-gray-800/80">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4 dark:bg-indigo-900/50">
                  <BarChart3 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">
                  📊 Aggregator
                </h3>
                <p className="text-xs text-gray-500 mb-2 dark:text-gray-400">
                  Decision Synthesizer
                </p>
                <p className="text-gray-600 text-sm dark:text-gray-300">
                  Collects all agent insights, resolves conflicts, and produces
                  a final set of refined, actionable requirements.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-2xl rounded-3xl dark:bg-gray-800/80">
            <CardContent className="p-12 text-center">
              <div className="space-y-6">
                <div className="flex items-center justify-center gap-2 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-blue-400 text-blue-400 dark:fill-blue-500 dark:text-blue-500"
                    />
                  ))}
                  <span className="text-sm text-gray-600 ml-2 dark:text-gray-300">
                    Trusted by 500+ product teams
                  </span>
                </div>
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
                  Ready to Transform Your Requirements?
                </h2>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto dark:text-gray-300">
                  Join leading product teams who use PureVibe to build better
                  products faster.
                </p>
                <div className="flex items-center justify-center gap-4 pt-4">
                  <Button className="bg-gray-900 hover:bg-gray-800 text-white rounded-full px-8 py-3 dark:bg-gray-700 dark:hover:bg-gray-600">
                    Start Free Trial
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-full px-8 py-3 border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    Schedule Demo
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
