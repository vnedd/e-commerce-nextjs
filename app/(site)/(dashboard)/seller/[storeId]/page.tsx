'use client';
import { useStoreModal } from '@/hooks/use-store-modal';
import React, { useEffect } from 'react';

const StorePage = () => {
    const onClose = useStoreModal((state) => state.onClose);
    const isOpen = useStoreModal((state) => state.isOpen);
    useEffect(() => {
        if (isOpen) {
            onClose();
        }
    }, [isOpen, onClose]);

    return <div>Dashboard page</div>;
};

export default StorePage;
