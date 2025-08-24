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
import { addWebsite, WebsiteData } from '@/services/website';
import { toast } from 'sonner';
import { Spinner } from './ui/spinner';

const availableCategories = ['tech', 'ai', 'marketing'] as const;
type Category = (typeof availableCategories)[number];

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
        'Please fill out all fields and select an image and category.'
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
      <DialogContent className="max-h-[90vh] overflow-y-auto">
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
              value={form.url}
              onChange={(e) =>
                setForm({ ...form, url: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-1">
            <Label>Categories</Label>
            <div className="flex flex-wrap gap-4 pt-2">
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
                  <Label
                    htmlFor={category}
                    className="font-normal capitalize"
                  >
                    {category}
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
            <Label htmlFor="photo">Photo</Label>
            <Input
              id="photo"
              type="file"
              accept="image/*"
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
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
