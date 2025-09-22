import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
    return (
        <div className="flex flex-1">
            <aside className="p-4 w-64 border-r">
                <Skeleton className="h-6 w-1/3 mb-6" />
                <div className="space-y-4">
                    <Skeleton className="h-5 w-1/4 mb-2" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                </div>
                <div className="space-y-4 mt-6">
                    <Skeleton className="h-5 w-1/4 mb-2" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                </div>
            </aside>

            <main className="flex-1 p-7">
                <Skeleton className="h-8 w-1/4 mb-2" />
                <Skeleton className="h-10 w-1/2 mb-4" />
                <Skeleton className="h-6 w-3/4 mb-8" />
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="flex flex-col space-y-3">
                            <Skeleton className="h-[125px] w-full rounded-xl" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-4/5" />
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}