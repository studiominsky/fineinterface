import { CategorySidebar } from '@/components/CategorySidebar';
import { Header } from '@/components/Header';
import { WebsitesGrid } from '@/components/WebsitesGrid';
import { getApprovedWebsites } from '@/services/website';

export default async function Home({
  searchParams,
}: {
  searchParams?: { [key: string]: string | undefined };
}) {
  let websites = await getApprovedWebsites();

  const category = searchParams?.category;
  if (category && category !== 'all') {
    websites = websites.filter(
      (website) => website.category === category
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        <CategorySidebar />
        <main className="flex-1">
          <WebsitesGrid websites={websites} />
        </main>
      </div>
    </div>
  );
}
