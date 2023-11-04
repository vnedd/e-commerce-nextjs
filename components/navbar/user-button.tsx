'use client';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import { AiOutlineMenu, AiOutlineMessage } from 'react-icons/ai';
import { LiaStoreAltSolid } from 'react-icons/lia';
import { BiHelpCircle } from 'react-icons/bi';
import { PiNotebookBold } from 'react-icons/pi';
import { CgLogOut } from 'react-icons/cg';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link';
import useCurrentUser from '@/hooks/use-current-user';
import UserAvatar from '../user-avatar';

const UserButton = () => {
    const { data: user } = useCurrentUser();

    const router = useRouter();
    const userMenu = [
        {
            label: 'Wishlists',
            icon: PiNotebookBold,
            href: `/${user?.id}/wishlist`,
        },
        {
            label: 'Messages',
            icon: AiOutlineMessage,
            href: `/${user?.id}/message`,
        },
    ];

    const handleLogout = async () => {
        await signOut({ callbackUrl: '/sign-in' });
        toast.success('You have been logged out');
        router.push('/sign-in');
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="outline-none ring-0">
                <div className="bg-white px-6 py-3 rounded-full cursor-pointer border-neutral-700 border-1 shadow-sm hover:shadow-md flex items-center flex-row gap-x-3">
                    <AiOutlineMenu size={18} />
                    <UserAvatar href={user?.image || '/placeholder.png'} size={50} />
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[240px]">
                {user ? (
                    <>
                        <DropdownMenuLabel>
                            <div className="flex flex-row items-center gap-x-3">
                                <UserAvatar href={user?.image || '/placeholder.png'} size={60} className="w-10 h-10" />
                                <div>
                                    <h6 className="text-md">{user.name}</h6>
                                    <Link href={`/${user.id}`} className="text-sm font-normal  text-neutral-500">
                                        View your profile
                                    </Link>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {userMenu.map((item) => {
                            const Icon = item.icon;
                            return (
                                <DropdownMenuItem key={item.label}>
                                    <Link href={item.href} className="flex items-center gap-x-3">
                                        <Icon size={18} />
                                        {item.label}
                                    </Link>
                                </DropdownMenuItem>
                            );
                        })}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer flex items-center gap-x-3">
                            <BiHelpCircle size={18} />
                            Help center
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer flex items-center gap-x-3" onClick={handleLogout}>
                            <CgLogOut size={18} />
                            Sign out
                        </DropdownMenuItem>
                    </>
                ) : (
                    <>
                        <DropdownMenuItem className="cursor-pointer">
                            <Link className="w-full h-full" href="/sign-up">
                                Sign up
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                            <Link className="w-full h-full" href="/sign-in">
                                Login
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer flex items-center gap-x-3">
                            <BiHelpCircle size={18} />
                            Help center
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default UserButton;
