import { Store } from '@prisma/client';
import Image from 'next/image';
import React from 'react';

interface StoreBannerProps {
    data: Store;
}

const StoreBanner: React.FC<StoreBannerProps> = ({ data }) => {
    return (
        <div className="w-full lg:h-[400px] md:h-[350px] h-[200px] flex items-center justify-center relative">
            <Image
                src={data.storeBannerUrl || '/placeholder-store-banner.svg'}
                alt="Store banner"
                className="w-full lg:h-[400px] md:h-[350px] h-[200px] object-cover"
                fill
            />
        </div>
    );
};

export default StoreBanner;
