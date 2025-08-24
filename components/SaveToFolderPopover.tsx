'use client';

import { useState, useEffect } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import {
  Folder,
  getFoldersByUser,
  addWebsiteToFolder,
} from '@/services/folders';
import { FolderPlus } from 'lucide-react';
import { toast } from 'sonner';

export function SaveToFolderPopover({
  websiteId,
}: {
  websiteId: string;
}) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && open) {
      const fetchFolders = async () => {
        setLoading(true);
        const userFolders = await getFoldersByUser(user.uid);
        setFolders(userFolders);
        setLoading(false);
      };
      fetchFolders();
    }
  }, [user, open]);

  const handleSelectFolder = async (folderId: string) => {
    try {
      await addWebsiteToFolder(folderId, websiteId);
      toast.success('Website saved to folder!');
      setOpen(false);
    } catch (error) {
      console.error('Failed to save to folder:', error);
      toast.error('Error saving to folder.');
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full sm:w-auto">
          <FolderPlus className="mr-2 h-4 w-4" /> Save to Folder
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search folders..." />
          <CommandList>
            <CommandEmpty>No folders found.</CommandEmpty>
            <CommandGroup>
              {folders.map((folder) => (
                <CommandItem
                  key={folder.id}
                  onSelect={() => handleSelectFolder(folder.id)}
                >
                  {folder.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
