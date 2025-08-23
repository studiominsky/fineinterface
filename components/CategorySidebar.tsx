'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';

const categories = ['all', 'tech', 'ai', 'marketing'];

export const CategorySidebar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const active = searchParams.get('category') || 'all';

  return (
    <aside className="p-4 w-48 border-r space-y-2">
      {categories.map((cat) => (
        <Button
          key={cat}
          variant={active === cat ? 'default' : 'outline'}
          onClick={() =>
            router.push(cat === 'all' ? '/' : `/?category=${cat}`)
          }
          className="w-full justify-start"
        >
          {cat.charAt(0).toUpperCase() + cat.slice(1)}
        </Button>
      ))}
    </aside>
  );
};
