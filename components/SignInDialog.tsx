'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';

export function SignInDialog({
  children,
}: {
  children: React.ReactNode;
}) {
  const { signIn } = useAuth();
  const [open, setOpen] = useState(false);

  const handleSignIn = async (provider: 'google' | 'github') => {
    await signIn(provider);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">Sign In</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col space-y-4 pt-4">
          <Button
            variant="outline"
            onClick={() => handleSignIn('google')}
            className="w-full"
          >
            Sign in with Google
          </Button>
          <Button
            variant="outline"
            onClick={() => handleSignIn('github')}
            className="w-full"
          >
            Sign in with GitHub
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
