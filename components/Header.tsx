'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { UploadWebsiteDialog } from './UploadWebsiteDialog';

export const Header = () => {
  const { user, signIn, logout } = useAuth();

  return (
    <header className="w-full flex justify-between items-center p-4 border-b">
      <Link href="/" className="text-xl font-medium">
        Fine Interface
      </Link>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            {user ? (
              <>
                <UploadWebsiteDialog />
                <Button variant="ghost" onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <Button onClick={signIn}>Sign In</Button>
            )}
            <Button variant="ghost" onClick={logout}>
              Logout
            </Button>
          </>
        ) : (
          <Button onClick={signIn}>Sign In</Button>
        )}
      </div>
    </header>
  );
};
