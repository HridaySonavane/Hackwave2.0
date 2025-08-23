/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, FileText, Sparkles, Plus } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { QuickStats } from "@/components/dashboard/quick-stats";
import { RecentResumes } from "@/components/dashboard/recent-resumes";
import { UsageOverview } from "@/components/dashboard/usage-overview";
import { SubscriptionCard } from "@/components/dashboard/subscription-card";
import { supabase } from "@/lib/supabase/auth";
import { User } from "@supabase/auth-helpers-nextjs";
// import { se } from "date-fns/locale";

interface Subscription {
	plan_id: string;
	status: string;
	current_period_end: string;
}

interface UsageData {
	resumes_created: number;
	downloads_used: number;
	ai_optimizations_used: number;
}

export default function DashboardPage() {
	// const { user, loading: authLoading } = useAuth();

	const searchParams = useSearchParams();
	const params = useParams();
	const router = useRouter();
	const userId = params.userId as string;

	const [subscription, setSubscription] = useState<Subscription | null>(null);
	const [usage, setUsage] = useState<UsageData>({
		resumes_created: 0,
		downloads_used: 0,
		ai_optimizations_used: 0,
	});
	const [loading, setLoading] = useState(true);
	const [syncing, setSyncing] = useState(false);
	const [sessionId, setSessionId] = useState<any>(null);

	const success = searchParams.get("success");
	// const sessionId = searchParams.get("session_id");

	const [user, setUser] = useState<User | null>(null);

	useEffect(() => {
		const fetchUser = async () => {
			const { data, error } = await supabase.auth.getUser();
			const user = data?.user;
			setUser(user);
		};
		fetchUser();
	}, []);

	useEffect(() => {
		const checkAuth = async () => {
			const {
				data: { session },
			} = await supabase.auth.getSession();
			setSessionId(session?.user.id);
		};
		checkAuth();
	}, []);

	useEffect(() => {
		if (user) {
			// Check if the userId matches the authenticated user
			if (user.id !== userId) {
				// Redirect to correct user dashboard
				router.push(`/dashboard/${user.id}`);
				return;
			}

			// If coming from successful checkout, sync the subscription
			if (success === "true" && sessionId) {
				syncSubscription(sessionId);
			} else {
				loadDashboardData();
			}
		} else {
			setLoading(false);
		}
		// if (!authLoading) {
		// }
	}, [user, userId, success, sessionId, router]);

	const syncSubscription = async (sessionId: string) => {
		setSyncing(true);
		try {
			const response = await fetch("/api/stripe/sync-subscription", {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ sessionId }),
			});

			if (response.ok) {
				await loadDashboardData();
			} else {
				setLoading(false);
			}
		} catch (error) {
			console.error("Failed to sync subscription:", error);
			setLoading(false);
		} finally {
			setSyncing(false);
		}
	};

	const loadDashboardData = async () => {
		try {
			const subscriptionPromise = await fetch(
				"/api/stripe/check-subscription",
				{
					credentials: "include",
				}
			).catch(() => null);
			const usagePromise = await fetch("/api/usage/current").catch(
				() => null
			);

			const [subscriptionResponse, usageResponse] = await Promise.all([
				subscriptionPromise,
				usagePromise,
			]);

			if (subscriptionResponse && subscriptionResponse.ok) {
				const subscriptionData = await subscriptionResponse.json();
				setSubscription(subscriptionData.subscription);
			}

			if (usageResponse && usageResponse.ok) {
				const usageData = await usageResponse.json();
				setUsage(usageData);
			}
		} catch (error) {
			console.error("Failed to load dashboard data:", error);
		} finally {
			setLoading(false);
		}
	};

	if (syncing) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<div className="text-center">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
					<p className="text-gray-600">
						{syncing
							? "Setting up your subscription..."
							: "Loading..."}
					</p>
				</div>
			</div>
		);
	}

	if (!user) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-gray-900 dark:text-gray-200 mb-4">
						Authentication Required
					</h1>
					<p className="text-gray-600 dark:text-gray-400 mb-6">
						Please sign in to access your dashboard.
					</p>
					<Button asChild>
						<a href="/auth/signin">Sign In</a>
					</Button>
				</div>
			</div>
		);
	}

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<div className="text-center">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
					<p className="text-gray-600">Loading dashboard...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-50 dark:bg-gradient-to-b dark:from-gray-900/75 dark:to-gray-950">
			<DashboardHeader userId={userId} />

			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Success Message */}
				{success === "true" && (
					<Card className="mb-8 border-green-200 bg-green-50">
						<CardContent className="pt-6">
							<div className="flex items-center gap-2 text-green-800">
								<CheckCircle className="w-5 h-5" />
								<span className="font-semibold">
									Subscription activated successfully!
								</span>
							</div>
							<p className="text-green-700 mt-2">
								Welcome to your new plan. You can now access all
								premium features.
							</p>
						</CardContent>
					</Card>
				)}

				{/* Quick Stats */}
				<QuickStats usage={usage} subscription={subscription} />

				{/* Main Content Grid */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
					{/* Left Column - Main Content */}
					<div className="lg:col-span-2 space-y-8">
						{/* Recent Resumes */}
						<RecentResumes userId={userId} />

						{/* Usage Overview */}
						<UsageOverview
							usage={usage}
							subscription={subscription}
						/>
					</div>

					{/* Right Column - Sidebar */}
					<div className="space-y-6">
						{/* Subscription Card */}
						<SubscriptionCard subscription={subscription} />

						{/* Quick Actions */}
						<Card className="dark:bg-gray-950 dark:inset-ring-1 dark:inset-ring-gray-700/70 dark:hover:shadow-md dark:hover:shadow-gray-800/80 transition-shadow duration-300">
							<CardHeader>
								<CardTitle className="text-lg">
									Quick Actions
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3">
								<Button
									className="w-full justify-start dark:bg-gray-200"
									size="sm"
									asChild
								>
									<a href={`/create-resume/${userId}`}>
										<Plus className="w-4 h-4 mr-2" />
										Create New Resume
									</a>
								</Button>
								<Button
									variant="outline"
									className="w-full justify-start bg-transparent dark:text-gray-200"
									size="sm"
									asChild
								>
									<a href="/templates">
										<FileText className="w-4 h-4 mr-2" />
										Browse Templates
									</a>
								</Button>
								<Button
									variant="outline"
									className="w-full justify-start bg-transparent dark:text-gray-200"
									size="sm"
								>
									<Sparkles className="w-4 h-4 mr-2" />
									AI Optimization
								</Button>
							</CardContent>
						</Card>

						{/* Tips & Resources */}
						<Card className="dark:bg-gray-950 dark:inset-ring-1 dark:inset-ring-gray-700/70 dark:hover:shadow-md dark:hover:shadow-gray-800/80 transition-shadow duration-300">
							<CardHeader>
								<CardTitle className="text-lg">
									Tips & Resources
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3">
								<div className="text-sm">
									<h4 className="font-medium text-gray-900 dark:text-gray-200 mb-1">
										Resume Writing Tips
									</h4>
									<p className="text-gray-600 dark:text-gray-400">
										Learn how to write compelling resume
										content
									</p>
								</div>
								<div className="text-sm">
									<h4 className="font-medium text-gray-900 dark:text-gray-200 mb-1">
										ATS Optimization
									</h4>
									<p className="text-gray-600 dark:text-gray-400">
										Make your resume ATS-friendly
									</p>
								</div>
								<div className="text-sm">
									<h4 className="font-medium text-gray-900 dark:text-gray-200 mb-1">
										Interview Prep
									</h4>
									<p className="text-gray-600 dark:text-gray-400">
										Prepare for your next interview
									</p>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</main>
		</div>
	);
}
