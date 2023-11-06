import { redirect } from 'next/navigation';
import StoreBanner from './components/store-banner';
import prismadb from '@/lib/prismadb';
import StoreTopInfor from './components/store-top-infor';
interface StorePeopleViewPageProps {
    params: {
        storeId: string;
    };
}

const StorePeopleViewPage: React.FC<StorePeopleViewPageProps> = async ({ params }) => {
    const store = await prismadb.store.findFirst({
        where: {
            id: params.storeId,
        },
    });

    if (!store) {
        redirect('/');
    }

    const user = await prismadb.user.findFirst({
        where: {
            id: store.userId,
        },
    });

    return (
        <div className="w-full">
            <StoreBanner data={store} />
            <StoreTopInfor data={store} user={user!} />
            <div></div>
        </div>
    );
};

export default StorePeopleViewPage;
