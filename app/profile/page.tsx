'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Header } from '@/components/Header';
import { UserSettings } from '@/components/UserSettings';
import { MySubmissions } from '@/components/MySubmissions';
import { FolderManager } from '@/components/FolderManager';
import { Spinner } from '@/components/ui/spinner';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="container mx-auto p-4 sm:p-6 lg:p-8">
          <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-8">
              <Skeleton className="h-72 w-full rounded-lg" />
              <Skeleton className="h-96 w-full rounded-lg" />
            </div>
            <div className="lg:col-span-1">
              <Skeleton className="h-48 w-full rounded-lg" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-8">
            <MySubmissions />
            <FolderManager />
          </div>
          <div className="lg:col-span-1">
            <UserSettings />
          </div>
        </div>
      </main>
    </div>
  );
}
