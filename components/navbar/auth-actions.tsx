import React from 'react';
import { Button } from '../ui/button';
import { AiOutlineHeart, AiOutlineShoppingCart } from 'react-icons/ai';
import UserButton from './user-button';
const AuthActions = () => {
    return (
        <div className="ml-auto flex items-center gap-x-3">
            <Button variant="ghost" size="icon" className="rounded-full">
                <AiOutlineHeart size={20} />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
                <AiOutlineShoppingCart size={20} />
            </Button>
            <UserButton />
        </div>
    );
};

export default AuthActions;
