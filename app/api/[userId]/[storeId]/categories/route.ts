import { NextResponse } from "next/server";
import prismadb from '@/lib/prismadb'

export async function POST(req: Request, { params }: { params: { storeId: string, userId: string } }) {
    try {
        const body = await req.json();
        const { name } = body

        if (!name) { return new NextResponse("Category name is required", { status: 400 }); }

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

        const category = await prismadb.category.create({
            data: {
                name,
                storeId: params.storeId

            }
        })
        return NextResponse.json(category, { status: 200 });

    } catch (error) {
        console.log('[CATEGORIES_POST]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function GET(req: Request, { params }: { params: { storeId: string } }) {
    try {
        if (!params.storeId) {
            return new NextResponse("Store ID not found", { status: 400 });
        }

        const category = await prismadb.category.findMany({
            where: {
                storeId: params.storeId
            }
        })
        return NextResponse.json(category, { status: 200 });

    } catch (error) {
        console.log('[CATEGORIES_POST]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}
