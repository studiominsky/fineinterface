'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { getApprovedWebsites, WebsiteData } from '@/services/website';
import { WebsitesGrid } from './WebsitesGrid';

export function WebsiteList() {
  const [websites, setWebsites] = useState<WebsiteData[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const category = searchParams.get('category');

  useEffect(() => {
    const fetchWebsites = async () => {
      setLoading(true);
      const approvedWebsites = await getApprovedWebsites(
        category || undefined
      );
      setWebsites(approvedWebsites);
      setLoading(false);
    };

    fetchWebsites();
  }, [category]);

  if (loading) {
    return <p className="text-center p-10">Loading websites...</p>;
  }

  return <WebsitesGrid websites={websites} />;
}
