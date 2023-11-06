import React from 'react';
import prismadb from '@/lib/prismadb';
import SizeForm from './components/size-form';

interface SizePageProps {
    params: {
        sizeId: string;
    };
}

const SizePage: React.FC<SizePageProps> = async ({ params }) => {
    if (params.sizeId === 'new') {
        return (
            <div className="flex-col">
                <div className="">
                    <SizeForm initialData={null} />
                </div>
            </div>
        );
    }

    const Size = await prismadb.size.findUnique({
        where: {
            id: params.sizeId,
        },
    });

    return (
        <div className="flex-col">
            <div className="flex-1 ">
                <SizeForm initialData={Size} />
            </div>
        </div>
    );
};

export default SizePage;
