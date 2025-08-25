'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  getWebsitesByUser,
  deleteWebsite,
  WebsiteData,
} from '@/services/website';
import Image from 'next/image';
import Link from 'next/link';
import { EditWebsiteDialog } from './EditWebsiteDialog';
import { Button } from '@/components/ui/button';
import { MoreVertical, Pencil, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

export function MySubmissions() {
  const { user } = useAuth();
  const [websites, setWebsites] = useState<WebsiteData[]>([]);
  const [loading, setLoading] = useState(true);
  const [websiteToDelete, setWebsiteToDelete] =
    useState<WebsiteData | null>(null);
  const [editingWebsite, setEditingWebsite] =
    useState<WebsiteData | null>(null);

  const fetchSubmissions = useCallback(async () => {
    if (user) {
      setLoading(true);
      const userWebsites = await getWebsitesByUser(user.uid);
      setWebsites(userWebsites);
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const handleDelete = async () => {
    if (!websiteToDelete) return;

    try {
      await deleteWebsite(websiteToDelete.id);
      toast.success(`"${websiteToDelete.title}" has been deleted.`);
      fetchSubmissions();
    } catch (error) {
      toast.error('Failed to delete submission.');
      console.error('Delete error:', error);
    } finally {
      setWebsiteToDelete(null);
    }
  };

  return (
    <>
      <div className="p-6 border rounded-lg text-card-foreground">
        <h2 className="text-xl font-semibold mb-4">My Submissions</h2>
        {loading ? (
          <p>Loading your submissions...</p>
        ) : websites.length === 0 ? (
          <p className="text-muted-foreground">
            You haven&apos;t submitted any websites yet.
          </p>
        ) : (
          <div className="space-y-4">
            {websites.map((website) => (
              <div
                key={website.id}
                className="flex items-center justify-between p-2 rounded-md hover:bg-accent"
              >
                <div className="flex items-center gap-4">
                  {website.screenshotUrl && (
                    <Image
                      src={website.screenshotUrl}
                      alt={website.title}
                      width={80}
                      height={60}
                      className="rounded object-cover"
                    />
                  )}
                  <div>
                    <Link
                      href={website.url}
                      target="_blank"
                      className="font-medium hover:underline"
                    >
                      {website.title}
                    </Link>
                    <p className="text-sm text-muted-foreground max-w-md truncate">
                      {website.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      website.approved
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {website.approved ? 'Approved' : 'Pending'}
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                      >
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">More options</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onSelect={() => setEditingWebsite(website)}
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        <span>Edit</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive focus:bg-destructive/10"
                        onSelect={() => setWebsiteToDelete(website)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {editingWebsite && (
        <EditWebsiteDialog
          website={editingWebsite}
          onWebsiteUpdated={fetchSubmissions}
          open={!!editingWebsite}
          onOpenChange={(isOpen) =>
            !isOpen && setEditingWebsite(null)
          }
        />
      )}

      <AlertDialog
        open={!!websiteToDelete}
        onOpenChange={(isOpen) => !isOpen && setWebsiteToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you absolutely sure?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently
              delete your submission for &quot;
              {websiteToDelete?.title}&quot;.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Yes, delete submission
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
