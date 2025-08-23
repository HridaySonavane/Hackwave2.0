import { SignUpForm } from "@/components/auth/signup-form"
import { AuthLayout } from "@/components/auth/auth-layout"

export default function SignUpPage() {
  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start building professional resumes with AI assistance"
      showBackButton={true}
    >
      <SignUpForm />
    </AuthLayout>
  )
}
