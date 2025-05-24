import AuthLayout from '@/components/shared/AuthLayout';
import SignInForm from '@/components/auth/SignInForm';

export default function SignInPage() {
  return (
    <AuthLayout title="Sign In">
      <SignInForm />
    </AuthLayout>
  );
}
