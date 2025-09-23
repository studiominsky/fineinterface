'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { UploadWebsiteDialog } from './UploadWebsiteDialog';
import { SignInDialog } from './SignInDialog';
import { ThemeToggle } from './ThemeToggle';
import Logo from './Logo';
import { MobileMenu } from './MobileMenu';

export const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 h-20 w-full flex justify-between items-center p-4 border-b bg-background">
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
        <MobileMenu />
      </div>
    </header>
  );
};