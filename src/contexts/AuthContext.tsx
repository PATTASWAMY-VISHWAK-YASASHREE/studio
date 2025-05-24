"use client";

import type { ReactNode } from 'react';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, onAuthStateChanged, User } from '@/lib/firebase';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  isMfaRequired: boolean;
  setIsMfaRequired: (isRequired: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMfaRequired, setIsMfaRequired] = useState(false); // Temporary state for MFA flow
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
      
      if (user) {
        const mfaEnabled = localStorage.getItem(`mfaEnabled_${user.uid}`) === 'true';
        if (mfaEnabled && !pathname.startsWith('/auth/mfa') && pathname !== '/account') {
          // If MFA is enabled and user is logged in but not on MFA page or already on account page (after mfa), require MFA
          // This logic may need refinement based on specific redirection needs after login vs session persistence
        }
      }
    });
    return () => unsubscribe();
  }, [pathname]);

  return (
    <AuthContext.Provider value={{ currentUser, loading, isMfaRequired, setIsMfaRequired }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
