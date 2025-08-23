/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Eye, EyeOff, Lock, CheckCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
// import { useSearchParams } from "next/navigation"

export function ResetPasswordForm() {
	const [formData, setFormData] = useState({
		password: "",
		confirmPassword: "",
	});
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);
	const [passwordStrength, setPasswordStrength] = useState(0);

	// const searchParams = useSearchParams()
	const supabase = createClient();

	useEffect(() => {
		// Handle the password reset token from URL
		const handlePasswordReset = async () => {
			const { data, error } = await supabase.auth.getSession();
			if (error) {
				setError("Invalid or expired reset link");
			}
		};

		handlePasswordReset();
	}, [supabase.auth]);

	const calculatePasswordStrength = (password: string) => {
		let strength = 0;
		if (password.length >= 8) strength++;
		if (/[A-Z]/.test(password)) strength++;
		if (/[a-z]/.test(password)) strength++;
		if (/[0-9]/.test(password)) strength++;
		if (/[^A-Za-z0-9]/.test(password)) strength++;
		return strength;
	};

	const handlePasswordChange = (password: string) => {
		setFormData((prev) => ({ ...prev, password }));
		setPasswordStrength(calculatePasswordStrength(password));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (formData.password.length < 8) {
			setError("Password must be at least 8 characters long");
			return;
		}

		if (formData.password !== formData.confirmPassword) {
			setError("Passwords do not match");
			return;
		}

		setIsLoading(true);
		setError("");

		try {
			const { error } = await supabase.auth.updateUser({
				password: formData.password,
			});

			if (error) throw error;

			setSuccess(true);
			setTimeout(() => {
				window.location.href = "/auth/signin";
			}, 2000);
		} catch (err: any) {
			setError(err.message || "Failed to reset password");
		} finally {
			setIsLoading(false);
		}
	};

	const getPasswordStrengthColor = () => {
		if (passwordStrength <= 2) return "bg-red-500";
		if (passwordStrength <= 3) return "bg-yellow-500";
		return "bg-green-500";
	};

	const getPasswordStrengthText = () => {
		if (passwordStrength <= 2) return "Weak";
		if (passwordStrength <= 3) return "Medium";
		return "Strong";
	};

	if (success) {
		return (
			<Card className="border-0 shadow-lg">
				<CardContent className="p-8 text-center">
					<div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
						<CheckCircle className="w-8 h-8 text-green-600" />
					</div>
					<h3 className="text-xl font-semibold text-gray-900 mb-2">
						Password updated!
					</h3>
					<p className="text-gray-600 mb-6">
						Your password has been successfully updated. You&apos;ll
						be redirected to sign in shortly.
					</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="border-0 shadow-lg">
			<CardContent className="p-8">
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="password">New password</Label>
						<div className="relative">
							<Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
							<Input
								id="password"
								type={showPassword ? "text" : "password"}
								placeholder="Enter your new password"
								value={formData.password}
								onChange={(e) =>
									handlePasswordChange(e.target.value)
								}
								className="pl-10 pr-10"
								required
								minLength={8}
							/>
							<Button
								type="button"
								variant="ghost"
								size="sm"
								className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
								onClick={() => setShowPassword(!showPassword)}
							>
								{showPassword ? (
									<EyeOff className="h-4 w-4" />
								) : (
									<Eye className="h-4 w-4" />
								)}
							</Button>
						</div>
						{formData.password && (
							<div className="space-y-2">
								<div className="flex items-center justify-between text-xs">
									<span className="text-gray-500">
										Password strength:
									</span>
									<span
										className={`font-medium ${passwordStrength <= 2 ? "text-red-500" : passwordStrength <= 3 ? "text-yellow-500" : "text-green-500"}`}
									>
										{getPasswordStrengthText()}
									</span>
								</div>
								<div className="w-full bg-gray-200 rounded-full h-1">
									<div
										className={`h-1 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
										style={{
											width: `${(passwordStrength / 5) * 100}%`,
										}}
									></div>
								</div>
							</div>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor="confirmPassword">
							Confirm new password
						</Label>
						<div className="relative">
							<Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
							<Input
								id="confirmPassword"
								type={showConfirmPassword ? "text" : "password"}
								placeholder="Confirm your new password"
								value={formData.confirmPassword}
								onChange={(e) =>
									setFormData((prev) => ({
										...prev,
										confirmPassword: e.target.value,
									}))
								}
								className="pl-10 pr-10"
								required
							/>
							<Button
								type="button"
								variant="ghost"
								size="sm"
								className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
								onClick={() =>
									setShowConfirmPassword(!showConfirmPassword)
								}
							>
								{showConfirmPassword ? (
									<EyeOff className="h-4 w-4" />
								) : (
									<Eye className="h-4 w-4" />
								)}
							</Button>
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
								Updating password...
							</>
						) : (
							"Update password"
						)}
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}
