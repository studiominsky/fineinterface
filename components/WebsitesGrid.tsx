'use client';

import Image from 'next/image';

type Website = {
  id: string;
  title: string;
  url: string;
  category: string;
  screenshotUrl?: string;
  stars?: number;
};

export const WebsitesGrid = ({
  websites,
}: {
  websites: Website[];
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {websites.map((site) => (
        <a
          key={site.id}
          href={site.url}
          target="_blank"
          rel="noopener noreferrer"
          className="border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all"
        >
          {site.screenshotUrl && (
            <Image
              src={site.screenshotUrl}
              alt={site.title}
              width={800}
              height={600}
              className="w-full h-48 object-cover"
            />
          )}
          <div className="p-4">
            <h3 className="font-semibold">{site.title}</h3>
            <p className="text-sm text-muted-foreground capitalize">
              {site.category}
            </p>
          </div>
        </a>
      ))}
    </div>
  );
};
