import { NextResponse } from "next/server"
import prismadb from '@/lib/prismadb'

export async function GET(req: Request, { params }: { params: { categoryId: string } }) {
    try {

        if (!params.categoryId) {
            return new Response('Category id is missing', { status: 400 })
        }

        const categoryExists = await prismadb.category.findUnique({
            where: {
                id: params.categoryId
            }
        });

        if (!categoryExists) {
            return new NextResponse("Category does not exist.", { status: 404 });
        }

        return NextResponse.json(categoryExists, { status: 200 });

    } catch (error) {
        console.log(error)
        return NextResponse.json("CATEGORY_PATCH", { status: 500 })
    }
}


export async function DELETE(req: Request, { params }: { params: { categoryId: string, storeId: string, userId: string } }) {
    try {

        if (!params.storeId) {
            return new NextResponse("Store ID not found", { status: 400 });
        }
        if (!params.userId) {
            return new NextResponse("User ID not found", { status: 400 });
        }
        if (!params.categoryId) {
            return new NextResponse("Category Id not found", { status: 400 })
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

        const category = await prismadb.category.delete({
            where: {
                id: params.categoryId,
            }
        });

        return NextResponse.json(category);

    } catch (error) {
        console.log(error)
        return NextResponse.json("CATEGORY_PATCH", { status: 500 })
    }
}

export async function PATCH(req: Request, { params }: { params: { categoryId: string, storeId: string, userId: string } }) {
    try {

        const body = await req.json();
        const { name } = body

        if (!name) {
            return new Response("Category name is required", { status: 400 })
        }
        if (!params.storeId) {
            return new NextResponse("Store ID not found", { status: 400 });
        }
        if (!params.userId) {
            return new NextResponse("User ID not found", { status: 400 });
        }
        if (!params.categoryId) {
            return new NextResponse("Category Id not found", { status: 400 })
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

        const categoryExists = await prismadb.category.findUnique({
            where: {
                id: params.categoryId
            }
        });

        if (!categoryExists) {
            return new NextResponse("Category does not exist.", { status: 404 });
        }

        const newCategory = await prismadb.category.update({
            where: {
                id: params.categoryId
            },
            data: {
                name
            }
        })

        return NextResponse.json(newCategory, { status: 200 });

    } catch (error) {
        console.log(error)
        return NextResponse.json("CATEGORY_PATCH", { status: 500 })
    }
}