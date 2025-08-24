'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Folder as FolderIcon,
  PlusCircle,
  FolderArchive,
  Trash2,
  MoreVertical,
} from 'lucide-react';
import {
  Folder,
  createFolder,
  deleteFolder,
  getFoldersByUser,
  getWebsitesInFolder,
  removeWebsiteFromFolder,
} from '@/services/folders';
import { WebsiteData } from '@/services/website';
import { WebsitesGrid } from './WebsitesGrid';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

export function FolderManager() {
  const { user } = useAuth();
  const [folders, setFolders] = useState<Folder[]>([]);
  const [newFolderName, setNewFolderName] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(
    null
  );
  const [websitesInFolder, setWebsitesInFolder] = useState<
    WebsiteData[]
  >([]);
  const [isCreating, setIsCreating] = useState(false);
  const [foldersLoading, setFoldersLoading] = useState(true);
  const [websitesLoading, setWebsitesLoading] = useState(false);
  const [folderToDelete, setFolderToDelete] = useState<Folder | null>(
    null
  );

  const fetchFolders = async (selectFolderId?: string) => {
    if (!user) return;
    setFoldersLoading(true);
    const userFolders = await getFoldersByUser(user.uid);
    setFolders(userFolders);
    setFoldersLoading(false);

    if (selectFolderId) {
      const newFolder = userFolders.find(
        (f) => f.id === selectFolderId
      );
      if (newFolder) handleSelectFolder(newFolder);
    }
  };

  useEffect(() => {
    if (user) fetchFolders();
  }, [user]);

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newFolderName.trim()) return;
    setIsCreating(true);
    const newFolderId = await createFolder(newFolderName, user.uid);
    setNewFolderName('');
    toast.success(`Folder "${newFolderName}" created.`);
    await fetchFolders(newFolderId);
    setIsCreating(false);
  };

  const handleDeleteFolder = async (folderId: string) => {
    try {
      await deleteFolder(folderId);
      toast.success('Folder deleted.');
      if (selectedFolder?.id === folderId) {
        setSelectedFolder(null);
        setWebsitesInFolder([]);
      }
      fetchFolders();
    } catch (error) {
      toast.error('Failed to delete folder.');
    }
  };

  const handleSelectFolder = async (folder: Folder) => {
    setSelectedFolder(folder);
    setWebsitesLoading(true);
    const websites = await getWebsitesInFolder(folder);
    setWebsitesInFolder(websites);
    setWebsitesLoading(false);
  };

  const handleRemoveWebsite = async (websiteId: string) => {
    if (!selectedFolder) return;

    const originalWebsitesInFolder = [...websitesInFolder];
    const originalFolders = [...folders];

    setWebsitesInFolder((prev) =>
      prev.filter((web) => web.id !== websiteId)
    );

    setFolders((prevFolders) =>
      prevFolders.map((f) =>
        f.id === selectedFolder.id
          ? {
              ...f,
              websiteIds: f.websiteIds.filter(
                (id) => id !== websiteId
              ),
            }
          : f
      )
    );

    try {
      await removeWebsiteFromFolder(selectedFolder.id, websiteId);
      toast.success('Website removed from folder.');
    } catch (error) {
      toast.error('Failed to remove website. Please try again.');
      setWebsitesInFolder(originalWebsitesInFolder);
      setFolders(originalFolders);
      console.error('Error removing website from folder:', error);
    }
  };

  return (
    <div className="grid md:grid-cols-[280px_1fr] gap-8">
      <aside className="p-6 border rounded-lg text-card-foreground">
        <h2 className="text-xl font-semibold mb-4">My Folders</h2>
        <form
          onSubmit={handleCreateFolder}
          className="flex gap-2 mb-4"
        >
          <Input
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            placeholder="New folder name..."
            disabled={isCreating}
            className="mt-0"
          />
          <Button
            type="submit"
            size="icon"
            disabled={isCreating || !newFolderName.trim()}
          >
            {isCreating ? (
              <Spinner className="h-4 w-4" />
            ) : (
              <PlusCircle className="h-4 w-4" />
            )}
          </Button>
        </form>

        <div className="flex flex-col gap-1 mt-4">
          {foldersLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-9 w-full rounded-md" />
              ))
            : folders.map((folder) => (
                <div
                  key={folder.id}
                  className="flex items-center group gap-1"
                >
                  <Button
                    variant={
                      selectedFolder?.id === folder.id
                        ? 'secondary'
                        : 'ghost'
                    }
                    onClick={() => handleSelectFolder(folder)}
                    className="justify-start flex-grow w-0"
                  >
                    <FolderIcon className="mr-2 h-4 w-4 shrink-0" />
                    <span className="truncate">{folder.name}</span>
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="shrink-0"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive focus:bg-destructive/10"
                        onSelect={() => setFolderToDelete(folder)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Remove</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
        </div>
      </aside>

      <main className="p-6 border rounded-lg text-card-foreground">
        {!selectedFolder ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <FolderIcon
              size={48}
              className="text-muted-foreground mb-4"
            />
            <h3 className="text-lg font-semibold">Select a folder</h3>
            <p className="text-muted-foreground mt-1">
              Choose a folder to see the websites you&apos;ve saved.
            </p>
          </div>
        ) : (
          <div>
            <h3 className="text-2xl font-semibold mb-4">
              {selectedFolder.name}
            </h3>
            {websitesLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-40 w-full" />
                    <Skeleton className="h-6 w-3/4" />
                  </div>
                ))}
              </div>
            ) : websitesInFolder.length > 0 ? (
              <WebsitesGrid
                websites={websitesInFolder}
                onRemoveWebsite={handleRemoveWebsite}
              />
            ) : (
              <div className="text-center py-12">
                <FolderArchive
                  size={48}
                  className="text-muted-foreground mx-auto mb-4"
                />
                <h3 className="text-lg font-semibold">
                  This folder is empty
                </h3>
                <p className="text-muted-foreground mt-1">
                  Click the &quot;Save&quot; button on a website to
                  add it here.
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      <AlertDialog
        open={!!folderToDelete}
        onOpenChange={(isOpen) => !isOpen && setFolderToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete &quot;{folderToDelete?.name}&quot;?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. All websites saved in this
              folder will be un-saved from it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (folderToDelete) {
                  handleDeleteFolder(folderToDelete.id);
                }
              }}
              className={buttonVariants({ variant: 'destructive' })}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
