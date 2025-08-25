'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Archive,
  ArrowRight,
  BrainCircuit,
  Briefcase,
  Building2,
  Code,
  Cpu,
  Globe,
  Landmark,
  LayoutGrid,
  Megaphone,
  PenTool,
  ShoppingCart,
  Target,
} from 'lucide-react';
import Image from 'next/image';

const categoryGroups = [
  {
    title: 'Services',
    items: [
      { name: 'Portfolio', slug: 'portfolio', icon: Briefcase },
      { name: 'Software', slug: 'software', icon: Archive },
      { name: 'Agency', slug: 'agency', icon: Building2 },
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
      { name: 'Productivity', slug: 'productivity', icon: Target },
    ],
  },
];

export const SidebarContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get('category') || 'all';
  const currentYear = new Date().getFullYear();

  return (
    <div className="flex flex-col h-full">
      <div className="overflow-y-auto">
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

      <div className="mt-auto pt-4 flex-shrink-0">
        <div className="mb-4 rounded-md flex gap-1 flex-col">
          <Image
            src="/website.svg"
            alt="Studio Minsky"
            width={220}
            height={120}
            className="rounded-sm mb-3"
          />
          <h4 className="font-semibold text-sm mb-1 px-1">
            Studio Minsky can help you bring your project to life
          </h4>
          <p className="text-xs text-muted-foreground px-1 mb-3">
            If you need a professional looking website, contact Studio
            Minsky for a quote. We build digital tools that drive
            business growth.
          </p>
          <a
            href="https://studiominsky.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="bg-[#34c477] text-black hover:bg-[#2bab67] w-full">
              Discover more
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </a>
        </div>

        <p className="px-2 text-xs text-muted-foreground">
          © {currentYear}{' '}
          <a
            href="https://studiominsky.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            Project by Studio Minsky
          </a>
        </p>
      </div>
    </div>
  );
};
