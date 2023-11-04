'use client';

import Image from 'next/image';
import { CldUploadWidget } from 'next-cloudinary';
import { useEffect, useState } from 'react';
import { AiOutlineUpload } from 'react-icons/ai';

import { cn } from '@/lib/utils';
interface ImageUploadProps {
    disabled?: boolean;
    onChange: (value: string) => void;
    value: string;
}

const UserAvatarUpload: React.FC<ImageUploadProps> = ({ disabled, onChange, value }) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const onUpload = (result: any) => {
        onChange(result.info.secure_url);
    };

    if (!isMounted) {
        return null;
    }

    return (
        <CldUploadWidget onUpload={onUpload} uploadPreset="dy6dvtou">
            {({ open }) => {
                const onClick = () => {
                    open();
                };

                return (
                    <div className="group">
                        <div
                            className={cn(
                                'relative w-[80px] h-[80px] rounded-full overflow-hidden flex items-center justify-center',
                                disabled && 'opacity-5 cursor-not-allowed pointer-events-none',
                            )}
                            onClick={onClick}
                        >
                            <div className="absolute w-full h-full group-hover:flex justify-center items-center hidden cursor-pointer group-hover:bg-black group-hover:bg-opacity-20 text-white z-20">
                                <AiOutlineUpload size={30} />
                            </div>
                            <Image fill className="object-cover" alt="Image" src={value} />
                        </div>
                    </div>
                );
            }}
        </CldUploadWidget>
    );
};

export default UserAvatarUpload;
