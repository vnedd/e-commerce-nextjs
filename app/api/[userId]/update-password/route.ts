
import prismadb from '@/lib/prismadb'
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt'

export async function POST(req: Request, { params }: { params: { userId: string } }) {

    try {

        const body = await req.json();

        const { currentPassword, password } = body

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

        if (!user?.hashedPassword) {
            return new NextResponse(`You are login with provider account, could not change you password!`, { status: 404 })
        }

        const isCorrectPassword = await bcrypt.compare(currentPassword, user.hashedPassword);

        if (!isCorrectPassword) {
            return new NextResponse('Incorrect Password! Please try again!', { status: 401 });
        }
        // Hashing the new Password
        const hashedPassword = await bcrypt.hash(password, 12);
        // Updating the User in DB
        const updateUser = await prismadb.user.update({
            where: {
                id: params.userId
            }, data: {
                hashedPassword
            }
        })

        return NextResponse.json(updateUser, { status: 200 })
    } catch (error) {
        NextResponse.json('UPDATE_PASSWORD_FAILED', { status: 200 })
    }
}