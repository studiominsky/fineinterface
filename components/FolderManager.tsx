'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Folder as FolderIcon,
  PlusCircle,
  FolderArchive,
} from 'lucide-react';
import {
  Folder,
  createFolder,
  getFoldersByUser,
  getWebsitesInFolder,
} from '@/services/folders';
import { WebsiteData } from '@/services/website';
import { WebsitesGrid } from './WebsitesGrid';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';

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

  const fetchFolders = async () => {
    if (!user) return;
    setFoldersLoading(true);
    const userFolders = await getFoldersByUser(user.uid);
    setFolders(userFolders);
    setFoldersLoading(false);
  };

  useEffect(() => {
    if (user) {
      fetchFolders();
    }
  }, [user]);

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newFolderName.trim()) return;
    setIsCreating(true);
    await createFolder(newFolderName, user.uid);
    setNewFolderName('');
    await fetchFolders();
    setIsCreating(false);
  };

  const handleSelectFolder = async (folder: Folder) => {
    setSelectedFolder(folder);
    setWebsitesLoading(true);
    const websites = await getWebsitesInFolder(folder);
    setWebsitesInFolder(websites);
    setWebsitesLoading(false);
  };

  return (
    <div className="grid md:grid-cols-[280px_1fr] gap-8">
      <aside className="p-6 border rounded-lg text-card-foreground">
        <h2 className="text-xl font-semibold mb-4">My Folders</h2>
        <form
          onSubmit={handleCreateFolder}
          className="flex gap-2 mb-4 items-center"
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
                <Button
                  key={folder.id}
                  variant={
                    selectedFolder?.id === folder.id
                      ? 'secondary'
                      : 'ghost'
                  }
                  onClick={() => handleSelectFolder(folder)}
                  className="justify-start"
                >
                  <FolderIcon className="mr-2 h-4 w-4" />
                  <span className="truncate">{folder.name}</span>
                </Button>
              ))}
        </div>
      </aside>

      {/* --- Content Area --- */}
      <main>
        {!selectedFolder ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 border rounded-lg bg-card text-card-foreground">
            <FolderIcon
              size={48}
              className="text-muted-foreground mb-4"
            />
            <h3 className="text-lg font-semibold">Select a folder</h3>
            <p className="text-muted-foreground mt-1">
              Choose a folder from the list to see the websites
              you&apos;ve saved.
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
              <WebsitesGrid websites={websitesInFolder} />
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
    </div>
  );
}
