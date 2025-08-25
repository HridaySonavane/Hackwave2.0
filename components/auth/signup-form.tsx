/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Eye, EyeOff, Github, CheckCircle } from "lucide-react";
import { authService } from "@/lib/supabase/auth";
import { supabase } from "@/lib/supabase/auth";
import { OTPForm } from "./otp-form";
import Link from "next/link";

export function SignUpForm() {
  const [step, setStep] = useState<"signup" | "otp" | "success">("signup");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
    subscribeNewsletter: true,
    role: "user" as "user" | "admin" | "moderator" | "premium_user",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState({
    email: false,
    google: false,
    github: false,
  });
  const [error, setError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);

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

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      setError("Full name is required");
      return false;
    }
    if (!formData.email.trim()) {
      setError("Email is required");
      return false;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    if (!formData.agreeToTerms) {
      setError("You must agree to the Terms of Service and Privacy Policy");
      return false;
    }
    return true;
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading((prev) => ({ ...prev, email: true }));
    setError("");
    try {
      // Check if there's an existing session and clear it if user doesn't exist
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        try {
          // Check if the user exists in the database
          const { data: user, error } = await supabase
            .from("user_profiles") // Replace with your actual users table name
            .select("id")
            .eq("id", session.user.id)
            .single();
          // If user doesn't exist in database, clear the session
          if (error || !user) {
            await supabase.auth.signOut();
            console.log("Cleared invalid session for deleted user");
          }
        } catch (error) {
          // If there's an error checking the user, clear the session
          await supabase.auth.signOut();
          console.log("Cleared session due to error checking user");
        }
      }
      // Proceed with signup
      const { user } = await authService.signUp(
        formData.email,
        formData.password,
        {
          full_name: formData.fullName,
          subscribe_newsletter: formData.subscribeNewsletter,
          role: formData.role,
        }
      );
      // Insert user profile row after successful sign up
      if (user) {
        const { data: existingProfile } = await supabase
          .from("user_profiles")
          .select("id")
          .eq("id", user.id)
          .single();
        if (!existingProfile) {
          await supabase.from("user_profiles").insert({
            id: user.id,
            email: formData.email,
            full_name: formData.fullName,
            role: formData.role,
          });
        }
      }
      setStep("otp");
    } catch (err: any) {
      setError(err.message || "Failed to create account");
    } finally {
      setIsLoading((prev) => ({ ...prev, email: false }));
    }
  };

  const handleSocialSignUp = async (provider: "google" | "github") => {
    setIsLoading((prev) => ({ ...prev, [provider]: true }));
    setError("");
    try {
      // Implement social sign-up
      console.log(`Sign up with ${provider}`);
    } catch (err: any) {
      setError(err.message || `Failed to sign up with ${provider}`);
    } finally {
      setIsLoading((prev) => ({ ...prev, [provider]: false }));
    }
  };

  const handleOTPSuccess = () => {
    setStep("success");
  };

  const handleBackToSignup = () => {
    setStep("signup");
  };

  if (step === "otp") {
    return (
      <OTPForm
        email={formData.email}
        onBack={handleBackToSignup}
        onSuccess={handleOTPSuccess}
      />
    );
  }

  if (step === "success") {
    return (
      <div className="w-full max-w-md">
        <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl dark:bg-gray-800/80 dark:border-gray-700">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 dark:bg-green-900/30">
              <CheckCircle className="w-8 h-8 text-green-400 dark:text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2 dark:text-white">
              Welcome to PureVibe!
            </h3>
            <p className="text-white/80 mb-8 dark:text-gray-300">
              Your account has been created successfully. You can now start
              refining your product requirements with AI-powered multi-agent
              assistance.
            </p>
            <Button
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-full font-medium dark:from-blue-600 dark:to-cyan-600"
              onClick={() => (window.location.href = "/dashboard")}
            >
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 2) return "bg-red-500 dark:bg-red-500";
    if (passwordStrength <= 3) return "bg-yellow-500 dark:bg-yellow-500";
    return "bg-green-500 dark:bg-green-500";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 2) return "Weak";
    if (passwordStrength <= 3) return "Medium";
    return "Strong";
  };

  const getPasswordStrengthTextColor = () => {
    if (passwordStrength <= 2) return "text-red-400 dark:text-red-400";
    if (passwordStrength <= 3) return "text-yellow-400 dark:text-yellow-400";
    return "text-green-400 dark:text-green-400";
  };

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Social Sign Up */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          onClick={() => handleSocialSignUp("google")}
          disabled={Object.values(isLoading).some(Boolean)}
          className="bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20 transition-all rounded-xl dark:bg-gray-800/50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          {isLoading.google ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </>
          )}
        </Button>
        <Button
          variant="outline"
          onClick={() => handleSocialSignUp("github")}
          disabled={Object.values(isLoading).some(Boolean)}
          className="bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20 transition-all rounded-xl dark:bg-gray-800/50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          {isLoading.github ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Github className="w-4 h-4 mr-2" />
              GitHub
            </>
          )}
        </Button>
      </div>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full border-white/20 dark:border-gray-700" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-transparent px-2 text-black/80 dark:text-gray-400">
            Or create account with email
          </span>
        </div>
      </div>
      {/* Email Sign Up Form */}
      <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl dark:bg-gray-800/80 dark:border-gray-700">
        <CardContent className="p-8">
          <form onSubmit={handleEmailSignUp} className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="fullName"
                className="text-black/60 dark:text-gray-300"
              >
                Full name
              </Label>
              <div className="relative">
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      fullName: e.target.value,
                    }))
                  }
                  className="pl-10 bg-blue-50 border-white/20 text-black/80 placeholder:text-black/60 rounded-xl dark:bg-gray-700/50 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-black/60 dark:text-gray-300"
              >
                Email address
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  className="pl-10 bg-blue-50 border-white/20 text-black/80 placeholder:text-black/60 rounded-xl dark:bg-gray-700/50 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-black/60 dark:text-gray-300"
              >
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  className="pl-10 pr-10 bg-blue-50 border-white/20 text-black/80 placeholder:text-black/60 rounded-xl dark:bg-gray-700/50 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400"
                  required
                  minLength={8}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-white/60 hover:text-white dark:text-gray-400 dark:hover:text-gray-200"
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
                    <span className="text-white/80 dark:text-gray-300">
                      Password strength:
                    </span>
                    <span
                      className={`font-medium ${getPasswordStrengthTextColor()}`}
                    >
                      {getPasswordStrengthText()}
                    </span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-1 dark:bg-gray-700">
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
              <Label
                htmlFor="confirmPassword"
                className="text-black/60 dark:text-gray-300"
              >
                Confirm password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      confirmPassword: e.target.value,
                    }))
                  }
                  className="pl-10 pr-10 bg-blue-50 border-white/20 text-black/80 placeholder:text-black/60 rounded-xl dark:bg-gray-700/50 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-white/60 hover:text-white dark:text-gray-400 dark:hover:text-gray-200"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      agreeToTerms: !!checked,
                    }))
                  }
                  className="border-black/30 data-[state=checked]:bg-blue-500 dark:border-gray-600 dark:data-[state=checked]:bg-blue-600"
                />
                <Label
                  htmlFor="agreeToTerms"
                  className="text-sm text-black/80 dark:text-gray-300"
                >
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    className="text-blue-600 hover:text-blue-800 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-blue-600 hover:text-blue-800 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Privacy Policy
                  </Link>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="subscribeNewsletter"
                  checked={formData.subscribeNewsletter}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      subscribeNewsletter: !!checked,
                    }))
                  }
                  className="border-black/30 data-[state=checked]:bg-blue-500 dark:border-gray-600 dark:data-[state=checked]:bg-blue-600"
                />
                <Label
                  htmlFor="subscribeNewsletter"
                  className="text-sm text-black/80 dark:text-gray-300"
                >
                  Send me tips and updates about AI-powered requirements
                  refinement
                </Label>
              </div>
            </div>
            {error && (
              <Alert
                variant="destructive"
                className="bg-red-500/20 border-red-500/30 text-white dark:bg-red-900/30 dark:border-red-800"
              >
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-full font-medium dark:from-blue-600 dark:to-cyan-600"
              disabled={isLoading.email}
            >
              {isLoading.email ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
      {/* Sign In Link */}
      <div className="text-center mb-8">
        <span className="text-black/80 dark:text-gray-300">
          Already have an account?{" "}
        </span>
        <Link
          href="/auth/signin"
          className="text-blue-600 hover:text-blue-800 hover:underline font-medium dark:text-blue-400 dark:hover:text-blue-300"
        >
          Sign in
        </Link>
      </div>
    </div>
  );
}
