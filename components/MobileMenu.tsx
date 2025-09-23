'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { gsap } from 'gsap';
import { Menu, X } from 'lucide-react';
import clsx from 'clsx';
import Logo from './Logo';
import { MobileSidebarContent } from './MobileSidebarContent';

export function MobileMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const rootRef = useRef<HTMLDivElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const tlRef = useRef<gsap.core.Timeline | null>(null);

    useEffect(() => {
        setIsOpen(false)
    }, [pathname]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const panel = panelRef.current;
            const overlay = overlayRef.current;

            if (!panel || !overlay) return;

            tlRef.current = gsap.timeline({
                paused: true,
                defaults: { ease: 'power2.out' },
                onStart: () => {
                    gsap.set([panel, overlay], { display: 'block' });
                },

                onReverseComplete: () => {
                    gsap.set([panel, overlay], { display: 'none' });
                    document.body.style.overflow = '';
                    document.documentElement.style.overflow = '';
                },
            })
                .to(overlay, { autoAlpha: 1, duration: 0.25 })
                .to(panel, { xPercent: -100, autoAlpha: 1, duration: 0.3 }, 0);
        }, rootRef);

        return () => ctx.revert();
    }, []);

    useEffect(() => {
        const tl = tlRef.current;
        if (!tl) return;

        if (isOpen) {
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
            tl.play(0);
        } else {
            tl.reverse();
        }

        return () => {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        };
    }, [isOpen]);

    return (
        <div ref={rootRef} className="lg:hidden">
            <button
                className={clsx(
                    'relative z-50 flex h-8 w-8 items-center justify-center transition-opacity',
                    { 'opacity-0 pointer-events-none': isOpen }
                )}
                onPointerDown={() => setIsOpen(true)}
                aria-label="Open menu"
                aria-expanded={isOpen}
                aria-controls="mobile-menu-panel"
                style={{ touchAction: 'manipulation' }}
            >
                <Menu className="h-6 w-6" />
            </button>


            <div
                ref={overlayRef}
                className="fixed inset-0 z-[99] hidden bg-black/30 backdrop-blur-sm opacity-0"
                onClick={() => setIsOpen(false)}
                style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
                aria-hidden={!isOpen}
            />

            <div
                id="mobile-menu-panel"
                ref={panelRef}
                className="fixed top-0 right-0 z-[100] hidden h-full w-80 max-w-[85vw] translate-x-full flex-col bg-background opacity-0"
                role="dialog"
                aria-modal="true"
                aria-hidden={!isOpen}
            >
                <div className="flex-shrink-0 h-20 flex items-center justify-between border-b px-4">
                    <Logo />
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-2"
                        aria-label="Close menu"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                    <MobileSidebarContent onLinkClick={() => setIsOpen(false)} />
                </div>
            </div>
        </div>
    );
}