'use client';

export const runtime = 'edge';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  getUnapprovedWebsites,
  approveWebsite,
  deleteWebsite,
  WebsiteData,
} from '@/services/website';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';

export default function AdminPage() {
  const { user } = useAuth();
  const [websites, setWebsites] = useState<WebsiteData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user) {
        try {
          const idTokenResult = await user.getIdTokenResult(true);
          if (idTokenResult.claims.admin) {
            setIsAdmin(true);
            fetchWebsites();
          } else {
            setIsAdmin(false);
            setLoading(false);
          }
        } catch (err) {
          console.error('Error checking admin status:', err);
          setError('Could not verify admin status.');
          setLoading(false);
        }
      } else if (user === null) {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [user]);

  const fetchWebsites = async () => {
    setLoading(true);
    try {
      const unapproved = await getUnapprovedWebsites();
      setWebsites(unapproved);
    } catch (err) {
      console.error('Error fetching websites:', err);
      setError('Failed to fetch websites for approval.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await approveWebsite(id);
      setWebsites((prev) =>
        prev.filter((website) => website.id !== id)
      );
    } catch (err) {
      console.error('Error approving website:', err);
      alert('Failed to approve the website.');
    }
  };

  const handleReject = async (id: string) => {
    if (
      window.confirm(
        'Are you sure you want to reject and delete this submission?'
      )
    ) {
      try {
        await deleteWebsite(id);
        setWebsites((prev) =>
          prev.filter((website) => website.id !== id)
        );
      } catch (err) {
        console.error('Error rejecting website:', err);
        alert('Failed to reject the website.');
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center p-10">Loading admin panel...</div>
    );
  }

  if (!user) {
    return (
      <div className="text-center p-10">
        Please log in to view this page.
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="text-center p-10 text-red-500">
        Access Denied: You do not have permission to view this page.
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-10 text-red-500">{error}</div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Approval</h1>
        <Button onClick={fetchWebsites} variant="outline">
          Refresh
        </Button>
      </div>

      {websites.length === 0 ? (
        <div className="text-center p-10 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground">
            No websites are currently waiting for approval.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {websites.map((website) => (
            <div
              key={website.id}
              className="border text-card-foreground p-4 rounded-lg shadow-sm transition-all"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                <div>
                  <h2 className="text-xl font-semibold">
                    {website.title}
                  </h2>
                  <Link
                    href={website.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline break-all"
                  >
                    {website.url}
                  </Link>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {website.categories.map((category) => (
                      <Badge
                        key={category}
                        variant="secondary"
                        className="capitalize"
                      >
                        {category}
                      </Badge>
                    ))}
                  </div>
                  <p className="mt-2 text-base">
                    {website.description}
                  </p>
                </div>
                <div className="flex space-x-2 mt-4 md:mt-0">
                  <Button onClick={() => handleApprove(website.id)}>
                    Approve
                  </Button>
                  <Button
                    onClick={() => handleReject(website.id)}
                    variant="destructive"
                  >
                    Reject
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mt-4">
                {website.screenshotUrl && (
                  <Link href={website.screenshotUrl} target="_blank">
                    <Image
                      src={website.screenshotUrl}
                      alt={`${website.title} screenshot`}
                      width={200}
                      height={150}
                      className="rounded object-cover hover:opacity-80 transition-opacity"
                    />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
