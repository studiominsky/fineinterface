'use client';

import Image from 'next/image';
import { ExternalLink, ImageIcon } from 'lucide-react';
import { WebsiteData } from '@/services/website';
import { WebsiteDetailDialog } from './WebsiteDetailDialog';
import { Button } from '@/components/ui/button';

export const WebsitesGrid = ({
  websites,
}: {
  websites: WebsiteData[];
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-7">
      {websites.map((site) => (
        <div key={site.id} className="website-card h-full">
          <WebsiteDetailDialog website={site}>
            <div className="overflow-hidden rounded-md border transition-all flex flex-col group cursor-pointer h-full">
              {site.screenshotUrl ? (
                <div className="relative w-full aspect-video ">
                  <Image
                    src={site.screenshotUrl}
                    alt={site.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ) : (
                <div className="relative w-full aspect-video bg-muted flex items-center justify-center">
                  <ImageIcon
                    className="text-muted-foreground"
                    size={48}
                  />
                </div>
              )}
              <div className="p-4 flex items-center justify-between gap-2">
                <h3 className="font-semibold text-sm truncate">
                  {site.title}
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  asChild
                  onClick={(e) => e.stopPropagation()}
                >
                  <a
                    href={site.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit ${site.title} website`}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          </WebsiteDetailDialog>
        </div>
      ))}
    </div>
  );
};
