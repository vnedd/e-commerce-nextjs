'use client';
import { Button } from '@/components/ui/button';
import useCurrentUser from '@/hooks/use-current-user';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react';
import { AiOutlineHome } from 'react-icons/ai';
interface AuthLayoutProps {
    children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
    const { data: user } = useCurrentUser();

    if (user) {
        redirect('/');
    }

    return (
        <div className="relative h-full w-full flex items-center justify-center bg-slate-100 bg-[url('/wave.svg')] bg-no-repeat bg-cover bg-top">
            <Button className="absolute top-2 left-2 " variant={'ghost'}>
                <Link href={'/'} className="flex items-center gap-x-2">
                    <AiOutlineHome size={18} />
                    Home Page
                </Link>
            </Button>
            {children}
        </div>
    );
};

export default AuthLayout;
