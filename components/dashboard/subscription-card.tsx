import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, CreditCard, AlertCircle } from "lucide-react";

interface SubscriptionCardProps {
	subscription: {
		plan_id: string;
		status: string;
		current_period_end: string;
	} | null;
}

export function SubscriptionCard({ subscription }: SubscriptionCardProps) {
	if (!subscription) {
		return (
			<Card className="dark:bg-gray-950 dark:inset-ring-1 dark:inset-ring-gray-700/70 dark:hover:shadow-md dark:hover:shadow-gray-800/80 transition-shadow duration-300">
				<CardHeader>
					<CardTitle className="text-lg flex items-center gap-2">
						<AlertCircle className="w-5 h-5 text-amber-500" />
						Free Plan
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="text-sm text-gray-600">
						<p>
							You&apos;re currently on the free plan with limited
							features.
						</p>
					</div>
					<div className="space-y-2 text-sm">
						<div className="flex justify-between">
							<span>Resumes:</span>
							<span>3 per month</span>
						</div>
						<div className="flex justify-between">
							<span>Downloads:</span>
							<span>5 per month</span>
						</div>
						<div className="flex justify-between">
							<span>AI Optimizations:</span>
							<span>2 per month</span>
						</div>
					</div>
					<Button className="w-full" asChild>
						<a href="/pricing">Upgrade Plan</a>
					</Button>
				</CardContent>
			</Card>
		);
	}

	const planNames: Record<string, string> = {
		professional: "Professional",
		premium: "Premium",
		enterprise: "Enterprise",
	};

	const planName = planNames[subscription.plan_id] || subscription.plan_id;

	return (
		<Card className="dark:bg-gray-950 dark:inset-ring-1 dark:inset-ring-gray-700/70 dark:hover:shadow-md dark:hover:shadow-gray-800/80 transition-shadow duration-300">
			<CardHeader>
				<CardTitle className="text-lg dark:text-gray-100 flex items-center gap-2">
					<Crown className="w-5 h-5 text-yellow-500" />
					{planName} Plan
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="flex items-center justify-between">
					<span className="text-sm font-medium dark:text-gray-200">
						Status:
					</span>
					<Badge
						variant={
							subscription.status === "active"
								? "default"
								: "secondary"
						}
						className="capitalize"
					>
						{subscription.status}
					</Badge>
				</div>

				<div className="flex items-center justify-between">
					<span className="text-sm font-medium dark:text-gray-200">
						Next billing:
					</span>
					<span className="text-sm text-gray-600 dark:text-gray-400">
						{new Date(
							subscription.current_period_end
						).toLocaleDateString()}
					</span>
				</div>

				<div className="space-y-2 text-sm">
					<div className="flex justify-between">
						<span>Resumes:</span>
						<span className="dark:text-gray-400">
							{subscription.plan_id === "enterprise"
								? "Unlimited"
								: "Up to 50"}
						</span>
					</div>
					<div className="flex justify-between">
						<span>Downloads:</span>
						<span className="dark:text-gray-400">
							{subscription.plan_id === "enterprise"
								? "Unlimited"
								: "Up to 200"}
						</span>
					</div>
					<div className="flex justify-between">
						<span>AI Optimizations:</span>
						<span className="dark:text-gray-400">
							{subscription.plan_id === "enterprise"
								? "Unlimited"
								: "Up to 100"}
						</span>
					</div>
				</div>

				<div className="space-y-2">
					<Button
						variant="outline"
						className="w-full bg-transparent dark:text-gray-200"
						size="sm"
					>
						<CreditCard className="w-4 h-4 mr-2" />
						Manage Billing
					</Button>
					<Button
						variant="outline"
						className="w-full bg-transparent dark:text-gray-200"
						size="sm"
						asChild
					>
						<a href="/pricing">Change Plan</a>
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
