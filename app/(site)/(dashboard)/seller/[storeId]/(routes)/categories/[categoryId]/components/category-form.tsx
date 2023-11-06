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
import { Category } from '@prisma/client';
import Heading from '@/components/heading';
import { Separator } from '@/components/ui/separator';

const formSchema = z.object({
    name: z.string().min(2),
});

type CategoryFormValues = z.infer<typeof formSchema>;

interface CategoryFormProps {
    initialData: Category | null;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ initialData }) => {
    const [loading, setLoading] = useState(false);
    const { data: user } = useCurrentUser();
    const { data: store } = useCurrentStore();
    const router = useRouter();

    const title = initialData ? 'Edit category' : 'Create category';
    const description = initialData ? 'Edit a category.' : 'Add a new category';
    const toastMessage = initialData ? 'Category updated.' : 'Category created.';
    const action = initialData ? 'Save changes' : 'Create Category';

    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: initialData?.name,
        },
    });

    const onSubmit = async (data: CategoryFormValues) => {
        try {
            setLoading(true);
            if (initialData) {
                await axios.patch(`/api/${user?.id}/${store?.id}/categories/${initialData.id}`, data);
            } else {
                await axios.post(`/api/${user?.id}/${store?.id}/categories`, data);
            }
            toast.success(toastMessage);
            router.refresh();
            router.push(`/seller/${store.id}/categories`);
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
                    <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Example: Clothings" {...field} disabled={loading} />
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

export default CategoryForm;
