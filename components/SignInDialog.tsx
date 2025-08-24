'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';

// A simple, effective GitHub icon component
const GitHubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

// A simple, effective Google icon component
const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.19,4.73C14.76,4.73 16.04,5.77 17.07,6.72L19.21,4.56C17.07,2.7 14.64,1.53 12.19,1.53C6.56,1.53 2.18,6.06 2.18,12C2.18,17.94 6.56,22.47 12.19,22.47C17.6,22.47 21.54,18.33 21.54,12.29C21.54,11.73 21.48,11.41 21.35,11.1Z" />
  </svg>
);

export function SignInDialog({
  children,
}: {
  children: React.ReactNode;
}) {
  const { signIn } = useAuth();
  const [open, setOpen] = useState(false);

  const handleSignIn = async (provider: 'google' | 'github') => {
    try {
      await signIn(provider);
      setOpen(false);
    } catch (error) {
      console.error('Sign-in failed', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-semibold tracking-tight">
            Join Fine Interface
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground pt-1">
            Sign in to submit sites and rate your favorites.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col space-y-3 pt-4">
          <Button
            variant="outline"
            onClick={() => handleSignIn('google')}
            className="w-full"
          >
            <GoogleIcon className="mr-2 h-4 w-4" />
            Sign in with Google
          </Button>
          <Button
            variant="outline"
            onClick={() => handleSignIn('github')}
            className="w-full"
          >
            <GitHubIcon className="mr-2 h-4 w-4" />
            Sign in with GitHub
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
