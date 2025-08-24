'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';

const categories = ['all', 'tech', 'ai', 'marketing'];

export const CategorySidebar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get('category') || 'all';

  return (
    <aside className="p-4 w-48 border-r space-y-2">
      {categories.map((category) => (
        <Button
          key={category}
          variant={
            activeCategory === category ? 'default' : 'outline'
          }
          onClick={() =>
            router.push(
              category === 'all' ? '/' : `/?category=${category}`
            )
          }
          className="w-full justify-start"
        >
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </Button>
      ))}
    </aside>
  );
};
