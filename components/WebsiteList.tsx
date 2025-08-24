'use client';

import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { getApprovedWebsites, WebsiteData } from '@/services/website';
import { WebsitesGrid } from './WebsitesGrid';
import { Spinner } from '@/components/ui/spinner';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export function WebsiteList() {
  const [websites, setWebsites] = useState<WebsiteData[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const category = searchParams.get('category');
  const container = useRef(null);

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

  useGSAP(
    () => {
      if (!loading && websites.length > 0) {
        gsap.fromTo(
          '.website-card',
          {
            opacity: 0,
            y: 50,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'back.out(1.7)',
            stagger: 0.1,
            scrollTrigger: {
              trigger: container.current,
              start: 'top 85%',
              once: true,
            },
          }
        );
      }
    },
    { scope: container, dependencies: [websites, loading] }
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (websites.length === 0) {
    return (
      <div className="text-center p-10 mt-10 border-2 border-dashed rounded-lg">
        <h2 className="text-xl font-semibold">No Websites Found</h2>
        <p className="text-muted-foreground mt-2">
          There are no websites in this category yet. Why not be the
          first to submit one?
        </p>
      </div>
    );
  }

  return (
    <div ref={container}>
      <WebsitesGrid websites={websites} />
    </div>
  );
}
