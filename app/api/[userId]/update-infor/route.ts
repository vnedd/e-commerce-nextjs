
import prismadb from '@/lib/prismadb'
import { NextResponse } from 'next/server';


export async function POST(req: Request, { params }: { params: { userId: string } }) {

    try {

        const body = await req.json();

        const { name, image } = body

        if (!params.userId) {
            throw new Error("User id not provided")
        }

        const user = await prismadb.user.findUnique({
            where: {
                id: params.userId
            }
        })

        if (!user) {
            return new Response(`No User found with the given ID`, { status: 404 })
        }
        let updated_image;
        let updated_name;

        if (name) {
            updated_name = name;
        } else {
            updated_name = user.name;
        }
        if (image) {
            updated_image = image
        } else {
            updated_image = user.image
        }
        // Update user in database

        const updateUser = await prismadb.user.updateMany({
            where: {
                id: params.userId
            },
            data: {
                name: updated_name,
                image: updated_image
            }
        })
        return NextResponse.json(updateUser, { status: 200 })
    } catch (error) {
        NextResponse.json('UPDATE_INFORMATION_FAILED', { status: 500 })
    }
}