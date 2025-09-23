'use client';

import { Suspense } from 'react';
import { CategorySidebar } from '@/components/CategorySidebar';
import { WebsiteList } from '@/components/WebsiteList';
import Loading from '@/components/Loading';

export default function HomePageClient() {
    return (
        <Suspense fallback={<Loading />}>
            <CategorySidebar />
            <main className="flex-1 bg-[#fcfcfc] dark:bg-black min-h-screen">
                <WebsiteList />
            </main>
        </Suspense>
    );
}