'use client';

import Image from 'next/image';
import { CldUploadWidget } from 'next-cloudinary';
import { useEffect, useState } from 'react';
import { AiOutlineUpload } from 'react-icons/ai';
import { BsTrash3 } from 'react-icons/bs';

import { cn } from '@/lib/utils';
import { Button } from './button';
interface MultipleImageUploadProps {
    disabled?: boolean;
    onChange: (value: string) => void;
    onRemove: (value: string) => void;
    value: string[];
    className?: String;
}

const MultipleImageUpload: React.FC<MultipleImageUploadProps> = ({ disabled, onChange, onRemove, value }) => {
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
        <>
            <div className="flex gap-4">
                {value?.map((imgUrl) => (
                    <div key={imgUrl} className="relative w-[200px] h-[200px] rounded-lg overflow-hidden">
                        <Image src={imgUrl} alt="product image" fill />
                        <Button
                            onClick={() => onRemove(imgUrl)}
                            variant="destructive"
                            size="icon"
                            className="absolute top-0 right-0"
                        >
                            <BsTrash3 className="w-4 h-4" />
                        </Button>
                    </div>
                ))}
            </div>
            <CldUploadWidget onUpload={onUpload} uploadPreset="dy6dvtou">
                {({ open }) => {
                    const onClick = () => {
                        open();
                    };

                    return (
                        <Button variant={'secondary'} onClick={onClick} disabled={disabled}>
                            <AiOutlineUpload size={18} className="w-4 h-4 mr-2" /> Upload Images
                        </Button>
                    );
                }}
            </CldUploadWidget>
        </>
    );
};

export default MultipleImageUpload;
