'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { UploadWebsiteDialog } from './UploadWebsiteDialog';
import { SignInDialog } from './SignInDialog';
import Image from 'next/image';
import { ThemeToggle } from './ThemeToggle';
import { LogIn } from 'lucide-react';

export const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="w-full flex justify-between items-center p-4 border-b">
      <Link href="/" className="text-xl font-medium ">
        <Image src={'/logo.svg'} alt="Logo" width={50} height={50} />
      </Link>

      <div className="flex items-center gap-4">
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
            <Button className="bg-[#a4ca0a] text-black hover:bg-[#8bb108]">
              <LogIn className="mr-2 h-4 w-4" /> Sign In
            </Button>
          </SignInDialog>
        )}
        <ThemeToggle />
      </div>
    </header>
  );
};
