import { NextResponse } from "next/server";
import prismadb from '@/lib/prismadb'

export async function POST(req: Request, { params }: { params: { storeId: string, userId: string } }) {
    try {
        const body = await req.json();
        const { name, price, images, categoryId, sizes, colors, isFeatured } = body

        if (!name) { return new NextResponse("Color name is required", { status: 400 }); }

        if (!categoryId) {
            return new NextResponse('Category id is required', { status: 400 },);
        }

        if (!price) {
            return new NextResponse('Price is required', { status: 400 });
        }
        if (!images || !images.length) {
            return new NextResponse("Images are required", { status: 400 });
        }

        if (!sizes || !sizes.length) {
            return new NextResponse("Sizes are required", { status: 400 });
        }

        if (!colors || !colors.length) {
            return new NextResponse("Colors are required", { status: 400 });
        }

        if (!params.userId) {
            return new NextResponse("User ID not found", { status: 400 });
        }

        if (!params.storeId) {
            return new NextResponse("Store ID not found", { status: 400 });
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId: params.userId
            }
        });

        if (!storeByUserId) {
            return new NextResponse("Unauthorized", { status: 405 });
        }

        const product = await prismadb.product.create({
            data: {
                name,
                price,
                images: {
                    createMany: {
                        data: [
                            ...images.map((image: { url: string }) => image)
                        ]
                    }
                },
                categoryId,
                isFeatured: isFeatured || false,
                storeId: params.storeId
            }
        })

        await prismadb.productSize.createMany({
            data: [
                ...sizes.map((size: string) => ({
                    sizeId: size,
                    productId: product.id
                }))
            ]
        })
        await prismadb.productColor.createMany({
            data: [
                ...colors.map((color: string) => ({
                    colorId: color,
                    productId: product.id
                }))
            ]
        })

        return NextResponse.json(product, { status: 200 });

    } catch (error) {
        console.log('[color_POST]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function GET(req: Request, { params }: { params: { storeId: string } }) {
    try {
        if (!params.storeId) {
            return new NextResponse("Store ID not found", { status: 400 });
        }

        const products = await prismadb.product.findMany({
            where: {
                storeId: params.storeId
            }
        })
        return NextResponse.json(products, { status: 200 });

    } catch (error) {
        console.log('[CATEGORIES_POST]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}
