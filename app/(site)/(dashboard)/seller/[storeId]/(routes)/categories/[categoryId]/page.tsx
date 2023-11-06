import React from 'react';
import prismadb from '@/lib/prismadb';
import CategoryForm from './components/category-form';

interface CategoryPageProps {
    params: {
        categoryId: string;
    };
}

const CategoryPage: React.FC<CategoryPageProps> = async ({ params }) => {
    if (params.categoryId === 'new') {
        return (
            <div className="flex-col">
                <div className="">
                    <CategoryForm initialData={null} />
                </div>
            </div>
        );
    }

    const category = await prismadb.category.findUnique({
        where: {
            id: params.categoryId,
        },
    });

    return (
        <div className="flex-col">
            <div className="flex-1 ">
                <CategoryForm initialData={category} />
            </div>
        </div>
    );
};

export default CategoryPage;
