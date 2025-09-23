'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { gsap } from 'gsap';
import { Menu, X } from 'lucide-react';
import Logo from './Logo';
import clsx from 'clsx';

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
        const ctx = gsap.context(() => {
            tl.current = gsap.timeline({ paused: true });

            tl.current
                .to(overlayRef.current, {
                    opacity: 1,
                    duration: 0.3,
                    ease: 'power2.inOut',
                })
                .to(
                    menuRef.current,
                    {
                        x: 0,
                        duration: 0.4,
                        ease: 'power3.out',
                    },
                    '<'
                );
        });
        return () => ctx.revert();
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

    return (
        <div className="lg:hidden">
            <button
                className="relative z-[101] flex h-8 w-8 cursor-pointer items-center justify-center"
                onClick={() => setIsOpen((v) => !v)}
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
                className="fixed inset-0 bg-black/50 z-[99]"
                onClick={() => setIsOpen(false)}
                style={{ opacity: 0, pointerEvents: isOpen ? 'auto' : 'none' }}
            />

            <div
                ref={menuRef}
                className="fixed top-0 right-0 h-full w-84 bg-background z-[100] p-5 flex flex-col"
                style={{ transform: 'translateX(100%)' }}
            >
                <div className="sticky top-0 z-10 h-12 bg-background/80 backdrop-blur flex items-center justify-between">
                    <Logo />
                </div>

                <div className="flex-1 overflow-y-auto pt-4">
                    123
                </div>
            </div>
        </div>
    );
}