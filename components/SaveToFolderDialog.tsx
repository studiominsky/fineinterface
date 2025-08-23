'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import {
  Folder,
  getFoldersByUser,
  addWebsiteToFolder,
} from '@/services/folders';
import { FolderPlus } from 'lucide-react';

export function SaveToFolderDialog({
  websiteId,
}: {
  websiteId: string;
}) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open && user) {
      const fetchFolders = async () => {
        setLoading(true);
        const userFolders = await getFoldersByUser(user.uid);
        setFolders(userFolders);
        setLoading(false);
      };
      fetchFolders();
    }
  }, [open, user]);

  const handleSaveFolder = async (folderId: string) => {
    try {
      await addWebsiteToFolder(folderId, websiteId);
      alert('Saved to folder!');
      setOpen(false);
    } catch (error) {
      console.error('Failed to save to folder:', error);
      alert('Error saving to folder.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="mt-4 self-start"
        >
          <FolderPlus className="mr-2 h-4 w-4" /> Save
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save to a folder</DialogTitle>
        </DialogHeader>
        {loading ? (
          <p>Loading folders...</p>
        ) : (
          <div className="flex flex-col space-y-2 py-4">
            {folders.length > 0 ? (
              folders.map((folder) => (
                <Button
                  key={folder.id}
                  variant="ghost"
                  className="justify-start"
                  onClick={() => handleSaveFolder(folder.id)}
                >
                  {folder.name}
                </Button>
              ))
            ) : (
              <p className="text-muted-foreground text-center">
                You dont have any folders yet. Create one on your
                profile page!
              </p>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
