import { AiOutlinePlusCircle } from 'react-icons/ai';
import Heading from '@/components/heading';
import { Separator } from '@/components/ui/separator';
import { ProductColumn } from './components/column';
import { Product } from '@prisma/client';
import prismadb from '@/lib/prismadb';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import ProductClient from './components/product-client';
import { formatter } from '@/lib/utils';

interface StoreProductsPageProps {
    params: {
        storeId: string;
    };
}

const StoreProductsPage: React.FC<StoreProductsPageProps> = async ({ params }) => {
    const products = await prismadb.product.findMany({
        where: {
            storeId: params.storeId,
        },
        orderBy: {
            createdAt: 'desc',
        },
        include: {
            productColor: true,
            productSize: true,
            images: true,
        },
    });

    const formattedProducts: ProductColumn[] = products.map((item: Product) => ({
        id: item.id,
        name: item.name,
        price: formatter.format(item.price),
        category: item.name,
        isFeatured: item.isFeatured,
        createdAt: format(item.createdAt, 'MMMM do, yyyy'),
    }));

    return (
        <div className="flex flex-col space-y-6">
            <div className="flex justify-between">
                <Heading title="Store Colors" subTitle="Add and update your store size!" />
                <Link href={`/seller/${params.storeId}/products/new`}>
                    <Button className="rounded-full">
                        <AiOutlinePlusCircle className="w-4 h-4" />
                        <p className="ml-2">Add new products</p>
                    </Button>
                </Link>
            </div>
            <Separator className="my-6" />
            <ProductClient data={formattedProducts} />
        </div>
    );
};

export default StoreProductsPage;
