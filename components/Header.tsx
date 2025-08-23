'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { UploadWebsiteDialog } from './UploadWebsiteDialog';
import { SignInDialog } from './SignInDialog'; // Import the new dialog

export const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="w-full flex justify-between items-center p-4 border-b">
      <Link href="/" className="text-xl font-medium">
        Fine Interface
      </Link>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <UploadWebsiteDialog />
            <Button variant="ghost" onClick={logout}>
              Logout
            </Button>
          </>
        ) : (
          <SignInDialog>
            <Button>Sign In</Button>
          </SignInDialog>
        )}
      </div>
    </header>
  );
};
