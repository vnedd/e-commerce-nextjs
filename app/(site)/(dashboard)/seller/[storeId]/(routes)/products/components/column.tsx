'use client';

import { ColumnDef } from '@tanstack/react-table';
import CellAction from './cell-action';

export type ProductColumn = {
    id: string;
    name: string;
    price: string;
    category: string;
    createdAt: string;
    isFeatured: boolean;
};

export const columns: ColumnDef<ProductColumn>[] = [
    {
        accessorKey: 'name',
        header: 'Name',
    },
    {
        accessorKey: 'price',
        header: 'Price',
    },
    {
        accessorKey: 'category',
        header: 'Category',
    },
    {
        accessorKey: 'isFeatured',
        header: 'Is Feartured',
    },
    {
        accessorKey: 'createdAt',
        header: 'Date',
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => <CellAction data={row.original} />,
    },
];
