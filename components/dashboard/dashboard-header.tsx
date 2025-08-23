"use client";

import { useState } from "react";
import { Bell, Search, User, Settings, LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/components/providers/auth-provider";

interface DashboardHeaderProps {
	userId?: string;
}

export function DashboardHeader({ userId }: DashboardHeaderProps) {
	const { user, signOut } = useAuth();
	const [isSearchOpen, setIsSearchOpen] = useState(false);

	const handleSignOut = async () => {
		await signOut();
		window.location.href = "/";
	};

	return (
		<header className="bg-gray-100 dark:bg-gray-950 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					{/* Logo and Navigation */}
					<div className="flex items-center">
						<div className="flex-shrink-0">
							<h1 className="text-xl font-bold text-gray-900 dark:text-gray-300">
								SkillFresher
							</h1>
						</div>
						<nav className="hidden md:ml-8 md:flex md:space-x-8">
							<a
								href={`/dashboard/${userId}`}
								className="text-gray-900 dark:text-gray-300 hover:text-gray-700 px-3 py-2 text-sm font-medium"
							>
								Dashboard
							</a>
							<a
								href="/templete"
								className="text-gray-500 dark:text-gray-400 hover:text-gray-700 px-3 py-2 text-sm font-medium"
							>
								Templates
							</a>
							<a
								href={`/resumes/${userId}`}
								className="text-gray-500 dark:text-gray-400 hover:text-gray-700 px-3 py-2 text-sm font-medium"
							>
								My Resumes
							</a>
						</nav>
					</div>

					{/* Search and User Menu */}
					<div className="flex items-center space-x-4">
						{/* Search */}
						<div className="hidden md:block">
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<Search className="h-4 w-4 text-gray-400" />
								</div>
								<Input
									type="text"
									placeholder="Search resumes..."
									className="pl-10 pr-4 py-2 w-64"
								/>
							</div>
						</div>

						{/* Mobile search button */}
						<Button
							variant="ghost"
							size="sm"
							className="md:hidden"
							onClick={() => setIsSearchOpen(!isSearchOpen)}
						>
							<Search className="h-4 w-4" />
						</Button>

						{/* Notifications */}
						<Button variant="ghost" size="sm" className="relative">
							<Bell className="h-4 w-4" />
							<span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
						</Button>

						{/* User Menu */}
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									size="sm"
									className="flex items-center space-x-2"
								>
									<div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
										<User className="h-4 w-4 text-white" />
									</div>
									<span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-500">
										{user?.email?.split("@")[0] || "User"}
									</span>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-56">
								<DropdownMenuLabel>
									My Account
								</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuItem>
									<User className="mr-2 h-4 w-4" />
									<span>Profile</span>
								</DropdownMenuItem>
								<DropdownMenuItem>
									<Settings className="mr-2 h-4 w-4" />
									<span>Settings</span>
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem onClick={handleSignOut}>
									<LogOut className="mr-2 h-4 w-4" />
									<span>Sign out</span>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>

						{/* Mobile menu button */}
						<Button variant="ghost" size="sm" className="md:hidden">
							<Menu className="h-4 w-4" />
						</Button>
					</div>
				</div>

				{/* Mobile search */}
				{isSearchOpen && (
					<div className="md:hidden py-4">
						<div className="relative">
							<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<Search className="h-4 w-4 text-gray-400" />
							</div>
							<Input
								type="text"
								placeholder="Search resumes..."
								className="pl-10 pr-4 py-2 w-full"
							/>
						</div>
					</div>
				)}
			</div>
		</header>
	);
}
