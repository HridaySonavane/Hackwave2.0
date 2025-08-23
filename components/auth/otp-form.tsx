/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Mail, ArrowLeft } from "lucide-react";
import { authService } from "@/lib/auth/supabase-client";

interface OTPFormProps {
	email: string;
	onBack: () => void;
	onSuccess: () => void;
}

export function OTPForm({ email, onBack, onSuccess }: OTPFormProps) {
	const [otp, setOtp] = useState("");
	const [isVerifying, setIsVerifying] = useState(false);
	const [isResending, setIsResending] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [resendCooldown, setResendCooldown] = useState(0);

	const handleVerifyOTP = async (e: React.FormEvent) => {
		e.preventDefault();
		if (otp.length !== 6) {
			setError("Please enter a valid 6-digit code");
			return;
		}

		setIsVerifying(true);
		setError("");

		try {
			await authService.verifyOTP(email, otp);
			setSuccess("Email verified successfully!");
			setTimeout(onSuccess, 1500);
		} catch (err: any) {
			setError(err.message || "Invalid verification code");
		} finally {
			setIsVerifying(false);
		}
	};

	const handleResendOTP = async () => {
		if (resendCooldown > 0) return;

		setIsResending(true);
		setError("");

		try {
			await authService.resendOTP(email);
			setSuccess("Verification code sent!");

			// Start cooldown
			setResendCooldown(60);
			const interval = setInterval(() => {
				setResendCooldown((prev) => {
					if (prev <= 1) {
						clearInterval(interval);
						return 0;
					}
					return prev - 1;
				});
			}, 1000);
		} catch (err: any) {
			setError(err.message || "Failed to resend code");
		} finally {
			setIsResending(false);
		}
	};

	return (
		<Card className="w-full max-w-md mx-auto">
			<CardHeader className="text-center">
				<div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
					<Mail className="w-6 h-6 text-blue-600" />
				</div>
				<CardTitle>Check your email</CardTitle>
				<CardDescription>
					We&apos;ve sent a 6-digit verification code to
					<br />
					<strong>{email}</strong>
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<form onSubmit={handleVerifyOTP} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="otp">Verification Code</Label>
						<Input
							id="otp"
							type="text"
							placeholder="Enter 6-digit code"
							value={otp}
							onChange={(e) => {
								const value = e.target.value
									.replace(/\D/g, "")
									.slice(0, 6);
								setOtp(value);
							}}
							className="text-center text-lg tracking-widest"
							maxLength={6}
							autoComplete="one-time-code"
						/>
					</div>

					{error && (
						<Alert variant="destructive">
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}

					{success && (
						<Alert>
							<AlertDescription className="text-green-600">
								{success}
							</AlertDescription>
						</Alert>
					)}

					<Button
						type="submit"
						className="w-full"
						disabled={isVerifying || otp.length !== 6}
					>
						{isVerifying ? (
							<>
								<Loader2 className="w-4 h-4 mr-2 animate-spin" />
								Verifying...
							</>
						) : (
							"Verify Email"
						)}
					</Button>
				</form>

				<div className="text-center space-y-2">
					<p className="text-sm text-gray-600">
						Didn&apos;t receive the code?
					</p>
					<Button
						variant="ghost"
						onClick={handleResendOTP}
						disabled={isResending || resendCooldown > 0}
						className="text-sm"
					>
						{isResending ? (
							<>
								<Loader2 className="w-4 h-4 mr-2 animate-spin" />
								Sending...
							</>
						) : resendCooldown > 0 ? (
							`Resend in ${resendCooldown}s`
						) : (
							"Resend code"
						)}
					</Button>
				</div>

				<Button variant="ghost" onClick={onBack} className="w-full">
					<ArrowLeft className="w-4 h-4 mr-2" />
					Back to sign up
				</Button>
			</CardContent>
		</Card>
	);
}
