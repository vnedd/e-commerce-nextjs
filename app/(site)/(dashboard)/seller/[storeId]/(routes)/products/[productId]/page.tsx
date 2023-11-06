import React from 'react';
import prismadb from '@/lib/prismadb';
import ProductForm from './components/product-form';

interface ProductPageProps {
    params: {
        productId: string;
        storeId: string;
    };
}

const ProductPage: React.FC<ProductPageProps> = async ({ params }) => {
    const categories = await prismadb.category.findMany({
        where: {
            storeId: params.storeId,
        },
    });

    const sizes = await prismadb.size.findMany({
        where: {
            storeId: params.storeId,
        },
    });

    const colors = await prismadb.color.findMany({
        where: {
            storeId: params.storeId,
        },
    });

    if (params.productId === 'new') {
        return (
            <div className="flex-col">
                <div className="">
                    <ProductForm initialData={null} categories={categories} colors={colors} sizes={sizes} />
                </div>
            </div>
        );
    }

    const product = await prismadb.product.findUnique({
        where: {
            id: params.productId,
        },
        include: {
            productColor: true,
            productSize: true,
            images: true,
        },
    });

    return (
        <div className="flex-col">
            <div className="flex-1 ">
                <ProductForm initialData={product} categories={categories} colors={colors} sizes={sizes} />
            </div>
        </div>
    );
};

export default ProductPage;
