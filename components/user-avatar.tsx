import { cn } from '@/lib/utils';
import Image from 'next/image';
import React from 'react';

interface UserAvatarProps {
    alt?: string;
    href: string;
    size: number;
    className?: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ alt = 'User Avatar', href, size, className }) => {
    return (
        <div
            className={cn('rounded-full w-8 h-8 flex items-center justify-center overflow-hidden bg-white', className)}
        >
            <Image src={href} width={size} height={size} alt={alt} className="ml-1" />;
        </div>
    );
};

export default UserAvatar;
