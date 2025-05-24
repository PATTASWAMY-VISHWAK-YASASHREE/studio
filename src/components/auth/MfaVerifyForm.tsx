"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';

// Mock MFA verification:
// In a real app, this would involve calling Firebase `PhoneAuthProvider.verifyPhoneNumber` or
// `TotpMultiFactorGenerator.factorId` related verification flows.
// For this scaffold, we'll simulate with a hardcoded code or simple logic.

export default function MfaVerifyForm() {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { currentUser, loading: authLoading, isMfaRequired, setIsMfaRequired } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !currentUser) {
      // If not logged in (primary auth failed or session ended), redirect to signin
      router.replace('/auth/signin');
    }
    // if (!authLoading && currentUser && !isMfaRequired) {
    //   // If user is logged in but MFA is not marked as required for this session, go to account
    //   // This can happen if user navigates directly to /auth/mfa
    //   router.replace('/account');
    // }
  }, [currentUser, authLoading, router, isMfaRequired]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate MFA verification
    // A real implementation would verify the code against the user's enrolled MFA method
    if (code === "123456") { // Example: Mock verification code
      toast({ title: "MFA Verified!", description: "You are now securely signed in." });
      setIsMfaRequired(false); // Clear MFA requirement for this session
      router.push('/account');
    } else {
      toast({ title: "MFA Verification Failed", description: "Invalid code. Please try again.", variant: "destructive" });
      setIsLoading(false);
    }
  };
  
  if (authLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center"><ShieldCheck className="mr-2 h-6 w-6 text-primary" />Authenticator Verification</CardTitle>
          <CardDescription>Loading...</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="h-10 bg-muted rounded-md animate-pulse"></div>
        </CardContent>
         <CardFooter>
            <Button className="w-full" disabled>Loading...</Button>
        </CardFooter>
      </Card>
    )
  }


  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl flex items-center"><ShieldCheck className="mr-2 h-6 w-6 text-primary" />Authenticator Verification</CardTitle>
        <CardDescription>Enter the code from your authenticator app.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="mfa-code" className="sr-only">Verification Code</Label>
            <Input
              id="mfa-code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter 6-digit code"
              maxLength={6}
              required
              className="text-center text-lg tracking-widest"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading || code.length < 6}>
            {isLoading ? 'Verifying...' : 'Verify Code'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
