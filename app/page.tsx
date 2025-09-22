import { Header } from '@/components/Header';
import { CategorySidebar } from '@/components/CategorySidebar';
import { WebsiteList } from '@/components/WebsiteList';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1">

        <CategorySidebar />
        <main className="flex-1 bg-[#fcfcfc] dark:bg-black min-h-screen">
          <WebsiteList />
        </main>
      </div>
    </div>
  );
}