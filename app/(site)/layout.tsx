import Container from '@/components/container';
import Navbar from '@/components/navbar/navbar';
import React from 'react';

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    return (
        <div className="h-full w-full">
            <div className="w-full h-20 border-b shadow-md fixed top-0 left-0 z-40 bg-white">
                <Container>
                    <Navbar />
                </Container>
            </div>
            <div className="w-full h-screen mt-[80px]">{children}</div>
        </div>
    );
};

export default MainLayout;
