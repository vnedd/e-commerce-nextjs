import { NextResponse } from "next/server";
import prismadb from '@/lib/prismadb'

export async function PATCH(req: Request, { params }: { params: { storeId: string, userId: string } }) {
    try {

        const body = await req.json();
        const { name, description, address, phone, storeAvatarUrl, storeBannerUrl } = body

        if (!name) {
            return new NextResponse("Name is required", { status: 401 })
        }

        const user = await prismadb.user.findFirst({
            where: {
                id: params.userId
            }
        })
        if (!user) {
            return new NextResponse('Unauthenticated', { status: 403 })
        }

        if (!params.storeId) {
            return new NextResponse('Store ID not found in URL parameters', { status: 500 })
        }


        const store = await prismadb.store.findFirst({
            where: {
                id: params.storeId
            }
        })

        if (!store) {
            return new NextResponse('No Store Found', { status: 404 })
        }

        const newStore = await prismadb.store.updateMany({
            where: {
                userId: params.userId
            },
            data: {
                name,
                description,
                address,
                phone,
                storeAvatarUrl,
                storeBannerUrl
            }
        })

        return NextResponse.json(newStore, { status: 200 })


    } catch (error) {
        console.log(error)
        return NextResponse.json("STORE_PATCH", { status: 500 })
    }
}