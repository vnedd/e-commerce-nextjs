import { NextResponse } from "next/server";
import prismadb from '@/lib/prismadb'

export async function POST(req: Request, { params }: { params: { storeId: string, userId: string } }) {
    try {
        const body = await req.json();
        const { name, value } = body

        if (!name) { return new NextResponse("Color name is required", { status: 400 }); }
        if (!value) {
            return new NextResponse('Value for color is required', { status: 400 })
        }

        if (!params.storeId) {
            return new NextResponse("Store ID not found", { status: 400 });
        }
        if (!params.userId) {
            return new NextResponse("User ID not found", { status: 400 });
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

        const color = await prismadb.color.create({
            data: {
                name,
                value,
                storeId: params.storeId

            }
        })
        return NextResponse.json(color, { status: 200 });

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

        const colors = await prismadb.color.findMany({
            where: {
                storeId: params.storeId
            }
        })
        return NextResponse.json(colors, { status: 200 });

    } catch (error) {
        console.log('[CATEGORIES_POST]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}
