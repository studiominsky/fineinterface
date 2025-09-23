// SidebarContent.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowRight, LayoutGrid } from 'lucide-react';
import { categoryGroups } from '@/lib/categories';

export const SidebarContent = () => {
  const pathname = usePathname();
  const activeCategory = pathname.startsWith('/category/')
    ? pathname.split('/')[2]
    : 'all';
  const currentYear = new Date().getFullYear();

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="space-y-1">
            <h3 className="mb-2 px-2 text-lg font-semibold tracking-tight">Discover</h3>
            <Link href="/" prefetch className="block">
              <Button
                variant={activeCategory === 'all' ? 'secondary' : 'ghost'}
                className="w-full justify-start"
                asChild
              >
                <span>
                  <LayoutGrid className="mr-2 h-4 w-4" />
                  All
                </span>
              </Button>
            </Link>
          </div>

          {categoryGroups.map((group) => (
            <div key={group.title} className="pt-4">
              <h4 className="mb-2 px-2 text-sm font-semibold text-muted-foreground">{group.title}</h4>
              <div className="space-y-1">
                {group.items.map((item) => (
                  <Link key={item.slug} href={`/category/${item.slug}`} prefetch className="block">
                    <Button
                      variant={activeCategory === item.slug ? 'secondary' : 'ghost'}
                      className="w-full justify-start"
                      asChild
                    >
                      <span>
                        <item.icon className="mr-2 h-4 w-4" />
                        {item.name}
                      </span>
                    </Button>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="sticky bottom-0 border-t p-4 bg-background">
        <div className="px-2 space-y-2 text-start">
          <h4 className="font-semibold text-sm">Need a stunning website or web application?</h4>
          <p className="text-xs text-muted-foreground">Studio Minsky builds digital tools that drive business growth.</p>
          <a href="https://studiominsky.com" target="_blank" rel="noopener noreferrer">
            <Button size="sm" className="bg-[#34c477] text-black hover:bg-[#2bab67] w-full text-xs h-8">
              Discover More
              <ArrowRight className="ml-2 h-3 w-3" />
            </Button>
          </a>
        </div>
        <p className="px-2 pt-4 text-xs text-center text-muted-foreground">
          © {currentYear} Project by{' '}
          <a href="https://studiominsky.com" target="_blank" rel="noopener noreferrer" className="hover:underline">
            Studio Minsky
          </a>
        </p>
      </div>
    </div>
  );
};