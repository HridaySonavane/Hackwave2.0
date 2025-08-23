"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Edit, Trash2, Plus } from "lucide-react";

interface Resume {
	id: string;
	title: string;
	template: string;
	status: "draft" | "completed";
	updated_at: string;
	downloads: number;
}

interface RecentResumesProps {
	userId?: string;
}

export function RecentResumes({ userId }: RecentResumesProps) {
	const [resumes, setResumes] = useState<Resume[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Mock data for now - replace with actual API call
		const mockResumes: Resume[] = [
			// {
			// 	id: "1",
			// 	title: "Software Engineer Resume",
			// 	template: "Modern",
			// 	status: "completed",
			// 	updated_at: "2024-01-15",
			// 	downloads: 3,
			// },
			// {
			// 	id: "2",
			// 	title: "Marketing Manager Resume",
			// 	template: "Professional",
			// 	status: "draft",
			// 	updated_at: "2024-01-14",
			// 	downloads: 0,
			// },
			// {
			// 	id: "3",
			// 	title: "Data Analyst Resume",
			// 	template: "Clean",
			// 	status: "completed",
			// 	updated_at: "2024-01-13",
			// 	downloads: 1,
			// },
		];

		setTimeout(() => {
			setResumes(mockResumes);
			setLoading(false);
		}, 1000);
	}, [userId]);

	if (loading) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Recent Resumes</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{[1, 2, 3].map((i) => (
							<div key={i} className="animate-pulse">
								<div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
								<div className="h-3 bg-gray-200 rounded w-1/2"></div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="dark:bg-gray-950 dark:inset-ring-1 dark:inset-ring-gray-700/70 dark:hover:shadow-md dark:hover:shadow-gray-800/80 transition-shadow duration-300">
			<CardHeader className="flex flex-row items-center justify-between">
				<CardTitle className="dark:text-gray-200">
					Recent Resumes
				</CardTitle>
				<Button className="dark:bg-gray-200" size="sm" asChild>
					<a href={`/create-resume/${userId}`}>
						<Plus className="w-4 h-4 mr-2" />
						New Resume
					</a>
				</Button>
			</CardHeader>
			<CardContent>
				{resumes.length === 0 ? (
					<div className="text-center py-8">
						<FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
						<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-300 mb-1">
							No resumes yet
						</h3>
						<p className="text-gray-600 dark:text-gray-500 mb-4">
							Create your first resume to get started.
						</p>
						<Button asChild>
							<a href={`/create-resume/${userId}`}>
								Create Resume
							</a>
						</Button>
					</div>
				) : (
					<div className="space-y-4">
						{resumes.map((resume) => (
							<div
								key={resume.id}
								className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
							>
								<div className="flex items-center space-x-4">
									<div className="p-2 bg-blue-100 rounded-lg">
										<FileText className="w-5 h-5 text-blue-600" />
									</div>
									<div>
										<h4 className="font-medium text-gray-900">
											{resume.title}
										</h4>
										<div className="flex items-center space-x-2 text-sm text-gray-500">
											<span>
												{resume.template} template
											</span>
											<span>•</span>
											<span>
												Updated{" "}
												{new Date(
													resume.updated_at
												).toLocaleDateString()}
											</span>
											<span>•</span>
											<span>
												{resume.downloads} downloads
											</span>
										</div>
									</div>
								</div>
								<div className="flex items-center space-x-2">
									<Badge
										variant={
											resume.status === "completed"
												? "default"
												: "secondary"
										}
									>
										{resume.status}
									</Badge>
									<Button variant="ghost" size="sm">
										<Edit className="w-4 h-4" />
									</Button>
									<Button variant="ghost" size="sm">
										<Download className="w-4 h-4" />
									</Button>
									<Button variant="ghost" size="sm">
										<Trash2 className="w-4 h-4" />
									</Button>
								</div>
							</div>
						))}
					</div>
				)}
			</CardContent>
		</Card>
	);
}
