'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { UploadWebsiteDialog } from './UploadWebsiteDialog';
import { SignInDialog } from './SignInDialog';
import { ThemeToggle } from './ThemeToggle';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { SidebarContent } from './SidebarContent';
import Logo from './Logo';

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
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-64 p-4 flex flex-col"
          >
            <SheetHeader className="sr-only">
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <div className="flex-grow overflow-y-auto">
              <SidebarContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};
