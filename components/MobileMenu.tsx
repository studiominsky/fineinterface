'use client';

import { useState, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { SidebarContent } from './SidebarContent';
import Logo from './Logo';

export function MobileMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        setIsOpen(false);
    }, [pathname, searchParams]);

    return (
        <div className="lg:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                    <Button
                        aria-label="Open menu"
                        variant="ghost"
                        size="icon"
                        className="h-12 w-12"
                    >
                        <Menu className="h-7 w-7" />
                    </Button>
                </SheetTrigger>

                <SheetContent
                    side="right"
                    className="w-64 p-5 flex flex-col"
                >
                    <div className="sticky top-0 z-10 h-14 border-b bg-background/80 backdrop-blur">
                        <div className="h-full flex items-center justify-center">
                            <Logo />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-8">
                        <SidebarContent onLinkClick={() => setIsOpen(false)} />
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}