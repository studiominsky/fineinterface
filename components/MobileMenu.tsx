'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { gsap } from 'gsap';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { SidebarContent } from './SidebarContent';
import Logo from './Logo';

export function MobileMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const menuRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const tl = useRef<gsap.core.Timeline | null>(null);

    useEffect(() => {
        setIsOpen(false);
    }, [pathname, searchParams]);

    useEffect(() => {
        tl.current = gsap.timeline({ paused: true });

        // Menu animation
        tl.current.to(menuRef.current, {
            x: 0,
            duration: 0.3,
            ease: 'power3.inOut',
        });

        // Overlay animation
        tl.current.to(
            overlayRef.current,
            {
                opacity: 1,
                duration: 0.3,
                ease: 'power3.inOut',
            },
            '<'
        );
    }, []);

    useEffect(() => {
        if (isOpen) {
            tl.current?.play();
            document.body.style.overflow = 'hidden';
        } else {
            tl.current?.reverse();
            document.body.style.overflow = '';
        }
    }, [isOpen]);

    // Close menu on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [menuRef]);

    return (
        <div className="lg:hidden">
            <Button
                aria-label="Open menu"
                variant="ghost"
                size="icon"
                className="h-12 w-12"
                onClick={() => setIsOpen(true)}
            >
                <Menu className="h-7 w-7" />
            </Button>

            <div
                ref={overlayRef}
                className="fixed inset-0 bg-black/50 z-[99] opacity-0"
                onClick={() => setIsOpen(false)}
                style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
            />
            <div
                ref={menuRef}
                className="fixed top-0 right-0 h-full w-64 bg-background z-[100] p-5 flex flex-col"
                style={{ transform: 'translateX(100%)' }}
            >
                <div className="sticky top-0 z-10 h-14 border-b bg-background/80 backdrop-blur flex items-center justify-between">
                    <Logo />
                    <Button
                        aria-label="Close menu"
                        variant="ghost"
                        size="icon"
                        className="h-12 w-12"
                        onClick={() => setIsOpen(false)}
                    >
                        <X className="h-7 w-7" />
                    </Button>
                </div>

                <div className="flex-1 overflow-y-auto pt-4">
                    <SidebarContent onLinkClick={() => setIsOpen(false)} />
                </div>
            </div>
        </div>
    );
}