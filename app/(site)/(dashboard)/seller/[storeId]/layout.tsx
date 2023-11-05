import React from 'react';
import SideBar from './components/sidebar';

interface StoreLayoutProps {
    children: React.ReactNode;
}

const StoreLayout: React.FC<StoreLayoutProps> = ({ children }) => {
    return (
        <div className="flex flex-row fixed top-[80px] bottom-0 w-full">
            <div className="h-full lg:w-3/12 md:w-1/3 border-r border-neutral-200">
                <SideBar />
            </div>
            <div className="w-full overflow-y-auto p-6">{children}</div>
        </div>
    );
};

export default StoreLayout;
