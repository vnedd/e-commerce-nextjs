import bcrypt from 'bcrypt'
import { NextResponse } from 'next/server'

import prismadb from '@/lib/prismadb'

export async function POST(req: Request) {
    try {

        const { name, email, password } = await req.json()
        if (!name || !email || !password) throw new Error('Missing required fields')

        const existingUser = await prismadb.user.findUnique({
            where: {
                email
            }
        })

        if (existingUser) {
            return NextResponse.json("Email taken", { status: 422 })
        }

        const hashedPassword = await bcrypt.hash(password, 12)

        const user = await prismadb.user.create({
            data: {
                email,
                name,
                hashedPassword,
                image: '',
                emailVerified: new Date(),
            }
        })

        return NextResponse.json(user, { status: 200 })

    } catch (error) {
        console.log(error)
        return NextResponse.json("Register Error", { status: 500 })
    }
}
