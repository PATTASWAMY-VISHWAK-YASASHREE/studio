import AuthLayout from '@/components/shared/AuthLayout';
import MfaVerifyForm from '@/components/auth/MfaVerifyForm';

export default function MfaPage() {
  return (
    <AuthLayout title="Multi-Factor Authentication">
      <MfaVerifyForm />
    </AuthLayout>
  );
}
