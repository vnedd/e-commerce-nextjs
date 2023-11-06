'use client';
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import '@geoapify/geocoder-autocomplete/styles/minimal.css';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import useCurrentStore from '@/hooks/use-current-store';
import axios from 'axios';
import toast from 'react-hot-toast';
import { TailSpin } from 'react-loader-spinner';
import useCurrentUser from '@/hooks/use-current-user';
import { useRouter } from 'next/navigation';
import { Size } from '@prisma/client';
import Heading from '@/components/heading';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const formSchema = z.object({
    name: z.string().min(2, {
        message: 'Enter color..',
    }),
    value: z.string().min(3).max(9).regex(/^#/, {
        message: 'Color must be a valid hex code',
    }),
});

type ColorFormValues = z.infer<typeof formSchema>;

interface ColorFormProps {
    initialData: Size | null;
}

const ColorForm: React.FC<ColorFormProps> = ({ initialData }) => {
    const [loading, setLoading] = useState(false);
    const { data: user } = useCurrentUser();
    const { data: store } = useCurrentStore();
    const router = useRouter();

    const title = initialData ? 'Edit color' : 'Create color';
    const description = initialData ? 'Edit a color.' : 'Add a new color';
    const toastMessage = initialData ? 'color updated.' : 'color created.';
    const action = initialData ? 'Save changes' : 'Create color';

    const form = useForm<ColorFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: initialData?.name,
            value: initialData?.value,
        },
    });

    const onSubmit = async (data: ColorFormValues) => {
        try {
            setLoading(true);
            if (initialData) {
                await axios.patch(`/api/${user?.id}/${store?.id}/colors/${initialData.id}`, data);
            } else {
                await axios.post(`/api/${user?.id}/${store?.id}/colors`, data);
            }
            toast.success(toastMessage);
            router.refresh();
            router.push(`/seller/${store.id}/colors`);
        } catch (error: any) {
            console.log(error);
            if (error.response) {
                toast.error(error.response.data.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col space-y-6">
            <Heading title={title} subTitle={description} />
            <Separator />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid lg:grid-cols-3 grid-cols-2 gap-x-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Color Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Example: Black" {...field} disabled={loading} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="value"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Color Value</FormLabel>
                                    <FormControl>
                                        <div className="flex flex-row gap-x-4">
                                            <Input placeholder="Example: #000000" {...field} disabled={loading} />
                                            <div
                                                className="w-10 h-10 shrink-0 rounded-full border-2 border-neutral-700 bg-white"
                                                style={{ backgroundColor: field.value }}
                                            ></div>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button type="submit" className="rounded-full" variant={'outline'} disabled={loading}>
                        {loading ? (
                            <div className="flex items-center">
                                <p className="mr-2">{action}</p>
                                <TailSpin width={16} height={16} color="#ccc" />
                            </div>
                        ) : (
                            action
                        )}
                    </Button>
                </form>
            </Form>
        </div>
    );
};

export default ColorForm;
