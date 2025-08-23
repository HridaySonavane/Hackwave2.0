import { ResetPasswordForm } from "@/components/auth/reset-password-form"
import { AuthLayout } from "@/components/auth/auth-layout"

export default function ResetPasswordPage() {
  return (
    <AuthLayout title="Set new password" subtitle="Enter your new password below" showBackButton={false}>
      <ResetPasswordForm />
    </AuthLayout>
  )
}
