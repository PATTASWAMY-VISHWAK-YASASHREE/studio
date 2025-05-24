"use client";

import { useState, useEffect }_ from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ShieldCheck, ShieldOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock MFA setup:
// This component simulates enabling/disabling MFA. In a real app, enabling MFA would involve:
// 1. Calling Firebase to start MFA enrollment (e.g., `currentUser.multiFactor.getSession()`).
// 2. Generating a TOTP secret (`TotpMultiFactorGenerator.generateSecret()`).
// 3. Displaying a QR code for the user to scan with an authenticator app.
// 4. Verifying an initial code from the authenticator app.
// 5. Finalizing enrollment.
// Disabling would require re-authentication and then un-enrolling the factor.

export default function MfaSetupCard() {
  const { currentUser } = useAuth();
  const [isMfaEnabled, setIsMfaEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (currentUser) {
      const mfaStatus = localStorage.getItem(`mfaEnabled_${currentUser.uid}`) === 'true';
      setIsMfaEnabled(mfaStatus);
    }
  }, [currentUser]);

  const handleToggleMfa = async () => {
    if (!currentUser) return;

    setIsLoading(true);
    const newMfaState = !isMfaEnabled;

    // Simulate updating MFA status
    // In a real app, this would trigger Firebase MFA enrollment/disenrollment flows
    try {
      // Mock delay
      await new Promise(resolve => setTimeout(resolve, 500));

      localStorage.setItem(`mfaEnabled_${currentUser.uid}`, String(newMfaState));
      setIsMfaEnabled(newMfaState);
      
      toast({
        title: `MFA ${newMfaState ? 'Enabled' : 'Disabled'}`,
        description: `Multi-Factor Authentication has been ${newMfaState ? 'enabled' : 'disabled'}.`,
      });

      if (newMfaState) {
        // In a real app, you would show a QR code here and ask for verification.
        // For this scaffold, we'll just show a message.
        toast({
          title: "Authenticator App Setup (Mock)",
          description: "In a real app, you would scan a QR code with your authenticator app now.",
          duration: 5000,
        });
      }
    } catch (error: any) {
      toast({ title: "MFA Update Failed", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentUser) {
    return null; // Or a loading/placeholder state
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          {isMfaEnabled ? <ShieldCheck className="mr-2 h-5 w-5 text-green-500" /> : <ShieldOff className="mr-2 h-5 w-5 text-red-500" />}
          Multi-Factor Authentication
        </CardTitle>
        <CardDescription>
          Enhance your account security by enabling MFA via an authenticator app. (Mocked functionality)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between space-x-2 p-2 rounded-md border">
          <Label htmlFor="mfa-toggle" className="flex flex-col space-y-1">
            <span>Authenticator App</span>
            <span className={`text-xs ${isMfaEnabled ? 'text-green-600' : 'text-muted-foreground'}`}>
              {isMfaEnabled ? 'Enabled' : 'Disabled'}
            </span>
          </Label>
          <Switch
            id="mfa-toggle"
            checked={isMfaEnabled}
            onCheckedChange={handleToggleMfa}
            disabled={isLoading}
            aria-label="Toggle Multi-Factor Authentication"
          />
        </div>
        {isMfaEnabled && (
          <div className="p-3 bg-accent/20 text-accent-foreground/80 rounded-md text-sm">
            <p><strong>Mock Setup:</strong> If this were a real setup, you would have scanned a QR code. Future logins will require a code from your authenticator app.</p>
          </div>
        )}
         {!isMfaEnabled && (
          <div className="p-3 bg-secondary text-secondary-foreground rounded-md text-sm">
            <p>Enable MFA to add an extra layer of security to your account.</p>
          </div>
        )}
        <p className="text-xs text-muted-foreground">
            Note: This is a simplified MFA simulation. Full MFA setup involves QR codes and server-side verification.
        </p>
      </CardContent>
    </Card>
  );
}
