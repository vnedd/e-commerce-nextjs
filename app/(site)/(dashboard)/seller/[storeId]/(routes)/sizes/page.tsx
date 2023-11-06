import { AiOutlinePlusCircle } from 'react-icons/ai';
import Heading from '@/components/heading';
import { Separator } from '@/components/ui/separator';
import { SizesColumn } from './components/column';
import { Size } from '@prisma/client';
import prismadb from '@/lib/prismadb';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import SizesClient from './components/size-client';

interface StoreSizePageProps {
    params: {
        storeId: string;
    };
}

const StoreSizePage: React.FC<StoreSizePageProps> = async ({ params }) => {
    const sizes = await prismadb.size.findMany({
        where: {
            storeId: params.storeId,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    const formattedSizes: SizesColumn[] = sizes.map((item: Size) => ({
        id: item.id,
        name: item.name,
        value: item.value,
        createdAt: format(item.createdAt, 'MMMM do, yyyy'),
    }));

    return (
        <div className="flex flex-col space-y-6">
            <div className="flex justify-between">
                <Heading title="Store Sizes" subTitle="Add and update your store size!" />
                <Link href={`/seller/${params.storeId}/sizes/new`}>
                    <Button className="rounded-full">
                        <AiOutlinePlusCircle className="w-4 h-4" />
                        <p className="ml-2">Add new size</p>
                    </Button>
                </Link>
            </div>
            <Separator className="my-6" />
            <SizesClient data={formattedSizes} />
        </div>
    );
};

export default StoreSizePage;
