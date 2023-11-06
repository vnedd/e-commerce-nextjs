import { NextResponse } from "next/server"
import prismadb from '@/lib/prismadb'

export async function GET(req: Request, { params }: { params: { colorId: string } }) {
    try {

        if (!params.colorId) {
            return new Response('color id is missing', { status: 400 })
        }

        const color = await prismadb.color.findUnique({
            where: {
                id: params.colorId
            }
        });

        return NextResponse.json(color, { status: 200 });

    } catch (error) {
        console.log(error)
        return NextResponse.json("color_get", { status: 500 })
    }
}


export async function DELETE(req: Request, { params }: { params: { colorId: string, storeId: string, userId: string } }) {
    try {

        if (!params.storeId) {
            return new NextResponse("Store ID not found", { status: 400 });
        }
        if (!params.userId) {
            return new NextResponse("User ID not found", { status: 400 });
        }
        if (!params.colorId) {
            return new NextResponse("color Id not found", { status: 400 })
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

        const color = await prismadb.color.delete({
            where: {
                id: params.colorId,
            }
        });

        return NextResponse.json(color);

    } catch (error) {
        console.log(error)
        return NextResponse.json("color_DELETE", { status: 500 })
    }
}

export async function PATCH(req: Request, { params }: { params: { colorId: string, storeId: string, userId: string } }) {
    try {

        const body = await req.json();
        const { name, value } = body

        if (!name) {
            return new Response("color name is required", { status: 400 })
        }
        if (!value) {
            return new Response("color value is required", { status: 400 })
        }
        if (!params.storeId) {
            return new NextResponse("Store ID not found", { status: 400 });
        }
        if (!params.userId) {
            return new NextResponse("User ID not found", { status: 400 });
        }
        if (!params.colorId) {
            return new NextResponse("color Id not found", { status: 400 })
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

        const colorExists = await prismadb.color.findUnique({
            where: {
                id: params.colorId
            }
        });

        if (!colorExists) {
            return new NextResponse("color does not exist.", { status: 404 });
        }

        const newcolor = await prismadb.color.updateMany({
            where: {
                id: params.colorId
            },
            data: {
                name,
                value
            }
        })

        return NextResponse.json(newcolor, { status: 200 });

    } catch (error) {
        console.log(error)
        return NextResponse.json("color_PATCH", { status: 500 })
    }
}