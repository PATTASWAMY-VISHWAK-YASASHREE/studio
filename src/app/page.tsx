"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton'; // For loading state

export default function HomePage() {
  const { currentUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (currentUser) {
        // Check if MFA is enabled and required for this session
        const mfaEnabled = localStorage.getItem(`mfaEnabled_${currentUser.uid}`) === 'true';
        const mfaSessionRequired = sessionStorage.getItem('mfaRequired') === 'true'; // Example flag

        if (mfaEnabled && mfaSessionRequired) { // You might need more robust session flag for MFA requirement
          router.replace('/auth/mfa');
        } else {
          router.replace('/account');
        }
      } else {
        router.replace('/auth/signin');
      }
    }
  }, [currentUser, loading, router]);

  // Display a loading state while checking auth status
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="space-y-4 w-full max-w-sm">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-8 w-3/4 mx-auto" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}
