import { Suspense } from 'react';
import { Header } from '@/components/Header';
import { CategorySidebar } from '@/components/CategorySidebar';
import { WebsiteList } from '@/components/WebsiteList';
import Loading from '@/components/Loading';

export default async function CategoryPage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params;

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <div className="flex flex-1">
                <Suspense fallback={<Loading />}>
                    <CategorySidebar />
                    <main className="flex-1 bg-[#fcfcfc] dark:bg-black min-h-screen">
                        <WebsiteList category={slug} />
                    </main>
                </Suspense>
            </div>
        </div>
    );
}