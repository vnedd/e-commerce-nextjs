import React from 'react';
import Logo from '@/components/logo';
import MainNav from './mainnav';
import AuthActions from './auth-actions';

const Navbar = () => {
    return (
        <div className="h-full w-full flex items-center gap-x-8">
            <Logo />
            <MainNav />
            <AuthActions />
        </div>
    );
};

export default Navbar;
