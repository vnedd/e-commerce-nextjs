'use client';

import { useEffect } from 'react';

import { useStoreModal } from '@/hooks/use-store-modal';
import useCurrentStore from '@/hooks/use-current-store';
import { redirect } from 'next/navigation';

const SetupPage = () => {
    const { data: store } = useCurrentStore();
    const onOpen = useStoreModal((state) => state.onOpen);
    const isOpen = useStoreModal((state) => state.isOpen);

    if (store) {
        redirect(`/seller/${store.id}`);
    }

    useEffect(() => {
        if (!isOpen && !store) {
            onOpen();
        }
    }, [isOpen, onOpen, store]);

    return null;
};

export default SetupPage;
