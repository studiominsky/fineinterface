'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  AppWindow,
  Archive,
  BrainCircuit,
  Briefcase,
  Building2,
  Cloud, // Icon for Bluesky
  Code,
  Cpu,
  Globe,
  Landmark,
  LayoutGrid,
  Megaphone,
  Monitor,
  PenTool,
  ShoppingCart,
  Smartphone,
  Target,
  Twitter, // Icon for X
} from 'lucide-react';

const categoryGroups = [
  {
    title: 'Services',
    items: [
      { name: 'Portfolio', slug: 'portfolio', icon: Briefcase },
      { name: 'Assets', slug: 'assets', icon: Archive },
      { name: 'Agency', slug: 'agency', icon: Building2 },
    ],
  },
  {
    title: 'Tech',
    items: [
      {
        name: 'Artificial Intelligence',
        slug: 'ai',
        icon: BrainCircuit,
      },
      { name: 'Tech', slug: 'tech', icon: Cpu },
      { name: 'Web3', slug: 'web3', icon: Globe },
    ],
  },
  {
    title: 'Tools',
    items: [
      { name: 'Development Tools', slug: 'dev-tools', icon: Code },
      { name: 'Design Tools', slug: 'design-tools', icon: PenTool },
      { name: 'Marketing', slug: 'marketing', icon: Megaphone },
    ],
  },
  {
    title: 'Money',
    items: [
      { name: 'Finance', slug: 'finance', icon: Landmark },
      { name: 'E-commerce', slug: 'ecommerce', icon: ShoppingCart },
    ],
  },
  {
    title: 'Apps',
    items: [
      { name: 'Mobile Apps', slug: 'mobile-apps', icon: Smartphone },
      { name: 'Web Apps', slug: 'web-apps', icon: AppWindow },
      { name: 'Desktop Apps', slug: 'desktop-apps', icon: Monitor },
    ],
  },
  {
    title: 'Productivity',
    items: [
      { name: 'Productivity', slug: 'productivity', icon: Target },
    ],
  },
];

export const CategorySidebar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get('category') || 'all';
  const currentYear = new Date().getFullYear();

  return (
    <aside className="p-4 w-64 border-r flex flex-col">
      <div>
        <div className="space-y-1">
          <h3 className="mb-2 px-2 text-lg font-semibold tracking-tight">
            Discover
          </h3>
          <Button
            variant={activeCategory === 'all' ? 'secondary' : 'ghost'}
            onClick={() => router.push('/')}
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
                    activeCategory === item.slug
                      ? 'secondary'
                      : 'ghost'
                  }
                  onClick={() =>
                    router.push(`/?category=${item.slug}`)
                  }
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

      {/* --- Footer Section --- */}
      <div className="mt-auto">
        <div className="flex items-center space-x-1 mb-2">
          <Button variant="ghost" size="icon" asChild>
            <a
              href="https://x.com/your-profile" // <-- Replace with your X profile URL
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit X profile"
            >
              <Twitter className="h-4 w-4" />
            </a>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <a
              href="https://bsky.app/profile/your-profile" // <-- Replace with your Bluesky profile URL
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit Bluesky profile"
            >
              <Cloud className="h-4 w-4" />
            </a>
          </Button>
        </div>
        <p className="px-2 text-xs text-muted-foreground">
          © {currentYear}{' '}
          <a
            href="https://your-studio-website.com" // <-- Replace with your studio's website URL
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            Project by Studio Minsky
          </a>
        </p>
      </div>
    </aside>
  );
};
