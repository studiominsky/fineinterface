import { CategorySidebar } from '@/components/CategorySidebar';
import { Header } from '@/components/Header';
import { WebsitesGrid } from '@/components/WebsitesGrid';

export default function Home() {
  return (
    <>
      <Header />
      <CategorySidebar />
      <WebsitesGrid websites={[]} />
    </>
  );
}
