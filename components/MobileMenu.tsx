'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { usePathname } from 'next/navigation';
import { gsap } from 'gsap';
import { Menu, X } from 'lucide-react';
import Logo from './Logo';
import { MobileSidebarContent } from './MobileSidebarContent';

export function MobileMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const pathname = usePathname();

    const panelRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const tlRef = useRef<gsap.core.Timeline | null>(null);

    useEffect(() => setMounted(true), []);
    useEffect(() => setIsOpen(false), [pathname]);

    useEffect(() => {
        const panel = panelRef.current;
        const overlay = overlayRef.current;
        if (!panel || !overlay) return;

        tlRef.current = gsap
            .timeline({
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
            .set(panel, { xPercent: 100, autoAlpha: 0 })
            .set(overlay, { autoAlpha: 0 })
            .to(overlay, { autoAlpha: 1, duration: 0.25 })
            .to(panel, { xPercent: 0, autoAlpha: 1, duration: 0.3 }, 0);

        return () => {
            tlRef.current?.kill();
            tlRef.current = null;
        };
    }, [mounted]);

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
        <>
            <button
                className="relative z-[1200] flex h-10 w-10 items-center justify-center cursor-pointer"
                onClick={() => setIsOpen(true)}
                aria-label="Open menu"
                aria-expanded={isOpen}
                aria-controls="mobile-menu-panel"
                style={{ touchAction: 'manipulation' }}
            >
                <Menu className="h-6 w-6" />
            </button>

            {mounted &&
                createPortal(
                    <>
                        <div
                            ref={overlayRef}
                            className="fixed inset-0 z-[1000] hidden bg-black/30 backdrop-blur-sm opacity-0"
                            onClick={() => setIsOpen(false)}
                            style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
                            aria-hidden={!isOpen}
                        />
                        <div
                            id="mobile-menu-panel"
                            ref={panelRef}
                            className="fixed top-0 right-0 z-[1010] hidden h-full w-80 max-w-[85vw] flex-col bg-background opacity-0"
                            role="dialog"
                            aria-modal="true"
                            aria-hidden={!isOpen}
                        >
                            <div className="flex-shrink-0 border-l h-20 flex items-center justify-between border-b px-4">
                                <Logo />
                                <button onClick={() => setIsOpen(false)} className="p-2  cursor-pointer" aria-label="Close menu">
                                    <X className="h-6 w-6" />
                                </button>
                            </div>
                            <div className="flex-1 h-full border-l overflow-y-auto p-4">
                                <MobileSidebarContent onLinkClick={() => setIsOpen(false)} />
                            </div>
                        </div>
                    </>,
                    document.body
                )}
        </>
    );
}