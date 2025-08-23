'use client';

import Image from 'next/image';
import { Star } from 'lucide-react';
import { WebsiteData } from '@/services/website';

export const WebsitesGrid = ({
  websites,
}: {
  websites: WebsiteData[];
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {websites.map((site) => (
        <a
          key={site.id}
          href={site.url}
          target="_blank"
          rel="noopener noreferrer"
          className="border bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col group"
        >
          {site.screenshotUrls && site.screenshotUrls.length > 0 && (
            <div className="relative w-full h-48 overflow-hidden">
              <Image
                src={site.screenshotUrls[0]}
                alt={site.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}
          <div className="p-4 flex flex-col flex-grow">
            <h3 className="font-semibold text-lg">{site.title}</h3>
            <p className="text-sm text-muted-foreground capitalize">
              {site.category}
            </p>
            <div className="flex items-center mt-2 gap-1">
              <Star
                className="text-yellow-400 fill-yellow-400"
                size={16}
              />
              <span className="text-muted-foreground font-medium">
                {site.averageRating.toFixed(1)}
              </span>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
};
