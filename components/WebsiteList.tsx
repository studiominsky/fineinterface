'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import { getApprovedWebsites, WebsiteData } from '@/services/website';
import { WebsitesGrid } from './WebsitesGrid';
import { Spinner } from '@/components/ui/spinner';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Label } from './ui/label';

gsap.registerPlugin(ScrollTrigger);

const formatCategoryName = (slug: string | null) =>
  !slug ? '' : slug.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');

export function WebsiteList({ category }: { category?: string }) {
  const [websites, setWebsites] = useState<WebsiteData[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalWebsites, setTotalWebsites] = useState(0);
  const container = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchWebsites = async () => {
      setLoading(true);
      const approved = await getApprovedWebsites(category);
      setWebsites(approved);
      if (!category || category === 'all') {
        const all = await getApprovedWebsites();
        setTotalWebsites(all.length);
      }
      setLoading(false);
    };
    fetchWebsites();
  }, [category]);

  const pageTitle = useMemo(
    () => (category && category !== 'all' ? `${formatCategoryName(category)} Websites` : 'Finest Interfaces across the Web'),
    [category]
  );

  const pageDescription = useMemo(
    () =>
      category && category !== 'all'
        ? `Explore hand-picked ${formatCategoryName(category).toLowerCase()} websites. Your go-to resource for industry-specific design inspiration.`
        : 'Explore our hand-picked collection of exceptional websites. A go-to resource for designers, developers, and creatives seeking inspiration.',
    [category]
  );

  useGSAP(
    (ctx) => {
      if (loading || websites.length === 0) return;

      const q = ctx.selector!;
      const cards = q('.website-card') as HTMLElement[];

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          ScrollTrigger.batch(cards, {
            start: 'top 100%',
            once: true,
            onEnter: (batch) => {
              gsap.fromTo(
                batch as HTMLElement[],
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
          });

          ScrollTrigger.refresh();
        });
      });
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
      <section className="px-7 py-12 mt-20">
        <div className="grid md:grid-cols-1 gap-12 items-center justify-between max-w-2xl">
          <div className="text-left">
            <Label className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 w-fit font-bold px-4 py-1 rounded-xl text-xs mb-3">
              Version 1.0
            </Label>
            <h1 className="text-3xl mt-2 sm:text-4xl font-bold tracking-tight">{pageTitle}</h1>
            <p className="mt-4 text-lg text-muted-foreground">{pageDescription}</p>
            <div className="flex items-center gap-x-4 mt-4">
              <div className="font-semibold py-1 rounded-full text-xs">
                {totalWebsites > 0 ? `${totalWebsites} Websites Curated` : 'Community Driven'}
              </div>
            </div>
          </div>
        </div>
      </section>

      <WebsitesGrid websites={websites} />
    </div>
  );
}