'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { UploadWebsiteDialog } from './UploadWebsiteDialog';
import { SignInDialog } from './SignInDialog';
import Image from 'next/image';
import { ThemeToggle } from './ThemeToggle';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Menu, LogIn } from 'lucide-react';
import { SidebarContent } from './SidebarContent';

export const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 h-20 w-full flex justify-between items-center p-4 border-b bg-background">
      <div className="flex items-center gap-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="lg:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-64 p-4 overflow-y-auto"
          >
            <SheetHeader className="sr-only">
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <SidebarContent />
          </SheetContent>
        </Sheet>

        <Link href="/" className="text-xl font-medium ">
          <Image
            src={'/logo.svg'}
            alt="Logo"
            width={50}
            height={50}
          />
        </Link>
      </div>

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
            <Button className="bg-[#34c477] text-black hover:bg-[#34c477]">
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </Button>
          </SignInDialog>
        )}
        <ThemeToggle />
      </div>
    </header>
  );
};
