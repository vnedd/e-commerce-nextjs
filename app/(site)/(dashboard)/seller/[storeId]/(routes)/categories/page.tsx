import { AiOutlinePlusCircle } from 'react-icons/ai';
import Heading from '@/components/heading';
import { Separator } from '@/components/ui/separator';
import CategoriesClient from './components/categoris-client';
import { CategoriesColumn } from './components/column';
import { Category } from '@prisma/client';
import prismadb from '@/lib/prismadb';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface StoreCategoriesPageProps {
    params: {
        storeId: string;
    };
}

const StoreCategoriesPage: React.FC<StoreCategoriesPageProps> = async ({ params }) => {
    const categories = await prismadb.category.findMany({
        where: {
            storeId: params.storeId,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    const formattedCategories: CategoriesColumn[] = categories.map((item: Category) => ({
        id: item.id,
        name: item.name,
        createdAt: format(item.createdAt, 'MMMM do, yyyy'),
    }));

    return (
        <div className="flex flex-col space-y-6">
            <div className="flex justify-between">
                <Heading title="Store Categories" subTitle="Add and update your store category!" />
                <Link href={`/seller/${params.storeId}/categories/new`}>
                    <Button className="rounded-full">
                        <AiOutlinePlusCircle className="w-4 h-4" />
                        <p className="ml-2">Add new category</p>
                    </Button>
                </Link>
            </div>
            <Separator className="my-6" />
            <CategoriesClient data={formattedCategories} />
        </div>
    );
};

export default StoreCategoriesPage;
