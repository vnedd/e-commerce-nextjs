import { NextResponse } from "next/server"
import prismadb from '@/lib/prismadb'

export async function GET(req: Request, { params }: { params: { sizeId: string } }) {
    try {

        if (!params.sizeId) {
            return new Response('Size id is missing', { status: 400 })
        }

        const size = await prismadb.size.findUnique({
            where: {
                id: params.sizeId
            }
        });

        return NextResponse.json(size, { status: 200 });

    } catch (error) {
        console.log(error)
        return NextResponse.json("SIZE_PATCH", { status: 500 })
    }
}


export async function DELETE(req: Request, { params }: { params: { sizeId: string, storeId: string, userId: string } }) {
    try {

        if (!params.storeId) {
            return new NextResponse("Store ID not found", { status: 400 });
        }
        if (!params.userId) {
            return new NextResponse("User ID not found", { status: 400 });
        }
        if (!params.sizeId) {
            return new NextResponse("Size Id not found", { status: 400 })
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

        const size = await prismadb.size.delete({
            where: {
                id: params.sizeId,
            }
        });

        return NextResponse.json(size);

    } catch (error) {
        console.log(error)
        return NextResponse.json("size_DELETE", { status: 500 })
    }
}

export async function PATCH(req: Request, { params }: { params: { sizeId: string, storeId: string, userId: string } }) {
    try {

        const body = await req.json();
        const { name, value } = body

        if (!name) {
            return new Response("size name is required", { status: 400 })
        }
        if (!value) {
            return new Response("size value is required", { status: 400 })
        }
        if (!params.storeId) {
            return new NextResponse("Store ID not found", { status: 400 });
        }
        if (!params.userId) {
            return new NextResponse("User ID not found", { status: 400 });
        }
        if (!params.sizeId) {
            return new NextResponse("size Id not found", { status: 400 })
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

        const sizeExists = await prismadb.size.findUnique({
            where: {
                id: params.sizeId
            }
        });

        if (!sizeExists) {
            return new NextResponse("size does not exist.", { status: 404 });
        }

        const newsize = await prismadb.size.updateMany({
            where: {
                id: params.sizeId
            },
            data: {
                name,
                value
            }
        })

        return NextResponse.json(newsize, { status: 200 });

    } catch (error) {
        console.log(error)
        return NextResponse.json("size_PATCH", { status: 500 })
    }
}