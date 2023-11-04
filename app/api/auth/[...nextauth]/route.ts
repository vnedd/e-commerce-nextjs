import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from 'next-auth/providers/google'
import { compare } from 'bcrypt'
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prismadb from '@/lib/prismadb'
import type { NextAuthOptions } from "next-auth"

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prismadb),
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
        }),
        CredentialsProvider({
            id: 'credentials',
            name: 'Credentials',
            credentials: {
                email: {
                    label: 'Email',
                    type: 'text',
                },
                password: {
                    label: 'Password',
                    type: 'passord'
                }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Email and password required');
                }

                const user = await prismadb.user.findUnique({
                    where: {
                        email: credentials.email
                    }
                });

                if (!user || !user.hashedPassword) {
                    throw new Error('Email does not exist');
                }

                const isCorrectPassword = await compare(credentials.password, user.hashedPassword);

                if (!isCorrectPassword) {
                    throw new Error('Incorrect password');
                }

                if (user) return user
                else return null
            }
        })
    ],
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV !== "production",
    session: {
        strategy: "jwt",
    },
    jwt: {
        secret: process.env.NEXTAUTH_JWT_SECRET
    },
    pages: {
        signIn: '/sign-in'
    }
}
const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }