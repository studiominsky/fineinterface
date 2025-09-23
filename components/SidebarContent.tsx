'use client';

import { useRouter } from 'next/navigation';
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
  LogIn,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { ThemeToggle } from './ThemeToggle';
import { SignInDialog } from './SignInDialog';
import { UploadWebsiteDialog } from './UploadWebsiteDialog';
import Link from 'next/link';

export const categoryGroups = [
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

export const SidebarContent = ({
  onLinkClick,
}: {
  onLinkClick?: () => void;
}) => {
  const router = useRouter();
  const currentYear = new Date().getFullYear();
  const { user, logout } = useAuth();

  const handleNavigation = (path: string) => {
    router.push(path);
    onLinkClick?.();
  };

  const handleLogout = () => {
    logout();
    onLinkClick?.();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-y-auto">
        <div className="p-4">
          <div className="pb-4 border-b mb-4 space-y-4 lg:hidden">
            <div className="space-y-4">
              {user ? (
                <div className="space-y-2">
                  <UploadWebsiteDialog />
                  <Link href="/profile" onClick={onLinkClick}>
                    <Button variant="ghost" className="w-full justify-start">
                      Profile
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    onClick={handleLogout}
                    className="w-full justify-start"
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="text-start space-y-2 pt-[30px]">
                  <p className="text-sm text-muted-foreground">
                    Sign in to submit sites and save your favorites.
                  </p>
                  <SignInDialog>
                    <Button className="bg-foreground text-background mt-2 hover:bg-foreground/90 w-full">
                      <LogIn className="mr-2 h-4 w-4" />
                      Sign In
                    </Button>
                  </SignInDialog>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <span className="text-sm text-muted-foreground">
                Switch Theme
              </span>
              <ThemeToggle />
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="mb-2 px-2 text-lg font-semibold tracking-tight">
              Discover
            </h3>
            <Button
              onClick={() => handleNavigation('/')}
              className="w-full justify-start"
              variant='ghost'
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
                    variant='ghost'
                    onClick={() => handleNavigation(`/?category=${item.slug}`)}
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
                variant='ghost'
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