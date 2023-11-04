import { NextResponse } from 'next/server';

import prismadb from '@/lib/prismadb'

export async function POST(req: Request, { params }: { params: { userId: string } }) {

    try {
        const body = await req.json();

        const { isSeller } = body;

        if (!params.userId) {
            throw new Error("User id not provided")
        }

        const user = await prismadb.user.findUnique({
            where: {
                id: params.userId
            }
        })

        if (!user) {
            return new NextResponse(`No User found with the given ID`, { status: 404 })
        }

        if (user?.isSeller) {
            return new NextResponse('You are already a seller', { status: 200 })
        }
        // Update the user to be a seller
        const updateUser = await prismadb.user.update({
            where: {
                id: params.userId
            }, data: {
                isSeller
            }
        })

        return NextResponse.json(updateUser, { status: 200 })


    } catch (error) {
        return NextResponse.json('REGISTE_SELLER_FAILED', { status: 500 })
    }
}