"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { auth, signOut } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { LogOut, User, Building2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AppHeader() {
  const { currentUser } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast({ title: "Signed out successfully." });
      localStorage.removeItem(`mfaEnabled_${currentUser?.uid}`); // Clean up MFA flag on logout
      router.push('/auth/signin');
    } catch (error: any) {
      console.error("Sign out error:", error);
      toast({ title: "Sign Out Error", description: error.message, variant: "destructive" });
    }
  };

  const getInitials = (email?: string | null) => {
    if (!email) return 'U';
    return email.substring(0, 2).toUpperCase();
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/account" className="flex items-center gap-2 text-primary">
          <Building2 size={28} />
          <span className="text-xl font-bold">AuthFlow</span>
        </Link>
        
        {currentUser ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={currentUser.photoURL || undefined} alt={currentUser.displayName || currentUser.email || "User"} />
                  <AvatarFallback>{getInitials(currentUser.email)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {currentUser.displayName || currentUser.email?.split('@')[0]}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {currentUser.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/account')}>
                <User className="mr-2 h-4 w-4" />
                <span>Account</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive-foreground focus:bg-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
           <Button onClick={() => router.push('/auth/signin')}>Sign In</Button>
        )}
      </div>
    </header>
  );
}
