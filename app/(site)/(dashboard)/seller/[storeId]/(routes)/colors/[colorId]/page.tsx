import React from 'react';
import prismadb from '@/lib/prismadb';
import SizeForm from './components/color-form';

interface ColorPageProps {
    params: {
        colorId: string;
    };
}

const SizePage: React.FC<ColorPageProps> = async ({ params }) => {
    if (params.colorId === 'new') {
        return (
            <div className="flex-col">
                <div className="">
                    <SizeForm initialData={null} />
                </div>
            </div>
        );
    }

    const color = await prismadb.color.findUnique({
        where: {
            id: params.colorId,
        },
    });

    return (
        <div className="flex-col">
            <div className="flex-1 ">
                <SizeForm initialData={color} />
            </div>
        </div>
    );
};

export default SizePage;
