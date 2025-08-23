import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

interface UsageOverviewProps {
	usage: {
		resumes_created: number;
		downloads_used: number;
		ai_optimizations_used: number;
	} | null;
	subscription: {
		plan_id: string;
		status: string;
	} | null;
}

export function UsageOverview({ usage, subscription }: UsageOverviewProps) {
	// Define limits based on plan
	const getLimits = (planId: string | null) => {
		switch (planId) {
			case "professional":
				return { resumes: 10, downloads: 50, ai: 25 };
			case "premium":
				return { resumes: 50, downloads: 200, ai: 100 };
			case "enterprise":
				return { resumes: -1, downloads: -1, ai: -1 }; // Unlimited
			default:
				return { resumes: 3, downloads: 5, ai: 2 }; // Free plan
		}
	};

	const limits = getLimits(subscription?.plan_id || null);
	const currentUsage = usage || {
		resumes_created: 0,
		downloads_used: 0,
		ai_optimizations_used: 0,
	};

	const usageItems = [
		{
			label: "Resumes Created",
			current: currentUsage.resumes_created,
			limit: limits.resumes,
			color: "bg-blue-600",
		},
		{
			label: "Downloads Used",
			current: currentUsage.downloads_used,
			limit: limits.downloads,
			color: "bg-green-600",
		},
		{
			label: "AI Optimizations",
			current: currentUsage.ai_optimizations_used,
			limit: limits.ai,
			color: "bg-purple-600",
		},
	];

	return (
		<Card className="dark:bg-gray-950 dark:inset-ring-1 dark:inset-ring-gray-700/70 dark:hover:shadow-md dark:hover:shadow-gray-800/80 transition-shadow duration-300">
			<CardHeader className="flex flex-row items-center justify-between">
				<CardTitle className="text-xl dark:text-gray-200">
					Usage Overview
				</CardTitle>
				{!subscription && (
					<Button size="sm" asChild>
						<a href="/pricing">Upgrade Plan</a>
					</Button>
				)}
			</CardHeader>
			<CardContent className="space-y-6">
				{usageItems.map((item, index) => (
					<div key={index} className="space-y-2">
						<div className="flex justify-between text-sm">
							<span className="font-medium text-gray-900 dark:text-gray-300">
								{item.label}
							</span>
							<span className="text-gray-600 dark:text-gray-400">
								{item.current} /{" "}
								{item.limit === -1 ? "∞" : item.limit}
							</span>
						</div>
						<Progress
							value={
								item.limit === -1
									? 0
									: (item.current / item.limit) * 100
							}
							className="h-2"
						/>
						{item.limit !== -1 &&
							item.current >= item.limit * 0.8 && (
								<p className="text-xs text-amber-600">
									You&apos;re approaching your{" "}
									{item.label.toLowerCase()} limit
								</p>
							)}
					</div>
				))}

				{!subscription && (
					<div className="mt-6 p-4 bg-blue-50 dark:bg-blue-100 rounded-lg">
						<h4 className="font-medium text-blue-900 mb-2">
							Upgrade for More Features
						</h4>
						<p className="text-sm text-blue-700 mb-3">
							Get unlimited resumes, downloads, and AI
							optimizations with our premium plans.
						</p>
						<Button
							className="dark:bg-gradient-to-br dark:from-blue-500 dark:via-indigo-600 dark:to-purple-700 dark:text-white"
							size="sm"
							asChild
						>
							<a href="/pricing">View Plans</a>
						</Button>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
