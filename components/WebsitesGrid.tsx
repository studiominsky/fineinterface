'use client';

import Image from 'next/image';
import { ImageIcon } from 'lucide-react';
import { WebsiteData } from '@/services/website';
import { WebsiteDetailDialog } from './WebsiteDetailDialog';

export const WebsitesGrid = ({
  websites,
}: {
  websites: WebsiteData[];
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
      {websites.map((site) => (
        <WebsiteDetailDialog key={site.id} website={site}>
          <div className="border bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col group cursor-pointer">
            {site.screenshotUrl ? (
              <div className="relative w-full h-48 overflow-hidden">
                <Image
                  src={site.screenshotUrl}
                  alt={site.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            ) : (
              <div className="relative w-full h-48 bg-muted flex items-center justify-center">
                <ImageIcon
                  className="text-muted-foreground"
                  size={48}
                />
              </div>
            )}
            <div className="p-4">
              <h3 className="font-semibold text-lg truncate">
                {site.title}
              </h3>
            </div>
          </div>
        </WebsiteDetailDialog>
      ))}
    </div>
  );
};
