'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { addWebsite, categorySlugs } from '@/services/website';
import { toast } from 'sonner';
import { Spinner } from './ui/spinner';
import { Check, ChevronsUpDown, PlusCircle } from 'lucide-react';

const availableCategories = categorySlugs;
type Category = (typeof availableCategories)[number];

const formatCategoryLabel = (slug: string) => {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const UploadWebsiteDialog = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: '',
    url: '',
    description: '',
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCategoryChange = (category: Category) => {
    setCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !file || categories.length === 0) {
      toast.error(
        'Please fill out all fields, select at least one category, and upload a screenshot.'
      );
      return;
    }
    setIsSubmitting(true);
    toast.loading('Submitting your website...');

    try {
      await addWebsite(
        {
          ...form,
          categories,
          createdBy: user.uid,
        },
        file
      );

      toast.dismiss();
      toast.success('Website submitted for approval!');
      setForm({ title: '', url: '', description: '' });
      setCategories([]);
      setFile(null);
      const fileInput = document.getElementById(
        'photo'
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      setOpen(false);
    } catch (err) {
      toast.dismiss();
      toast.error('There was an error submitting your website.');
      console.error('Error submitting website:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button className="bg-[#34c477] text-black hover:bg-[#2bab67]">
            <PlusCircle className="h-4 w-4" /> Upload Website
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto max-w-150">
        <DialogHeader>
          <DialogTitle>Submit a Website for Review</DialogTitle>
          <DialogDescription>
            Your submission will be reviewed by an administrator
            before it appears on the site.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-1">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) =>
                setForm({ ...form, title: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              type="url"
              placeholder="https://example.com"
              value={form.url}
              onChange={(e) =>
                setForm({ ...form, url: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Categories (select at least one)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="w-full justify-between h-auto font-normal"
                >
                  <div className="flex gap-1 flex-wrap">
                    {categories.length > 0 ? (
                      <>
                        {categories.slice(0, 4).map((cat) => (
                          <Badge key={cat} variant="secondary">
                            {formatCategoryLabel(cat)}
                          </Badge>
                        ))}
                        {categories.length > 4 && (
                          <Badge variant="outline">
                            +{categories.length - 4} more
                          </Badge>
                        )}
                      </>
                    ) : (
                      'Select categories...'
                    )}
                  </div>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Command>
                  <CommandInput placeholder="Search categories..." />
                  <CommandList>
                    <CommandEmpty>No category found.</CommandEmpty>
                    <CommandGroup>
                      {availableCategories.map((category) => (
                        <CommandItem
                          key={category}
                          onSelect={() =>
                            handleCategoryChange(category)
                          }
                        >
                          <Check
                            className={`mr-2 h-4 w-4 ${
                              categories.includes(category)
                                ? 'opacity-100'
                                : 'opacity-0'
                            }`}
                          />
                          {formatCategoryLabel(category)}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-1">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              rows={3}
              required
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="photo">Screenshot</Label>.
            <Input
              id="photo"
              type="file"
              accept="image/png, image/jpeg, image/webp"
              onChange={(e) =>
                setFile(e.target.files ? e.target.files[0] : null)
              }
              required
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <Spinner className="mr-2 h-4 w-4" />
              ) : null}
              {isSubmitting ? 'Submitting...' : 'Submit for Review'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
