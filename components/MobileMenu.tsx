'use client';

import { useState, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetClose, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, X } from 'lucide-react';
import { SidebarContent } from './SidebarContent';
import Logo from './Logo';

export function MobileMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (isOpen) setIsOpen(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
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

                <SheetContent side="left" showClose={false} className="p-0">
                    <div className="sticky top-0 z-10 h-14 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                        <div className="relative flex h-full items-center justify-center">
                            <SheetClose asChild>
                                <Button
                                    aria-label="Close menu"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute left-2 h-10 w-10"
                                >
                                    <X className="h-6 w-6" />
                                </Button>
                            </SheetClose>
                            <div className="pointer-events-none select-none">
                                <Logo />
                            </div>
                        </div>
                    </div>

                    <div className="h-[calc(100vh-3.5rem)] overflow-y-auto p-4">
                        <SidebarContent onLinkClick={() => setIsOpen(false)} />
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}