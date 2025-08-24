'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/context/AuthContext';
import { addWebsite, categorySlugs } from '@/services/website';
import { toast } from 'sonner';
import { Spinner } from './ui/spinner';

// Use the single source of truth for categories
const availableCategories = categorySlugs;
type Category = (typeof availableCategories)[number];

// Helper to make category slugs look nice
const formatCategoryLabel = (slug: string) => {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const UploadWebsiteDialog = () => {
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
      // Reset form state
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
        <Button>Upload Website</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-4xl border overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Submit a Website for Review</DialogTitle>
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
            <div className="flex flex-wrap gap-x-4 gap-y-2 pt-2">
              {availableCategories.map((category) => (
                <div
                  key={category}
                  className="flex items-center space-x-2"
                >
                  <Checkbox
                    id={category}
                    checked={categories.includes(category)}
                    onCheckedChange={() =>
                      handleCategoryChange(category)
                    }
                  />
                  <Label htmlFor={category} className="font-normal">
                    {formatCategoryLabel(category)}
                  </Label>
                </div>
              ))}
            </div>
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
            <Label htmlFor="photo">Screenshot</Label>
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
