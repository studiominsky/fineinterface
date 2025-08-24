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
      <DialogContent className="max-w-5xl p-0 rounded-xl">
        <div className="relative w-full h-150">
          {website.screenshotUrl ? (
            <Image
              src={website.screenshotUrl}
              alt={website.title}
              fill
              className="object-cover rounded-t-xl"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <ImageIcon
                className="text-muted-foreground"
                size={48}
              />
            </div>
          )}
        </div>

        <div className="p-6">
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

          <div className="flex items-center my-4 gap-1 text-sm text-muted-foreground">
            <Star
              className="text-yellow-400 fill-yellow-400"
              size={16}
            />
            <span className="font-bold text-foreground">
              {website.averageRating.toFixed(1)}
            </span>
            <span>
              ({Object.keys(website.ratings).length} ratings)
            </span>
          </div>

          <DialogDescription className="text-base max-h-40 overflow-y-auto">
            {website.description}
          </DialogDescription>

          <div className="space-y-4 mt-6">
            {user && user.uid !== website.createdBy && (
              <div className="p-3 bg-muted/50 rounded-md">
                <p className="text-sm font-semibold mb-2">
                  Your Rating
                </p>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`cursor-pointer transition-colors hover:text-blue-500 w-6 h-6 ${
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

            <DialogFooter className="flex flex-col sm:flex-row sm:justify-start gap-2">
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
