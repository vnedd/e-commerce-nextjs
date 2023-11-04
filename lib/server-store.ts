import { getServerSession } from "next-auth";

import prismadb from '@/lib/prismadb';
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const serverStore = async () => {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        throw new Error('Not signed in');
    }

    const currentUser = await prismadb.user.findUnique({
        where: {
            email: session.user.email,
        }
    });

    if (!currentUser) {
        throw new Error('Not signed in');
    }

    const store = await prismadb.store.findFirst({
        where: {
            userId: currentUser.id
        }
    })
    return { store }
}

export default serverStore;