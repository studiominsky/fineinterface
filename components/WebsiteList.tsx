'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { getApprovedWebsites, WebsiteData } from '@/services/website';
import { WebsitesGrid } from './WebsitesGrid';
import { Spinner } from '@/components/ui/spinner';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Label } from './ui/label';

gsap.registerPlugin(ScrollTrigger);

const formatCategoryName = (slug: string | null) => {
  if (!slug) return '';
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export function WebsiteList() {
  const [websites, setWebsites] = useState<WebsiteData[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalWebsites, setTotalWebsites] = useState(0);
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

      if (!category || category === 'all') {
        const allWebsites = await getApprovedWebsites();
        setTotalWebsites(allWebsites.length);
      }

      setLoading(false);
    };

    fetchWebsites();
  }, [category]);

  const pageTitle = useMemo(() => {
    if (category && category !== 'all') {
      return `${formatCategoryName(category)} Websites`;
    }
    return 'Finest Interfaces across the Web';
  }, [category]);

  const pageDescription = useMemo(() => {
    if (category && category !== 'all') {
      return `Explore hand-picked ${formatCategoryName(
        category
      ).toLowerCase()} websites. Your go-to resource for industry-specific design inspiration.`;
    }
    return 'Explore our hand-picked collection of exceptional websites. A go-to resource for designers, developers, and creatives seeking inspiration.';
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
      <div className="text-center p-10 mt-10">
        <h2 className="text-xl font-semibold">No Websites Found</h2>
        <p className="text-muted-foreground mt-2">
          It looks like there are no websites in this category yet. Be
          the first to submit one and inspire others!
        </p>
      </div>
    );
  }

  return (
    <div ref={container}>
      <section className="px-7 py-12">
        <div className="grid md:grid-cols-1 gap-12 items-center justify-between max-w-2xl">
          <div className="text-left">
            <Label className="bg-[#34c477]/30 text-[#018d42] dark:text-[#0bcb65] w-fit font-bold px-4 py-1 rounded-xl text-xs mb-3">
              Version 1.0
            </Label>
            <h1 className="text-3xl mt-2 sm:text-4xl font-bold tracking-tight">
              {pageTitle}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              {pageDescription}
            </p>
            <div className="flex items-center gap-x-4 mt-4">
              <div className="font-semibold py-1 rounded-full text-xs">
                {totalWebsites > 0
                  ? `${totalWebsites} Websites Curated`
                  : 'Community Driven'}
              </div>
            </div>
          </div>
        </div>
      </section>

      <WebsitesGrid websites={websites} />
    </div>
  );
}
