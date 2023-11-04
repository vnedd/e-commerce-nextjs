'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
const Logo = () => {
    const router = useRouter();
    return (
        <Image
            width={35}
            height={35}
            src={'/logo.svg'}
            alt="logo"
            onClick={() => router.push('/')}
            className="cursor-pointer"
        />
    );
};

export default Logo;
