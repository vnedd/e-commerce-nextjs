'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import useCurrentUser from '@/hooks/use-current-user';
import UserAvatarUpload from '@/components/ui/user-avatar-upload';
import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { TailSpin } from 'react-loader-spinner';

const formSchema = z.object({
    name: z.string().min(2, {
        message: 'Username must be at least 2 characters.',
    }),
    image: z.string(),
});

const UpdateInfoForm = () => {
    const { data: user } = useCurrentUser();
    const [loading, setLoading] = useState(false);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: user?.name,
            image: user?.image || '',
        },
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            setLoading(true);
            await axios.post(`/api/${user.id}/update-infor`, data);
            toast.success('Update information completed!');
            window.location.assign(`/`);
        } catch (error) {
            console.log(error);
            toast.error('Update failed!');
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="flex flex-col space-y-6">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <h4 className="text-xl font-semibold mb-3">About You</h4>
                        <div className="grid grid-rows-2 w-full lg:w-1/2  gap-x-4">
                            <div className="flex items-center space-x-4">
                                <FormField
                                    control={form.control}
                                    name="image"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <UserAvatarUpload
                                                    value={
                                                        field.value ? field.value : user?.image || '/placeholder.png'
                                                    }
                                                    disabled={loading}
                                                    onChange={(url) => field.onChange(url)}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <div>
                                    <h5 className="text-lg font-semibold mb-1">Profile Picture</h5>
                                    <p className="text-xs text-neutral-400">PNG, JPG max size of 5MB</p>
                                </div>
                            </div>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Your Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ex: David" {...field} disabled={loading} />
                                        </FormControl>
                                        <FormDescription>This is your public display name.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                    <Button type="submit" className="rounded-full" variant={'outline'} disabled={loading}>
                        {loading ? (
                            <div className="flex items-center">
                                <p className="mr-2">Update information</p>
                                <TailSpin width={16} height={16} color="#ccc" />
                            </div>
                        ) : (
                            'Update information'
                        )}
                    </Button>
                </form>
            </Form>
        </div>
    );
};

export default UpdateInfoForm;
