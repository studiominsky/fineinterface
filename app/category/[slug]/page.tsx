import { Suspense } from 'react';
import { WebsiteList } from '@/components/WebsiteList';
import Loading from '@/components/Loading';
import { CategoryHeader } from '@/components/CategoryHeader';
import { getTotalApprovedWebsites } from '@/services/website';

export default async function CategoryPage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params;
    const totalWebsites = await getTotalApprovedWebsites(slug);

    return (
        <>
            <CategoryHeader category={slug} totalWebsites={totalWebsites} />
            <Suspense fallback={<Loading />}>
                <WebsiteList category={slug} />
            </Suspense>
        </>
    );
}