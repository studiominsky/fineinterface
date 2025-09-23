'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { gsap } from 'gsap';
import { Menu, X } from 'lucide-react';
import clsx from 'clsx';
import Logo from './Logo';
import { SidebarContent } from './SidebarContent';

export function MobileMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const rootRef = useRef<HTMLDivElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const tlRef = useRef<gsap.core.Timeline | null>(null);

    useEffect(() => setIsOpen(false), [pathname]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const panel = panelRef.current;
            const overlay = overlayRef.current;
            const menuItems = gsap.utils.toArray('.menu-item');

            if (!panel || !overlay || menuItems.length === 0) return;

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
                .to(overlay, { autoAlpha: 1, duration: 0.3 })
                .to(panel, { xPercent: -100, autoAlpha: 1, duration: 0.4 }, 0)
                .fromTo(menuItems, {
                    opacity: 0,
                    x: -20,
                }, {
                    opacity: 1,
                    x: 0,
                    duration: 0.3,
                    stagger: 0.05,
                }, 0.1);
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
                className="relative z-[101] flex h-8 w-8 items-center justify-center"
                onPointerDown={() => setIsOpen(v => !v)}
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
                className="fixed inset-0 z-[99] hidden bg-black/30 backdrop-blur-sm opacity-0"
                onClick={() => setIsOpen(false)}
                style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
                aria-hidden={!isOpen}
            />

            <div
                id="mobile-menu-panel"
                ref={panelRef}
                className="fixed top-0 right-0 z-[100] hidden h-full w-80 max-w-[85vw] translate-x-full flex-col bg-background p-5 opacity-0"
                role="dialog"
                aria-modal="true"
                aria-hidden={!isOpen}
            >
                <div className="sticky top-0 z-10 h-12 flex items-center justify-between bg-background/80">
                    <Logo />
                </div>

                <div className="flex-1 overflow-y-auto pt-4">
                    <SidebarContent onLinkClick={() => setIsOpen(false)} />
                </div>
            </div>
        </div>
    );
}