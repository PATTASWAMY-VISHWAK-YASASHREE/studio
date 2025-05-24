"use client"; // Required for hooks like useAuth, useRouter

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import AppHeader from '@/components/shared/AppHeader';
import MfaSetupCard from '@/components/auth/MfaSetupCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { UserCircle } from 'lucide-react';

export default function AccountPage() {
  const { currentUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !currentUser) {
      router.replace('/auth/signin');
    }
  }, [currentUser, loading, router]);

  if (loading || !currentUser) {
    return (
      <div className="min-h-screen flex flex-col">
        <AppHeader />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto space-y-6">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppHeader />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          <header>
            <h1 className="text-3xl font-bold text-foreground">Account Settings</h1>
            <p className="text-muted-foreground">Manage your account details and security settings.</p>
          </header>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <UserCircle className="mr-2 h-5 w-5 text-primary" />
                Profile Information
              </CardTitle>
              <CardDescription>Your basic account information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <span className="font-medium text-foreground">Email:</span>
                <span className="ml-2 text-muted-foreground">{currentUser.email}</span>
              </div>
              {currentUser.displayName && (
                 <div>
                    <span className="font-medium text-foreground">Name:</span>
                    <span className="ml-2 text-muted-foreground">{currentUser.displayName}</span>
                </div>
              )}
              {/* Email change functionality is complex and often requires verification, out of scope for scaffold */}
              <p className="text-xs text-muted-foreground">
                To change your email or password, please refer to Firebase documentation for secure practices.
              </p>
            </CardContent>
          </Card>

          <MfaSetupCard />
        </div>
      </main>
      <footer className="py-4 text-center text-sm text-muted-foreground">
        AuthFlow &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}
