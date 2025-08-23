/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { authService } from "@/lib/supabase/auth";
import Link from "next/link";

export function ForgotPasswordForm() {
	const [email, setEmail] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const [emailSent, setEmailSent] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError("");

		try {
			await authService.resetPassword(email);
			setEmailSent(true);
		} catch (err: any) {
			setError(err.message || "Failed to send reset email");
		} finally {
			setIsLoading(false);
		}
	};

	if (emailSent) {
		return (
			<Card className="border-0 shadow-lg">
				<CardContent className="p-8 text-center">
					<div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
						<CheckCircle className="w-8 h-8 text-green-600" />
					</div>
					<h3 className="text-xl font-semibold text-gray-900 mb-2">
						Check your email
					</h3>
					<p className="text-gray-600 mb-6">
						We&apos;ve sent a password reset link to{" "}
						<strong>{email}</strong>
					</p>
					<div className="space-y-3">
						<Button
							variant="outline"
							onClick={() => setEmailSent(false)}
							className="w-full bg-transparent"
						>
							Send another email
						</Button>
						<Link href="/auth/signin">
							<Button variant="ghost" className="w-full">
								<ArrowLeft className="w-4 h-4 mr-2" />
								Back to sign in
							</Button>
						</Link>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="border-0 shadow-lg">
			<CardContent className="p-8">
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="email">Email address</Label>
						<div className="relative">
							<Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
							<Input
								id="email"
								type="email"
								placeholder="Enter your email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="pl-10"
								required
							/>
						</div>
					</div>

					{error && (
						<Alert variant="destructive">
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}

					<Button
						type="submit"
						className="w-full"
						disabled={isLoading}
					>
						{isLoading ? (
							<>
								<Loader2 className="w-4 h-4 mr-2 animate-spin" />
								Sending reset link...
							</>
						) : (
							"Send reset link"
						)}
					</Button>

					<div className="text-center">
						<Link
							href="/auth/signin"
							className="text-sm text-blue-600 hover:underline"
						>
							<ArrowLeft className="w-4 h-4 mr-1 inline" />
							Back to sign in
						</Link>
					</div>
				</form>
			</CardContent>
		</Card>
	);
}
