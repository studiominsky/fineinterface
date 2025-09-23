import { Header } from '@/components/Header';
import { CategorySidebar } from '@/components/CategorySidebar';

export default function CategoryLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <div className="flex flex-1">
                <CategorySidebar />
                <main className="flex-1 bg-[#fcfcfc] dark:bg-black min-h-screen">
                    {children}
                </main>
            </div>
        </div>
    );
}