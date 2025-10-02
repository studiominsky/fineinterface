import { Header } from '@/components/Header';
import HomePageClient from '@/components/HomePageClient';
import { CategoryHeader } from '@/components/CategoryHeader';
import { getTotalApprovedWebsites } from '@/services/website';
import { WebsiteList } from '@/components/WebsiteList';

export default async function Home() {
  const totalWebsites = await getTotalApprovedWebsites();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        <HomePageClient>
          <CategoryHeader totalWebsites={totalWebsites} />

          <WebsiteList />

        </HomePageClient>
      </div>
    </div>
  );
}