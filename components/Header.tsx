'use client';

import Link from 'next/link';
import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { UploadWebsiteDialog } from './UploadWebsiteDialog';
import { SignInDialog } from './SignInDialog';
import { ThemeToggle } from './ThemeToggle';
import { MobileMenu } from './MobileMenu';
import Logo from './Logo';

export const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="fixed top-0 h-20 w-full flex justify-between items-center p-4 border-b bg-background z-50">
      <Logo />

      <div className="hidden lg:flex items-center gap-2">
        {user ? (
          <>
            <UploadWebsiteDialog>
              <Button variant="ghost">Add Website</Button>
            </UploadWebsiteDialog>
            <Link href="/profile">
              <Button variant="ghost">Profile</Button>
            </Link>
            <Button variant="ghost" onClick={logout}>
              Logout
            </Button>
          </>
        ) : (
          <SignInDialog>
            <Button variant="ghost" className="font-medium">
              Sign In
            </Button>
          </SignInDialog>
        )}
        <ThemeToggle />
      </div>

      <div className="lg:hidden">
        <Suspense fallback={<Button variant="ghost" size="icon" className="h-12 w-12" disabled />}>
          <MobileMenu />
        </Suspense>
      </div>
    </header>
  );
};