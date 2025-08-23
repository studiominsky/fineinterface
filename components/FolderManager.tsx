'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Folder,
  createFolder,
  getFoldersByUser,
  getWebsitesInFolder,
} from '@/services/folders';
import { WebsiteData } from '@/services/website';
import { WebsitesGrid } from './WebsitesGrid';

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
  const [loading, setLoading] = useState(true);

  const fetchFolders = async () => {
    if (user) {
      setLoading(true);
      const userFolders = await getFoldersByUser(user.uid);
      setFolders(userFolders);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchFolders();
  }, [user]);

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user && newFolderName.trim()) {
      await createFolder(newFolderName, user.uid);
      setNewFolderName('');
      fetchFolders();
    }
  };

  const handleSelectFolder = async (folder: Folder) => {
    setSelectedFolder(folder);
    const websites = await getWebsitesInFolder(folder);
    setWebsitesInFolder(websites);
  };

  return (
    <div className="p-6 border rounded-lg bg-card text-card-foreground shadow-sm">
      <h2 className="text-xl font-semibold mb-4">My Folders</h2>
      <form onSubmit={handleCreateFolder} className="flex gap-2 mb-4">
        <Input
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
          placeholder="New folder name..."
        />
        <Button type="submit">Create</Button>
      </form>

      {loading && <p>Loading folders...</p>}

      <div className="flex flex-wrap gap-2">
        {folders.map((folder) => (
          <Button
            key={folder.id}
            variant={
              selectedFolder?.id === folder.id ? 'default' : 'outline'
            }
            onClick={() => handleSelectFolder(folder)}
          >
            {folder.name}
          </Button>
        ))}
      </div>

      {selectedFolder && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">
            Websites in &quot;{selectedFolder.name}&quot;
          </h3>
          {websitesInFolder.length > 0 ? (
            <WebsitesGrid websites={websitesInFolder} />
          ) : (
            <p className="text-muted-foreground">
              This folder is empty. Click the Save button on a website
              to add it here.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
