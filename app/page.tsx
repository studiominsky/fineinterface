import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Header } from '@/components/Header';
import { CategorySidebar } from '@/components/CategorySidebar';

const WebsiteList = dynamic(() => import('@/components/WebsiteList').then((mod) => mod.WebsiteList));

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        <Suspense
          fallback={
            <aside className="p-4 w-48 border-r">
              Loading categories...
            </aside>
          }
        >
          <CategorySidebar />
        </Suspense>
        <main className="flex-1 bg-[#fcfcfc] dark:bg-black min-h-screen">
          <Suspense
            fallback={<p className="p-4">Loading websites...</p>}
          >
            <WebsiteList />
          </Suspense>
        </main>
      </div>
    </div>
  );
}