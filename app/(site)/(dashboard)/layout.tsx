'use client';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

interface DashboadLayoutProps {
    children: React.ReactNode;
}

const DashboadLayout: React.FC<DashboadLayoutProps> = ({ children }) => {
    const { data: session } = useSession();
    if (session && session.user) {
        return <>{children}</>;
    }

    redirect('/sign-in');
};

export default DashboadLayout;
