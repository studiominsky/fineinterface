'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { gsap } from 'gsap';
import { Menu, X } from 'lucide-react';
import { SidebarContent } from './SidebarContent';
import Logo from './Logo';
import clsx from 'clsx';

export function MobileMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();


    const menuRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const tl = useRef<gsap.core.Timeline | null>(null);

    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            if (!menuRef.current || !overlayRef.current) return;

            gsap.set(menuRef.current, { xPercent: 100, willChange: 'transform' });
            gsap.set(overlayRef.current, { opacity: 0, willChange: 'opacity' });

            tl.current = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } })
                .to(overlayRef.current, { opacity: 1, duration: 0.25 }, 0)
                .to(menuRef.current, { xPercent: 0, duration: 0.35, force3D: true }, 0);
        });

        return () => ctx.revert();
    }, []);

    useEffect(() => {
        const t = tl.current;
        if (!t) return;

        if (isOpen) {
            t.play();
            document.body.style.overflow = 'hidden';
        } else {
            t.reverse();
            document.body.style.overflow = '';
        }
    }, [isOpen]);

    return (
        <div className="lg:hidden">
            <button
                className="relative z-[101] flex h-8 w-8 items-center justify-center"
                onPointerDown={() => setIsOpen((v) => !v)} // snappier than onClick on iOS
                aria-label={isOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isOpen}
                aria-controls="mobile-menu-panel"
                style={{ touchAction: 'manipulation' }}
            >
                <Menu
                    className={clsx(
                        'absolute h-6 w-6 transition-all duration-300 ease-out',
                        isOpen ? 'rotate-45 opacity-0' : 'rotate-0 opacity-100'
                    )}
                />
                <X
                    className={clsx(
                        'absolute h-6 w-6 transition-all duration-300 ease-out',
                        isOpen ? 'rotate-0 opacity-100' : '-rotate-45 opacity-0'
                    )}
                />
            </button>

            <div
                ref={overlayRef}
                className="fixed inset-0 z-[99] bg-black/50"
                onClick={() => setIsOpen(false)}
                style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
            />

            <div
                id="mobile-menu-panel"
                ref={menuRef}
                className="fixed top-0 right-0 z-[100] h-full w-84 bg-background p-5 flex flex-col will-change-transform"
            >
                <div className="sticky top-0 z-10 h-12 bg-background/80 flex items-center justify-between">
                    <Logo />
                </div>

                <div className="flex-1 overflow-y-auto pt-4">
                    <SidebarContent onLinkClick={() => setIsOpen(false)} />
                </div>
            </div>
        </div>
    );
}