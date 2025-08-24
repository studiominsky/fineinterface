'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { UploadWebsiteDialog } from './UploadWebsiteDialog';
import { SignInDialog } from './SignInDialog';
import Image from 'next/image';
import { ThemeToggle } from './ThemeToggle';

export const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="w-full flex justify-between items-center p-4 border-b">
      <Link href="/" className="text-xl font-medium ">
        <Image src={'/logo.svg'} alt="Logo" width={50} height={50} />
      </Link>

      <div className="flex items-center gap-2">
        {user ? (
          <>
            <UploadWebsiteDialog />
            <Link href="/profile">
              <Button variant="ghost">Profile</Button>
            </Link>
            <Button variant="ghost" onClick={logout}>
              Logout
            </Button>
          </>
        ) : (
          <SignInDialog>
            <Button>Sign In</Button>
          </SignInDialog>
        )}
        <ThemeToggle />
      </div>
    </header>
  );
};
