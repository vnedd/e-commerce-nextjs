'use client';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

const MainNav = () => {
    const pathname = usePathname();
    const routes = [
        {
            label: 'Shop',
            href: '/shop',
            active: pathname === '/shop',
        },
        {
            label: 'Brands',
            href: '/brand',
            active: pathname === '/brand',
        },
        {
            label: 'Blogs',
            href: '/blogs',
            active: pathname === '/blogs',
        },
        {
            label: 'Contact',
            href: '/contact',
            active: pathname === '/contact',
        },
        {
            label: 'About Us',
            href: '/about',
            active: pathname === '/about',
        },
    ];
    return (
        <div className="flex items-center space-x-4">
            {routes.map((route) => (
                <Link
                    key={route.label}
                    href={route.href}
                    className={cn(
                        'font-medium text-sm text-neutral-400 hover:text-violet-700',
                        route.active && 'text-violet-700',
                    )}
                >
                    {route.label}
                </Link>
            ))}
        </div>
    );
};

export default MainNav;
