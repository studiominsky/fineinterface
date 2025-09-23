import { Header } from '@/components/Header';
import HomePageClient from '@/components/HomePageClient';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        <HomePageClient />
      </div>
    </div>
  );
}