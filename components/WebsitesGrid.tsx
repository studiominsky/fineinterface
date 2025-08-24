'use client';

import Image from 'next/image';
import { Star, FolderPlus, ImageIcon } from 'lucide-react';
import { WebsiteData, rateWebsite } from '@/services/website';
import { useAuth } from '@/context/AuthContext';
import { SaveToFolderDialog } from './SaveToFolderDialog';
import { Badge } from '@/components/ui/badge';

export const WebsitesGrid = ({
  websites,
}: {
  websites: WebsiteData[];
}) => {
  const { user } = useAuth();

  const handleRate = async (websiteId: string, newRating: number) => {
    if (!user) {
      alert('You must be logged in to rate a website.');
      return;
    }
    await rateWebsite(websiteId, user.uid, newRating);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {websites.map((site) => (
        <div
          key={site.id}
          className="border bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col group"
        >
          <a
            href={site.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            {site.screenshotUrl ? (
              <div className="relative w-full h-48 overflow-hidden">
                <Image
                  src={site.screenshotUrl}
                  alt={site.title}
                  fill
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
          </a>
          <div className="p-4 flex flex-col flex-grow justify-between">
            <div>
              <h3 className="font-semibold text-lg">{site.title}</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {site.categories.map((category) => (
                  <Badge
                    key={category}
                    variant="secondary"
                    className="capitalize"
                  >
                    {category}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center mt-2 gap-1">
                <Star
                  className="text-yellow-400 fill-yellow-400"
                  size={16}
                />
                <span className="text-muted-foreground font-medium">
                  {site.averageRating.toFixed(1)}
                </span>
                <span className="text-xs text-muted-foreground ml-1">
                  ({Object.keys(site.ratings).length} ratings)
                </span>
              </div>
            </div>
            <div className="mt-4 space-y-3">
              {user && user.uid !== site.createdBy && (
                <div>
                  <p className="text-sm font-medium mb-1">
                    Your Rating:
                  </p>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`cursor-pointer transition-colors hover:text-blue-500 ${
                          (site.ratings[user.uid] || 0) >= star
                            ? 'text-blue-500 fill-blue-500'
                            : 'text-gray-300'
                        }`}
                        onClick={() => handleRate(site.id, star)}
                      />
                    ))}
                  </div>
                </div>
              )}
              {user && <SaveToFolderDialog websiteId={site.id} />}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
