'use client';

import { useMemo } from 'react';
import { Label } from './ui/label';

const formatCategoryName = (slug: string | null) =>
    !slug ? '' : slug.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');

export function CategoryHeader({ category, totalWebsites }: { category?: string, totalWebsites: number }) {
    const pageTitle = useMemo(
        () => (category && category !== 'all' ? `${formatCategoryName(category)} Websites` : 'Finest Interfaces across the Web'),
        [category]
    );

    const pageDescription = useMemo(
        () =>
            category && category !== 'all'
                ? `Explore hand-picked ${formatCategoryName(category).toLowerCase()} websites. Your go-to resource for industry-specific design inspiration.`
                : 'Explore our hand-picked collection of exceptional websites. A go-to resource for designers, developers, and creatives seeking inspiration.',
        [category]
    );

    return (
        <section className="px-7 py-12 mt-20">
            <div className="grid md:grid-cols-1 gap-12 items-center justify-between max-w-2xl">
                <div className="text-left">
                    <Label className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 w-fit font-bold px-4 py-1 rounded-xl text-xs mb-3">
                        Version 1.0
                    </Label>
                    <h1 className="text-3xl mt-2 sm:text-4xl font-bold tracking-tight">{pageTitle}</h1>
                    <p className="mt-4 text-lg text-muted-foreground">{pageDescription}</p>
                    <div className="flex items-center gap-x-4 mt-4">
                        <div className="font-semibold py-1 rounded-full text-xs">
                            {totalWebsites > 0 ? `${totalWebsites} Websites Curated` : 'Community Driven'}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}