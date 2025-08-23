'use client';

import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
  deleteUser,
} from 'firebase/auth';

export function UserSettings() {
  const { user, logout } = useAuth();

  const handleChangePassword = async () => {
    if (!user?.email) {
      alert('Cannot change password for accounts without an email.');
      return;
    }

    const oldPassword = prompt(
      'Please enter your current password to continue:'
    );
    if (!oldPassword) return;

    const credential = EmailAuthProvider.credential(
      user.email,
      oldPassword
    );

    try {
      await reauthenticateWithCredential(user, credential);
      const newPassword = prompt('Please enter your new password:');
      if (newPassword) {
        await updatePassword(user, newPassword);
        alert('Password updated successfully!');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      alert(
        'Failed to change password. Please check your current password and try again.'
      );
    }
  };

  const handleDeleteProfile = async () => {
    if (
      window.confirm(
        'Are you absolutely sure? This will permanently delete your account and all your data.'
      )
    ) {
      if (!user) return;
      try {
        await deleteUser(user);
        alert('Your profile has been deleted.');
        await logout();
      } catch (error) {
        console.error('Error deleting profile:', error);
        alert(
          'Failed to delete profile. You may need to sign in again to perform this action.'
        );
      }
    }
  };

  if (!user) return null;

  return (
    <div className="p-6 border rounded-lg bg-card text-card-foreground shadow-sm sticky top-24">
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
          <Button
            onClick={handleChangePassword}
            variant="outline"
            disabled={!user.email}
          >
            Change Password
          </Button>
          <Button onClick={handleDeleteProfile} variant="destructive">
            Delete Profile
          </Button>
        </div>
      </div>
    </div>
  );
}
