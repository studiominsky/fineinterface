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
import { categoryGroups } from '@/lib/categories';

export const MobileSidebarContent = ({ onLinkClick }: { onLinkClick?: () => void }) => {
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
                    {/* MOBILE-ONLY ACCOUNT/SETTINGS BLOCK */}
                    <div className="pb-4 border-b mb-4 space-y-4">
                        <div className="space-y-4">
                            {user ? (
                                <div className="space-y-2">
                                    <div className="menu-item">
                                        <UploadWebsiteDialog />
                                    </div>
                                    <Link href="/profile" onClick={onLinkClick} className="menu-item block">
                                        <Button variant="ghost" className="w-full justify-start">
                                            Profile
                                        </Button>
                                    </Link>
                                    <div className="menu-item">
                                        <Button
                                            variant="ghost"
                                            onClick={handleLogout}
                                            className="w-full justify-start"
                                        >
                                            Logout
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-start space-y-2 pt-[30px]">
                                    <p className="text-sm text-muted-foreground menu-item">
                                        Sign in to submit sites and save your favorites.
                                    </p>
                                    <div className="menu-item">
                                        <SignInDialog>
                                            <Button className="bg-foreground text-background mt-2 hover:bg-foreground/90 w-full">
                                                <LogIn className="mr-2 h-4 w-4" />
                                                Sign In
                                            </Button>
                                        </SignInDialog>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t menu-item">
                            <span className="text-sm text-muted-foreground">Switch Theme</span>
                            <ThemeToggle />
                        </div>
                    </div>

                    {/* DISCOVER */}
                    <div className="space-y-1">
                        <h3 className="mb-2 px-2 text-lg font-semibold tracking-tight menu-item">
                            Discover
                        </h3>
                        <div className="menu-item">
                            <Button
                                onClick={() => handleNavigation('/')}
                                className="w-full justify-start"
                                variant="ghost"
                            >
                                <LayoutGrid className="mr-2 h-4 w-4" />
                                All
                            </Button>
                        </div>
                    </div>

                    {/* GROUPS */}
                    {categoryGroups.map((group) => (
                        <div key={group.title} className="pt-4">
                            <h4 className="mb-2 px-2 text-sm font-semibold text-muted-foreground menu-item">
                                {group.title}
                            </h4>
                            <div className="space-y-1">
                                {group.items.map((item) => (
                                    <div key={item.slug} className="menu-item">
                                        <Button
                                            variant="ghost"
                                            onClick={() => handleNavigation(`/?category=${item.slug}`)}
                                            className="w-full justify-start"
                                        >
                                            <item.icon className="mr-2 h-4 w-4" />
                                            {item.name}
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* FOOTER / PROMO */}
                <div className="mt-auto pt-4 flex-shrink-0 border-t p-4">
                    <div className="px-2 space-y-2 text-start menu-item">
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
                            className="block"
                        >
                            <Button
                                variant="ghost"
                                size="sm"
                                className="bg-[#34c477] text-black hover:bg-[#2bab67] w-full text-xs h-8"
                            >
                                Discover More
                                <ArrowRight className="ml-2 h-3 w-3" />
                            </Button>
                        </a>
                    </div>

                    <p className="px-2 pt-4 text-xs text-center text-muted-foreground menu-item">
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