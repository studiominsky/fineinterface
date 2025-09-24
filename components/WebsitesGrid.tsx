'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { ExternalLink, ImageIcon, MoreVertical, Trash2 } from 'lucide-react';
import { WebsiteData } from '@/services/website';
import { WebsiteDetailDialog } from './WebsiteDetailDialog';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const WebsiteCard = ({ site, index, onRemoveWebsite }: { site: WebsiteData; index: number; onRemoveWebsite?: (websiteId: string) => void; }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentCardRef = cardRef.current;
    if (!currentCardRef) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.remove('card-hidden');
          entry.target.classList.add('card-visible');
          observer.unobserve(entry.target);
        }
      },
      {
        rootMargin: '0px',
        threshold: 0.1,
      }
    );

    observer.observe(currentCardRef);

    return () => {
      if (currentCardRef) {
        observer.unobserve(currentCardRef);
      }
    };
  }, []);

  return (
    <div ref={cardRef} className="website-card card-hidden h-full relative group pointer-events-auto will-change-transform">
      {onRemoveWebsite && (
        <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="h-7 w-7">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive focus:bg-destructive/10"
                onSelect={(e) => {
                  e.preventDefault();
                  onRemoveWebsite(site.id);
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Remove from folder
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
      <WebsiteDetailDialog website={site}>
        <button className="overflow-hidden transition-all flex flex-col cursor-pointer h-full border border-border rounded-md duration-300 hover:-translate-y-2 w-full text-left">
          {site.screenshotUrl ? (
            <div className="relative w-full aspect-video">
              <Image
                src={site.screenshotUrl}
                alt={`${site.title} website photo`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
                priority={index < 3}
              />
            </div>
          ) : (
            <div className="relative w-full aspect-video bg-muted flex items-center justify-center">
              <ImageIcon className="text-muted-foreground" size={48} />
            </div>
          )}
          <div className="px-4 py-1 flex items-center justify-between gap-2 bg-background w-full">
            <h2 className="font-semibold text-sm truncate">{site.title}</h2>
            <div className="p-2" onClick={(e) => e.stopPropagation()}>
              <a href={site.url} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${site.title} website`} className="flex p-3 items-center justify-center">
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
              </a>
            </div>
          </div>
        </button>
      </WebsiteDetailDialog>
    </div>
  );
};

export const WebsitesGrid = ({
  websites,
  onRemoveWebsite,
}: {
  websites: WebsiteData[];
  onRemoveWebsite?: (websiteId: string) => void;
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-7">
      {websites.map((site, index) => (
        <WebsiteCard key={site.id} site={site} index={index} onRemoveWebsite={onRemoveWebsite} />
      ))}
    </div>
  );
};