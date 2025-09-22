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
import { WebsiteData } from '@/services/website';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';
import { ExternalLink, ImageIcon } from 'lucide-react';
import { SaveToFolderPopover } from './SaveToFolderPopover';
import * as React from 'react';
import { Spinner } from './ui/spinner';

export function WebsiteDetailDialog({
  website,
  children,
}: {
  website: WebsiteData;
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const [shouldPreload, setShouldPreload] = React.useState(false);
  const [isImageLoaded, setIsImageLoaded] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    if (!isOpen) {
      setIsImageLoaded(false);
    }
  }, [isOpen]);

  return (
    <>
      {shouldPreload && website.screenshotUrl && (
        <Head>
          <link
            rel="preload"
            href={website.screenshotUrl}
            as="image"
          />
        </Head>
      )}

      <Dialog
        open={isOpen}
        onOpenChange={setIsOpen}
      >
        <DialogTrigger
          asChild
          onClick={() => setShouldPreload(true)}
          onMouseEnter={() => setShouldPreload(true)}
          onFocus={() => setShouldPreload(true)}
        >
          {children}
        </DialogTrigger>

        <DialogContent
          className="p-0 max-w-[min(100vw-2rem,700px)]"
          aria-describedby={undefined}
        >
          <div className="grid h-full max-h-[85dvh] grid-rows-[auto,1fr]">
            <div className="relative overflow-auto bg-muted">
              {website.screenshotUrl ? (
                <>
                  {!isImageLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background">
                      <Spinner className="h-8 w-8" />
                    </div>
                  )}
                  <Image
                    src={website.screenshotUrl}
                    alt={website.title}
                    width={1600}
                    height={900}
                    className="w-full h-auto object-cover rounded-t-lg"
                    sizes="100vw"
                    priority
                    onLoad={() => setIsImageLoaded(true)}
                  />
                </>
              ) : (
                <div className="w-full h-[240px] flex items-center justify-center rounded-t-lg">
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
              </div>

              <DialogFooter className="mt-auto gap-2 p-4 md:p-6">
                <Link
                  href={website.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="w-full sm-w-auto">
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
    </>
  );
}