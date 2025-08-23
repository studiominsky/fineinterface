import { CategorySidebar } from '@/components/CategorySidebar';
import { Header } from '@/components/Header';
import { WebsiteList } from '@/components/WebsiteList'; // Import the new component
import { Suspense } from 'react';

// This component no longer needs to be async
export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        <CategorySidebar />
        <main className="flex-1">
          {/* Use React Suspense as a best practice for loading client components */}
          <Suspense fallback={<p>Loading...</p>}>
            <WebsiteList />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
