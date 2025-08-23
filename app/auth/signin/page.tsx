"use client";

import { SignInForm } from "@/components/auth/signin-form";
import { AuthLayout } from "@/components/auth/auth-layout";
// import { useRouter } from "next/navigation";
// import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
// import { useEffect } from "react";

export default function SignInPage() {
	// const router = useRouter();

	// useEffect(() => {
	// 	const checkSession = async () => {
	// 		const supabase = createClientComponentClient();
	// 		const {
	// 			data: { session },
	// 		} = await supabase.auth.getSession();

	// 		if (session?.user) {
	// 			// Get user profile with role from database
	// 			const { data: userProfile } = await supabase
	// 				.from('user_profiles')
	// 				.select('role')
	// 				.eq('id', session.user.id)
	// 				.single();

	// 			console.log("User profile:", userProfile);

	// 			if (userProfile?.role === "admin") {
	// 				router.replace("/admin");
	// 			} else {
	// 				router.replace(`/dashboard/${session.user.id}?role=${userProfile?.role || 'user'}`);
	// 			}
	// 		}
	// 	};
	// 	checkSession();
	// }, [router]);
	return (
		<AuthLayout
			title="Welcome back"
			subtitle="Sign in to your account to continue building amazing resumes"
			showBackButton={true}
		>
			<SignInForm />
		</AuthLayout>
	);
}
