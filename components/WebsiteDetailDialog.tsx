'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { WebsiteData, rateWebsite } from '@/services/website';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';
import Link from 'next/link';
import { Star, ExternalLink, ImageIcon } from 'lucide-react';
import { SaveToFolderPopover } from './SaveToFolderPopover';
import { toast } from 'sonner';
import * as React from 'react';

export function WebsiteDetailDialog({
  website,
  children,
}: {
  website: WebsiteData;
  children: React.ReactNode;
}) {
  const { user } = useAuth();

  const handleRate = async (newRating: number) => {
    if (!user) {
      toast.error('You must be logged in to rate a website.');
      return;
    }
    try {
      await rateWebsite(website.id, user.uid, newRating);
      toast.success('Your rating has been submitted!');
    } catch (error) {
      console.error('Failed to submit rating:', error);
      toast.error('There was an error submitting your rating.');
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent
        className="p-0 max-w-[min(100vw-2rem,700px)]"
        aria-describedby={undefined}
      >
        <div className="grid h-full max-h-[85dvh] grid-rows-[auto,1fr]">
          <div className="relative overflow-auto">
            {website.screenshotUrl ? (
              <Image
                src={website.screenshotUrl}
                alt={website.title}
                width={1600}
                height={900}
                className="w-full h-auto object-cover rounded-t-lg"
                sizes="100vw"
                priority
              />
            ) : (
              <div className="w-full h-[240px] flex items-center justify-center bg-muted rounded-t-lg">
                <ImageIcon
                  className="text-muted-foreground"
                  size={48}
                />
              </div>
            )}
          </div>

          <div className="flex min-h-0 flex-col border-b border-l border-r">
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">
                  {website.title}
                </DialogTitle>

                <div className="flex flex-wrap items-center gap-2 pt-2">
                  {website.categories.map((category) => (
                    <Badge
                      key={category}
                      variant="secondary"
                      className="capitalize"
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
              </DialogHeader>

              <DialogDescription className="text-base leading-relaxed">
                {website.description}
              </DialogDescription>

              {user && user.uid !== website.createdBy && (
                <div className="p-3 bg-muted/50 rounded-md">
                  <p className="text-sm font-semibold mb-2">
                    Your Rating
                  </p>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`cursor-pointer transition-colors hover:opacity-80 w-6 h-6 ${
                          (website.ratings[user.uid] || 0) >= star
                            ? 'text-blue-500 fill-blue-500'
                            : 'text-gray-300'
                        }`}
                        onClick={() => handleRate(star)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <DialogFooter className="mt-auto gap-2 p-4 md:p-6">
              <Link
                href={website.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="w-full sm:w-auto">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open Website
                </Button>
              </Link>
              {user && <SaveToFolderPopover websiteId={website.id} />}
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
