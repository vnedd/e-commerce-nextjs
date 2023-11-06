'use client';
import { IoMdMore } from 'react-icons/io';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import React, { useState } from 'react';
import {
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { ColorsColumn } from './column';
import { BiEditAlt, BiCopy } from 'react-icons/bi';
import { AiOutlineDelete } from 'react-icons/ai';
import { useParams, useRouter } from 'next/navigation';
import AlertModal from '@/components/modals/alert-modal';
import axios from 'axios';
import useCurrentUser from '@/hooks/use-current-user';
import toast from 'react-hot-toast';

interface CellActionProps {
    data: ColorsColumn;
}

const CellAction: React.FC<CellActionProps> = ({ data }) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const { data: user } = useCurrentUser();
    const params = useParams();
    const router = useRouter();

    const handlerDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/${user.id}/${params.storeId}/colors/${data.id}`);
            setOpen(false);
            toast.success('Size removed successfully!');
            router.refresh();
        } catch (error: any) {
            if (error.response) {
                toast.error(error.response.data.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <AlertModal
                title="Are you sure to delete this size?"
                description="Clicking delete data will not be recoverable. Are you sure?"
                isOpen={open}
                loading={loading}
                onClose={() => setOpen(false)}
                onConfirm={handlerDelete}
            />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <IoMdMore className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem className="cursor-pointer" onClick={() => navigator.clipboard.writeText(data.id)}>
                        <BiCopy className="mr-2 h-4 w-4" />
                        Copy ID
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => router.push(`/seller/${params.storeId}/colors/${data.id}`)}
                    >
                        <BiEditAlt className="mr-2 h-4 w-4" /> Update
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer" onClick={() => setOpen(true)}>
                        <AiOutlineDelete className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};

export default CellAction;
