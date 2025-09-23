'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { getApprovedWebsites, WebsiteData } from '@/services/website';
import { WebsitesGrid } from './WebsitesGrid';
import { Spinner } from '@/components/ui/spinner';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { DocumentSnapshot } from 'firebase/firestore';

gsap.registerPlugin(ScrollTrigger);

export function WebsiteList({ category }: { category?: string }) {
  const [websites, setWebsites] = useState<WebsiteData[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastVisible, setLastVisible] = useState<DocumentSnapshot | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [totalWebsites, setTotalWebsites] = useState(0);
  const container = useRef<HTMLDivElement | null>(null);
  const loader = useRef<HTMLDivElement | null>(null);

  const fetchWebsites = useCallback(async (startAfterDoc: DocumentSnapshot | null = null) => {
    if (loadingMore) return;

    if (startAfterDoc) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

    const { websites: newWebsites, lastVisible: newLastVisible, total } = await getApprovedWebsites(category, startAfterDoc);

    setWebsites(prev => startAfterDoc ? [...prev, ...newWebsites] : newWebsites);
    setLastVisible(newLastVisible);
    setHasMore((startAfterDoc ? websites.length : 0) + newWebsites.length < total);
    setTotalWebsites(total);

    setLoading(false);
    setLoadingMore(false);
  }, [category, loadingMore, websites.length]);

  useEffect(() => {
    setWebsites([]);
    setLastVisible(null);
    setHasMore(true);
    const initialFetch = async () => {
      setLoading(true);
      const { websites: newWebsites, lastVisible: newLastVisible, total } = await getApprovedWebsites(category);
      setWebsites(newWebsites);
      setLastVisible(newLastVisible);
      setTotalWebsites(total);
      setHasMore(newWebsites.length < total);
      setLoading(false);
    };
    initialFetch();
  }, [category]);


  useGSAP(
    () => {
      if (loading || websites.length === 0) return;

      const cards = gsap.utils.toArray('.website-card:not(.gsap-animated)');
      if (cards.length === 0) return;

      (cards as HTMLElement[]).forEach(card => card.classList.add('gsap-animated'));

      gsap.fromTo(
        cards,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'back.out(1.7)',
          stagger: 0.1,
          overwrite: 'auto',
        }
      );
    },
    { scope: container, dependencies: [websites] }
  );

  useEffect(() => {
    if (!loader.current || !hasMore || loading || loadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingMore) {
          fetchWebsites(lastVisible);
        }
      },
      { threshold: 1.0 }
    );

    const loaderElement = loader.current;
    observer.observe(loaderElement);

    return () => {
      if (loaderElement) {
        observer.unobserve(loaderElement);
      }
    };
  }, [lastVisible, hasMore, loading, loadingMore, fetchWebsites]);

  if (loading && websites.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-7">
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col border border-border rounded-md"
          >
            <div className="w-full aspect-video rounded-b-none bg-muted animate-pulse" />
            <div className="p-4 flex items-center justify-between gap-2 bg-background">
              <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
              <div className="h-4 w-4 bg-muted animate-pulse rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (websites.length === 0 && !loading) {
    return (
      <div className="text-center p-10 mt-10">
        <h2 className="text-xl font-semibold">No Websites Found</h2>
        <p className="text-muted-foreground mt-2">
          It looks like there are no websites in this category yet. Be the first to submit one and inspire others!
        </p>
      </div>
    );
  }

  return (
    <div ref={container}>
      <WebsitesGrid websites={websites} />
      <div ref={loader} className="h-20 flex justify-center items-center">
        {loadingMore && <Spinner className="h-8 w-8" />}
      </div>
    </div>
  );
}