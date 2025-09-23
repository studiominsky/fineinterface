'use client';

import { CategorySidebar } from '@/components/CategorySidebar';
import React from 'react';

export default function HomePageClient({ children }: { children: React.ReactNode }) {
    return (
        <>
            <CategorySidebar />
            <main className="flex-1 bg-[#fcfcfc] dark:bg-black min-h-screen">
                {children}
            </main>
        </>
    );
}