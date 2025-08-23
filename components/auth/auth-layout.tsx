"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles } from "lucide-react";
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
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
			<div className="flex min-h-screen dark:bg-gray-950">
				{/* Left Side - Form */}
				<div className="flex-1/3 flex flex-col justify-center px-4 sm:px-6 lg:px-8">
					<div className="mx-auto w-full max-w-md">
						{/* Back Button */}
						{showBackButton && (
							<div className="my-8">
								<Button variant="ghost" size="sm" asChild>
									<Link href="/">
										<ArrowLeft className="w-4 h-4 mr-2" />
										Back to Home
									</Link>
								</Button>
							</div>
						)}

						{/* Logo */}
						<div className="flex items-center mb-8">
							<div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
								<span className="text-white font-bold text-lg">
									AI
								</span>
							</div>
							<div className="ml-3">
								<h1 className="text-2xl font-bold text-gray-900 dark:text-gray-300">
									ResumeAI
								</h1>
								<p className="text-sm text-gray-500 dark:text-gray-400">
									AI-Powered Resume Builder
								</p>
							</div>
						</div>

						{/* Header */}
						<div className="mb-8 dark:bg-gray-950">
							<h2 className="text-3xl font-bold text-gray-900 dark:text-gray-300 mb-2">
								{title}
							</h2>
							<p className="text-gray-600 dark:text-gray-400">
								{subtitle}
							</p>
						</div>

						{/* Form */}
						{children}
					</div>
				</div>

				{/* Right Side - Visual */}
				<div className="hidden lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:px-8 bg-gradient-to-br from-blue-600 to-purple-700 rounded-l-4xl">
					<div className="max-w-md mx-auto text-center text-white">
						{/* Floating Elements */}
						<div className="relative mb-12">
							<div className="absolute -top-4 -left-4 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
							<div className="absolute -bottom-4 -right-4 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>

							{/* Main Visual */}
							<div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
								<div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
									<Sparkles className="w-8 h-8 text-white" />
								</div>
								<h3 className="text-2xl font-bold mb-4">
									AI-Powered Resume Builder
								</h3>
								<p className="text-white/80 leading-relaxed">
									Create professional, ATS-optimized resumes
									in minutes with our advanced AI technology.
								</p>
							</div>
						</div>

						{/* Stats */}
						<div className="my-12 grid grid-cols-2 gap-8">
							<div>
								<div className="text-3xl font-bold">50K+</div>
								<div className="text-white/80 text-sm">
									Resumes Created
								</div>
							</div>
							<div>
								<div className="text-3xl font-bold">4.9/5</div>
								<div className="text-white/80 text-sm">
									User Rating
								</div>
							</div>
						</div>

						{/* Features */}
						<div className="space-y-6">
							<div className="flex items-center gap-4">
								<div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
									<span className="text-sm font-bold">✓</span>
								</div>
								<span className="text-left">
									50+ Professional Templates
								</span>
							</div>
							<div className="flex items-center gap-4">
								<div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
									<span className="text-sm font-bold">✓</span>
								</div>
								<span className="text-left">
									AI-Powered Content Optimization
								</span>
							</div>
							<div className="flex items-center gap-4">
								<div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
									<span className="text-sm font-bold">✓</span>
								</div>
								<span className="text-left">
									95% ATS Compatibility Rate
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
