'use client';
import { usePathname } from 'next/navigation';
import { LuLayoutDashboard } from 'react-icons/lu';
import { IoSettingsOutline } from 'react-icons/io5';
import { MdOutlineCategory } from 'react-icons/md';
import { BsBoxes } from 'react-icons/bs';
import { IoIosResize } from 'react-icons/io';
import { GiPaintBucket } from 'react-icons/gi';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { BiLogOutCircle } from 'react-icons/bi';
import { signOut } from 'next-auth/react';
import Logo from '@/components/logo';
import useCurrentStore from '@/hooks/use-current-store';

const SideBar = () => {
    const { data: store } = useCurrentStore();
    const pathname = usePathname();
    let routes = [
        {
            path: `/seller/${store?.id}`,
            name: ' Dashboard',
            icon: LuLayoutDashboard,
            active: pathname === `/seller/${store?.id}`,
        },
        {
            path: `/seller/${store?.id}/categories`,
            name: 'Categories',
            icon: MdOutlineCategory,
            active: pathname.startsWith(`/seller/${store?.id}/categories`),
        },
        {
            path: `/seller/${store?.id}/sizes`,
            name: 'Sizes',
            icon: IoIosResize,
            active: pathname.startsWith(`/seller/${store?.id}/sizes`),
        },
        {
            path: `/seller/${store?.id}/colors`,
            name: 'Colors',
            icon: GiPaintBucket,
            active: pathname.startsWith(`/seller/${store?.id}/colors`),
        },
        {
            path: `/seller/${store?.id}/products`,
            name: 'Products',
            icon: BsBoxes,
            active: pathname.startsWith(`/seller/${store?.id}/products`),
        },
        {
            path: `/seller/${store?.id}/settings`,
            name: ' Store Settings',
            icon: IoSettingsOutline,
            active: pathname === `/seller/${store?.id}/settings`,
        },
    ];

    return (
        <div className="h-full flex flex-col items-center justify-between relative">
            <div className="w-full h-auto overflow-y-auto mt-1">
                <div className="w-full px-2 py-4 flex items-center justify-center md:justify-start flex-row gap-x-3 mb-4">
                    <Logo />
                    <h3 className="font-bold sm:text-sm lg:text-md text-violet-900 hidden md:block">Nedd E-commerce</h3>
                </div>
                {routes.map((route) => {
                    const Icon = route.icon;
                    return (
                        <div
                            key={route.name}
                            className={cn(
                                'p-4 bg-opacity-5 w-full hover:bg-violet-400 hover:bg-opacity-5 hover:text-violet-900 transition font-medium cursor-pointer',
                                route.active &&
                                    'border-r-4 border-violet-400 bg-violet-400 bg-opacity-5 text-violet-900',
                            )}
                        >
                            <Link href={route.path} className="flex items-center gap-x-3 w-full h-full">
                                <Icon size={20} />
                                <p className="hidden md:block font-semibold text-sm">{route.name}</p>
                            </Link>
                        </div>
                    );
                })}
                <div
                    className="flex items-center px-3 py-4 bg-opacity-5 w-full hover:bg-violet-400 hover:bg-opacity-5 transition font-medium cursor-pointer absolute bottom-0"
                    onClick={() => signOut({ callbackUrl: '/' })}
                >
                    <BiLogOutCircle size={20} />
                    <p className="ml-3 hidden md:block">Log out</p>
                </div>
            </div>
        </div>
    );
};

export default SideBar;
