import AuthLayout from '@/components/shared/AuthLayout';
import SignUpForm from '@/components/auth/SignUpForm';

export default function SignUpPage() {
  return (
    <AuthLayout title="Sign Up">
      <SignUpForm />
    </AuthLayout>
  );
}
