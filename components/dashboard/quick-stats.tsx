"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Download, Sparkles, TrendingUp } from "lucide-react";

interface QuickStatsProps {
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

export function QuickStats({ usage, subscription }: QuickStatsProps) {
	const stats = [
		{
			title: "Resumes Created",
			value: usage?.resumes_created || 0,
			icon: FileText,
			color: "text-blue-600",
			darkColor: "text-blue-500",
			bgColor: "bg-blue-100",
		},
		{
			title: "Downloads Used",
			value: usage?.downloads_used || 0,
			icon: Download,
			color: "text-green-600",
			darkColor: "text-green-500",
			bgColor: "bg-green-100",
		},
		{
			title: "AI Optimizations",
			value: usage?.ai_optimizations_used || 0,
			icon: Sparkles,
			color: "text-purple-600",
			darkColor: "text-purple-500",
			bgColor: "bg-purple-100",
		},
		{
			title: "Plan Status",
			value: subscription?.status === "active" ? "Active" : "Free",
			icon: TrendingUp,
			color:
				subscription?.status === "active"
					? "text-green-600"
					: "text-gray-600",
			darkColor:
				subscription?.status === "active"
					? "text-green-500"
					: "text-gray-500",
			bgColor:
				subscription?.status === "active"
					? "bg-green-100"
					: "bg-gray-100",
		},
	];

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
			{stats.map((stat, index) => (
				<Card
					key={index}
					className="border-0 shadow-sm dark:bg-gray-950 dark:backdrop-blur-md dark:inset-ring-1 dark:inset-ring-gray-700/70 dark:rounded-lg dark:hover:shadow-md dark:hover:shadow-gray-800/80 transition-shadow duration-300"
				>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400/80">
							{stat.title}
						</CardTitle>
						<div className={`p-2 rounded-full ${stat.bgColor}`}>
							<stat.icon className={`h-4 w-4 ${stat.color}`} />
						</div>
					</CardHeader>
					<CardContent>
						<div
							className={`text-2xl font-bold ${stat.color} dark:${stat.darkColor}`}
						>
							{stat.value}
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	);
}
