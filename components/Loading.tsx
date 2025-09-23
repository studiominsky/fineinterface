import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
    return (
        <main className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-7">
                {Array.from({ length: 9 }).map((_, i) => (
                    <div
                        key={i}
                        className="flex flex-col border border-border rounded-md"
                    >
                        <Skeleton className="w-full aspect-video rounded-b-none" />

                        <div className="p-4 flex items-center justify-between gap-2 bg-background">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-4" />
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}