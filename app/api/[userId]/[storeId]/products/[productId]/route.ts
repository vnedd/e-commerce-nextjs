import { NextResponse } from "next/server"
import prismadb from '@/lib/prismadb'

export async function GET(req: Request, { params }: { params: { productId: string } }) {
    try {

        if (!params.productId) {
            return new Response('product id is missing', { status: 400 })
        }

        const product = await prismadb.product.findUnique({
            where: {
                id: params.productId
            }, include: {
                images: true,
                productColor: true,
                productSize: true,
            }
        });

        return NextResponse.json(product, { status: 200 });

    } catch (error) {
        console.log(error)
        return NextResponse.json("product_get", { status: 500 })
    }
}


export async function DELETE(req: Request, { params }: { params: { productId: string, storeId: string, userId: string } }) {
    try {

        if (!params.storeId) {
            return new NextResponse("Store ID not found", { status: 400 });
        }
        if (!params.userId) {
            return new NextResponse("User ID not found", { status: 400 });
        }
        if (!params.productId) {
            return new NextResponse("product Id not found", { status: 400 })
        }
        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId: params.userId,
            }
        });

        if (!storeByUserId) {
            return new NextResponse("Unauthorized", { status: 405 });
        }

        const product = await prismadb.product.delete({
            where: {
                id: params.productId,
            }
        });

        return NextResponse.json(product);

    } catch (error) {
        console.log(error)
        return NextResponse.json("product_DELETE", { status: 500 })
    }
}

export async function PATCH(req: Request, { params }: { params: { productId: string, storeId: string, userId: string } }) {
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
        if (!params.productId) {
            return new NextResponse("Product ID not found", { status: 400 });
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

        await prismadb.product.update({
            data: {
                name,
                price,
                images: {
                    deleteMany: {}
                },
                productColor: {
                    deleteMany: {}
                },
                productSize: {
                    deleteMany: {}
                },
                categoryId,
                isFeatured: isFeatured || false,
                storeId: params.storeId

            },
            where: {
                id: params.productId
            }
        })

        const product = await prismadb.product.update({
            data: {
                images: {
                    createMany: {
                        data: [
                            ...images.map((image: { url: string }) => image),
                        ],
                    },
                },
            },
            where: {
                id: params.productId
            },
        })

        await prismadb.productSize.createMany({
            data: [
                ...sizes.map((size: string) => ({
                    sizeId: size,
                    productId: params.productId
                }))
            ]
        })
        await prismadb.productColor.createMany({
            data: [
                ...colors.map((color: string) => ({
                    colorId: color,
                    productId: params.productId
                }))
            ]
        })

        return NextResponse.json(product, { status: 200 });
    } catch (error) {
        console.log(error)
        return NextResponse.json("Interner Invalid!", { status: 500 })
    }
}