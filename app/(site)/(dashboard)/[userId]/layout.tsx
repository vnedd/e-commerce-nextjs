'use client';
import React from 'react';
import SideBar from './components/sidebar';

interface UserLayoutProps {
    children: React.ReactNode;
}

const UserLayout: React.FC<UserLayoutProps> = ({ children }) => {
    return (
        <div className="flex flex-row fixed top-[80px] bottom-0 w-full">
            <div className="h-full lg:w-1/5 md:w-1/3 border-r border-neutral-200">
                <SideBar />
            </div>
            <div className="w-full overflow-y-auto">{children}</div>
        </div>
    );
};

export default UserLayout;
