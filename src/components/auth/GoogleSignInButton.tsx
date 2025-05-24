"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { auth, googleProvider, signInWithPopup } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { GoogleIcon } from '@/components/icons/GoogleIcon';
import { useToast } from '@/hooks/use-toast';

export default function GoogleSignInButton() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { setIsMfaRequired } = useAuth();

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      toast({ title: "Signed in with Google successfully!" });

      const mfaEnabled = localStorage.getItem(`mfaEnabled_${user.uid}`) === 'true';
      if (mfaEnabled) {
        setIsMfaRequired(true);
        router.push('/auth/mfa');
      } else {
        router.push('/account');
      }
    } catch (error: any) {
      console.error("Google sign-in error:", error);
      toast({ title: "Google Sign-In Error", description: error.message, variant: "destructive" });
      setIsLoading(false);
    }
    // setLoading(false) is handled by navigation or error
  };

  return (
    <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isLoading}>
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        <GoogleIcon className="mr-2" />
      )}
      Sign in with Google
    </Button>
  );
}
