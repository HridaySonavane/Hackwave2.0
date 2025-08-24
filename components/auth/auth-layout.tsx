"use client";
import type React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Brain, Target, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

function ThemeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
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
      className="w-9 h-9 text-slate-600 hover:text-slate-800 hover:bg-blue-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800"
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
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 transition-colors duration-300 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        {showBackButton && (
          <div className="mb-8">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-slate-600 hover:text-slate-800 hover:bg-blue-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800"
            >
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>
        )}
        {/* Logo */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-100 backdrop-blur-sm rounded-xl flex items-center justify-center border border-blue-200 dark:bg-gray-800 dark:border-gray-700">
              <Brain className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-3">
              <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
                PureVibe
              </h1>
              <p className="text-sm text-slate-600 dark:text-gray-300">
                AI-Powered Requirements Refinement
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>
        {/* Header */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-slate-800 mb-2 dark:text-white">
            {title}
          </h2>
          <p className="text-slate-600 dark:text-gray-300">{subtitle}</p>
        </div>
        {/* Form */}
        {children}
      </div>
    </div>
  );
}
