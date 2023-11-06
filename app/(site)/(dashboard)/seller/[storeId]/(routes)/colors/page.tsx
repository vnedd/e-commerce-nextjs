import { AiOutlinePlusCircle } from 'react-icons/ai';
import Heading from '@/components/heading';
import { Separator } from '@/components/ui/separator';
import { ColorsColumn } from './components/column';
import { Size } from '@prisma/client';
import prismadb from '@/lib/prismadb';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import ColorsClient from './components/color-client';

interface StoreColorPageProps {
    params: {
        storeId: string;
    };
}

const StoreColorPage: React.FC<StoreColorPageProps> = async ({ params }) => {
    const colors = await prismadb.color.findMany({
        where: {
            storeId: params.storeId,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    const formattedColors: ColorsColumn[] = colors.map((item: Size) => ({
        id: item.id,
        name: item.name,
        value: item.value,
        createdAt: format(item.createdAt, 'MMMM do, yyyy'),
    }));

    return (
        <div className="flex flex-col space-y-6">
            <div className="flex justify-between">
                <Heading title="Store Colors" subTitle="Add and update your store size!" />
                <Link href={`/seller/${params.storeId}/colors/new`}>
                    <Button className="rounded-full">
                        <AiOutlinePlusCircle className="w-4 h-4" />
                        <p className="ml-2">Add new color</p>
                    </Button>
                </Link>
            </div>
            <Separator className="my-6" />
            <ColorsClient data={formattedColors} />
        </div>
    );
};

export default StoreColorPage;
