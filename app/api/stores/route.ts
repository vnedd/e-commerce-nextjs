import { NextResponse } from "next/server";
import prismadb from '@/lib/prismadb'
export async function POST(req: Request) {
    try {

        const body = await req.json();
        const { name, userId, email } = body

        if (!name) {
            return new Response("Name is required", { status: 401 })
        }
        if (!userId) {
            return new Response("User ID is required", { status: 402 })
        }
        if (!email) {
            return new Response("Email is required", { status: 403 })
        }

        const user = await prismadb.user.findFirst({
            where: {
                email
            }
        })
        if (!user) {
            return new Response('No User Found', { status: 403 })
        }

        const store = await prismadb.store.create({
            data: {
                name,
                userId,
            }
        })
        return NextResponse.json(store, { status: 200 })


    } catch (error) {
        console.log(error)
        return NextResponse.json("STORE_POST", { status: 500 })
    }
}