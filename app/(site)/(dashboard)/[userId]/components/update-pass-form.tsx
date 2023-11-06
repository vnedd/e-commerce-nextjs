'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import useCurrentUser from '@/hooks/use-current-user';
import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { TailSpin } from 'react-loader-spinner';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
    currentPassword: z.string().min(6, { message: 'Enter your current password' }),
    password: z.string().min(6, { message: 'Enter your new password' }),
});

const UpdatePassform = () => {
    const { data: user } = useCurrentUser();
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            currentPassword: '',
            password: '',
        },
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            setLoading(true);
            await axios.post(`/api/${user?.id}/update-password`, data);
            toast.success('Password Updated!');
            router.refresh();
        } catch (error: any) {
            if (error.response) {
                toast.error(error.response.data);
            }
        } finally {
            setLoading(false);
        }
    };
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <h4 className="text-xl font-semibold mb-3">Change your password</h4>
                    <div className="grid grid-cols-3 gap-x-4">
                        <FormField
                            control={form.control}
                            name="currentPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Current Password</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="password" disabled={loading} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>New Password</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="password" disabled={loading} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
                <Button type="submit" className="rounded-full" variant={'outline'} disabled={loading}>
                    {loading ? (
                        <div className="flex items-center">
                            <p className="mr-2">Update Password</p>
                            <TailSpin width={16} height={16} color="#ccc" />
                        </div>
                    ) : (
                        'Update Password'
                    )}
                </Button>
            </form>
        </Form>
    );
};

export default UpdatePassform;
