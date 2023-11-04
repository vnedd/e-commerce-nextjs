"use client"
import useSwr from 'swr'

import fetcher from '@/lib/fetcher';
import { useSession } from 'next-auth/react';

const useCurrentUser = () => {
    const session = useSession();
    const logined = !!session?.data?.user

    const { data, error, isLoading, mutate } = useSwr(logined ? '/api/current-user' : null, fetcher);
    return {
        data,
        error,
        isLoading,
        mutate,
    }
};

export default useCurrentUser;