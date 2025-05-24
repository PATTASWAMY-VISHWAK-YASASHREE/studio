import type { ReactNode } from 'react';
import { Building2 } from 'lucide-react'; // Using a generic icon for app logo

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
}

export default function AuthLayout({ children, title }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="flex items-center mb-8 text-primary">
        <Building2 size={32} className="mr-2" />
        <h1 className="text-3xl font-bold">AuthFlow</h1>
      </div>
      <main className="w-full max-w-md">
        {children}
      </main>
    </div>
  );
}
