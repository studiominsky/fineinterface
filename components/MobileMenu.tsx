'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { SidebarContent } from './SidebarContent';
import Logo from './Logo';
import { cn } from '@/lib/utils';

export function MobileMenu() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="lg:hidden">
            <Button
                variant="ghost"
                size="icon"
                onClick={toggleMenu}
                aria-label="Open menu"
            >
                <Menu className="h-6 w-6" />
            </Button>

            <div
                onClick={toggleMenu}
                className={cn(
                    'fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ease-in-out',
                    isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                )}
            />

            <aside
                className={cn(
                    'fixed top-0 right-0 z-50 h-full w-4/5 max-w-sm transform bg-background shadow-xl transition-transform duration-300 ease-in-out',
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                )}
            >
                <div className="flex h-full flex-col">
                    <div className="flex items-center justify-between p-4 border-b">
                        <Logo />
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleMenu}
                            aria-label="Close menu"
                        >
                            <X className="h-6 w-6" />
                        </Button>
                    </div>

                    <div className="flex-1 bg-background">
                        <SidebarContent onLinkClick={toggleMenu} />
                    </div>
                </div>
            </aside>
        </div>
    );
}