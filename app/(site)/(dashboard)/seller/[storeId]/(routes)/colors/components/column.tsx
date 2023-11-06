'use client';

import { ColumnDef } from '@tanstack/react-table';
import CellAction from './cell-action';

export type ColorsColumn = {
    id: string;
    name: string;
    value: string;
    createdAt: string;
};

export const columns: ColumnDef<ColorsColumn>[] = [
    {
        accessorKey: 'name',
        header: 'Name',
    },
    {
        accessorKey: 'value',
        header: 'Value',
        cell: ({ row }) => (
            <div className="flex items-center gap-x-2">
                <p>{row.original.value}</p>
                <div
                    className="p-2 shrink-0 rounded-full border-2 border-neutral-600"
                    style={{ backgroundColor: row.original.value }}
                ></div>
            </div>
        ),
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
