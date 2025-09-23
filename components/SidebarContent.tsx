'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowRight, LayoutGrid } from 'lucide-react';
import { categoryGroups } from '@/lib/categories';

export const SidebarContent = () => {
  const router = useRouter();
  const pathname = usePathname();

  // Determine the active category from the pathname
  const activeCategory = pathname.startsWith('/category/')
    ? pathname.split('/')[2]
    : 'all';

  const currentYear = new Date().getFullYear();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-y-auto">
        <div className="p-4">
          <div className="space-y-1">
            <h3 className="mb-2 px-2 text-lg font-semibold tracking-tight">
              Discover
            </h3>
            <Button
              variant={activeCategory === 'all' ? 'secondary' : 'ghost'}
              onClick={() => handleNavigation('/')}
              className="w-full justify-start"
            >
              <LayoutGrid className="mr-2 h-4 w-4" />
              All
            </Button>
          </div>

          {categoryGroups.map((group) => (
            <div key={group.title} className="pt-4">
              <h4 className="mb-2 px-2 text-sm font-semibold text-muted-foreground">
                {group.title}
              </h4>
              <div className="space-y-1">
                {group.items.map((item) => (
                  <Button
                    key={item.slug}
                    variant={
                      activeCategory === item.slug ? 'secondary' : 'ghost'
                    }
                    onClick={() => handleNavigation(`/category/${item.slug}`)}
                    className="w-full justify-start"
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-auto pt-4 flex-shrink-0 border-t p-4">
          <div className="px-2 space-y-2 text-start">
            <h4 className="font-semibold text-sm">
              Need a stunning website or web application?
            </h4>
            <p className="text-xs text-muted-foreground">
              Studio Minsky builds digital tools that drive business growth.
            </p>
            <a
              href="https://studiominsky.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="sm"
                className="bg-[#34c477] text-black hover:bg-[#2bab67] w-full text-xs h-8"
              >
                Discover More
                <ArrowRight className="ml-2 h-3 w-3" />
              </Button>
            </a>
          </div>
          <p className="px-2 pt-4 text-xs text-center text-muted-foreground">
            © {currentYear} Project by{' '}
            <a
              href="https://studiominsky.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              Studio Minsky
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};