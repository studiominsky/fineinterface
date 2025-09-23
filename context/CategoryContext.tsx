'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

interface CategoryContextType {
    category: string | null;
    setCategory: (category: string | null) => void;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export function CategoryProvider({ children }: { children: ReactNode }) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [category, setCategoryState] = useState<string | null>(searchParams.get('category'));

    const setCategory = (newCategory: string | null) => {
        setCategoryState(newCategory);
        const params = new URLSearchParams(window.location.search);
        if (newCategory) {
            params.set('category', newCategory);
        } else {
            params.delete('category');
        }
        router.push(`?${params.toString()}`);
    };

    return (
        <CategoryContext.Provider value={{ category, setCategory }}>
            {children}
        </CategoryContext.Provider>
    );
}

export function useCategory() {
    const context = useContext(CategoryContext);
    if (context === undefined) {
        throw new Error('useCategory must be used within a CategoryProvider');
    }
    return context;
}