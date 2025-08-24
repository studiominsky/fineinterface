'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button, buttonVariants } from '@/components/ui/button';
import { deleteUser } from 'firebase/auth';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';

export function UserSettings() {
  const { user, logout } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteProfile = async () => {
    if (!user) return;
    setIsDeleting(true);
    try {
      await deleteUser(user);
      toast.success('Your profile has been deleted.');
      await logout();
    } catch (error) {
      console.error('Error deleting profile:', error);
      toast.error(
        'Failed to delete profile. You may need to sign in again to perform this action.'
      );
    } finally {
      setIsDeleting(false);
    }
  };

  if (!user) return null;

  return (
    <div className="p-6 border rounded-lg text-card-foreground sticky top-24">
      <h2 className="text-xl font-semibold mb-4">Settings</h2>
      <div className="space-y-4">
        <div>
          <p className="font-medium">Email</p>
          <p className="text-muted-foreground">{user.email}</p>
        </div>
        <div>
          <p className="font-medium">Name</p>
          <p className="text-muted-foreground">
            {user.displayName || 'Not set'}
          </p>
        </div>
        <div className="flex flex-col space-y-2 pt-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Delete Profile</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you absolutely sure?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently
                  delete your account and remove all your submitted
                  data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  disabled={isDeleting}
                  onClick={handleDeleteProfile}
                  className={buttonVariants({
                    variant: 'destructive',
                  })}
                >
                  {isDeleting && <Spinner className="mr-2 h-4 w-4" />}
                  {isDeleting
                    ? 'Deleting...'
                    : 'Yes, delete my account'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
