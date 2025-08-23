'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getWebsitesByUser, WebsiteData } from '@/services/website';
import Image from 'next/image';
import Link from 'next/link';

export function MySubmissions() {
  const { user } = useAuth();
  const [websites, setWebsites] = useState<WebsiteData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubmissions = async () => {
      if (user) {
        setLoading(true);
        const userWebsites = await getWebsitesByUser(user.uid);
        setWebsites(userWebsites);
        setLoading(false);
      }
    };
    fetchSubmissions();
  }, [user]);

  return (
    <div className="p-6 border rounded-lg bg-card text-card-foreground shadow-sm">
      <h2 className="text-xl font-semibold mb-4">My Submissions</h2>
      {loading ? (
        <p>Loading your submissions...</p>
      ) : websites.length === 0 ? (
        <p className="text-muted-foreground">
          You havent submitted any websites yet.
        </p>
      ) : (
        <div className="space-y-4">
          {websites.map((website) => (
            <div
              key={website.id}
              className="flex items-center justify-between p-2 rounded-md hover:bg-accent"
            >
              <div className="flex items-center gap-4">
                {website.screenshotUrl && (
                  <Image
                    src={website.screenshotUrl}
                    alt={website.title}
                    width={80}
                    height={60}
                    className="rounded object-cover"
                  />
                )}
                <div>
                  <Link
                    href={website.url}
                    target="_blank"
                    className="font-medium hover:underline"
                  >
                    {website.title}
                  </Link>
                  <p className="text-sm text-muted-foreground max-w-md truncate">
                    {website.description}
                  </p>
                </div>
              </div>
              <div
                className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  website.approved
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {website.approved ? 'Approved' : 'Pending'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
