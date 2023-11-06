import { redirect } from 'next/navigation';
import prismadb from '@/lib/prismadb';

const StorePeopleViewLayout = async ({
    children,
    params,
}: {
    children: React.ReactNode;
    params: { storeId: string };
}) => {
    const store = await prismadb.store.findFirst({
        where: {
            id: params.storeId,
        },
    });

    if (!store) {
        redirect('/');
    }

    return <>{children}</>;
};

export default StorePeopleViewLayout;
