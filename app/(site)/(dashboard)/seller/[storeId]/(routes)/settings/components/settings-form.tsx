'use client';
import React, { useEffect, useState } from 'react';
import { z } from 'zod';
import { useForm, useFormState } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import '@geoapify/geocoder-autocomplete/styles/minimal.css';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import useCurrentStore from '@/hooks/use-current-store';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check } from 'lucide-react';
import { InputMask } from 'primereact/inputmask';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { cn } from '@/lib/utils';
import axios from 'axios';
import toast from 'react-hot-toast';
import { TailSpin } from 'react-loader-spinner';
import SingleImageUpload from '@/components/ui/single-image-upload';
import { LuChevronsUpDown } from 'react-icons/lu';
import useCurrentUser from '@/hooks/use-current-user';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
    name: z.string().min(2),
    description: z.string(),
    address: z.string().min(2, {
        message: 'Please sellect you location',
    }),
    phone: z.string(),
    storeAvatarUrl: z.string().optional(),
    storeBannerUrl: z.string().optional(),
});

const addressMockup = [
    { country: 'USA', label: 'Alabama, USA' },
    { country: 'USA', label: 'Alaska, USA' },
    { country: 'USA', label: 'Arizona, USA' },
    { country: 'USA', label: 'Arkansas, USA' },
    { country: 'USA', label: 'California, USA' },
    { country: 'USA', label: 'Colorado, USA' },
    { country: 'USA', label: 'Connecticut, USA' },
    { country: 'USA', label: 'Delaware, USA' },
    { country: 'USA', label: 'Florida, USA' },
    { country: 'USA', label: 'Georgia, USA' },
    { country: 'USA', label: 'Hawaii, USA' },
    { country: 'USA', label: 'Idaho, USA' },
    { country: 'USA', label: 'Illinois, USA' },
    { country: 'USA', label: 'Indiana, USA' },
    { country: 'USA', label: 'Iowa, USA' },
    { country: 'USA', label: 'Kansas, USA' },
    { country: 'USA', label: 'Kentucky, USA' },
    { country: 'USA', label: 'Louisiana, USA' },
    { country: 'USA', label: 'Maine, USA' },
    { country: 'USA', label: 'Maryland, USA' },
    { country: 'USA', label: 'Massachusetts, USA' },
    { country: 'USA', label: 'Michigan, USA' },
    { country: 'USA', label: 'Minnesota, USA' },
    { country: 'USA', label: 'Mississippi, USA' },
    { country: 'USA', label: 'Missouri, USA' },
    { country: 'USA', label: 'Montana, USA' },
    { country: 'USA', label: 'Nebraska, USA' },
    { country: 'USA', label: 'Nevada, USA' },
    { country: 'USA', label: 'New Hampshire, USA' },
    { country: 'USA', label: 'New Jersey, USA' },
    { country: 'USA', label: 'New Mexico, USA' },
    { country: 'USA', label: 'New York, USA' },
    { country: 'USA', label: 'North Carolina, USA' },
    { country: 'USA', label: 'North Dakota, USA' },
    { country: 'USA', label: 'Ohio, USA' },
    { country: 'USA', label: 'Oklahoma, USA' },
    { country: 'USA', label: 'Oregon, USA' },
    { country: 'USA', label: 'Pennsylvania, USA' },
    { country: 'USA', label: 'Rhode Island, USA' },
    { country: 'USA', label: 'South Carolina, USA' },
    { country: 'USA', label: 'South Dakota, USA' },
    { country: 'USA', label: 'Tennessee, USA' },
    { country: 'USA', label: 'Texas, USA' },
    { country: 'USA', label: 'Utah, USA' },
    { country: 'USA', label: 'Vermont, USA' },
    { country: 'USA', label: 'Virginia, USA' },
    { country: 'USA', label: 'Washington, USA' },
    { country: 'USA', label: 'West Virginia, USA' },
    { country: 'USA', label: 'Wisconsin, USA' },
    { country: 'USA', label: 'Wyoming, USA' },
    { country: 'Vietnam', label: 'Hà Nội, VietNam' },
    { country: 'Vietnam', label: 'Hà Giang, VietNam' },
    { country: 'Vietnam', label: 'Cao Bằng, VietNam' },
    { country: 'Vietnam', label: 'Lào Cai, VietNam' },
    { country: 'Vietnam', label: 'Điện Biên, VietNam' },
    { country: 'Vietnam', label: 'Lai Châu, VietNam' },
    { country: 'Vietnam', label: 'Sơn La, VietNam' },
    { country: 'Vietnam', label: 'Yên Bái, VietNam' },
    { country: 'Vietnam', label: 'Tuyên Quang, VietNam' },
    { country: 'Vietnam', label: 'Lạng Sơn, VietNam' },
    { country: 'Vietnam', label: 'Quảng Ninh, VietNam' },
    { country: 'Vietnam', label: 'Bắc Giang, VietNam' },
    { country: 'Vietnam', label: 'Phú Thọ, VietNam' },
    { country: 'Vietnam', label: 'Vĩnh Phúc, VietNam' },
    { country: 'Vietnam', label: 'Bắc Ninh, VietNam' },
    { country: 'Vietnam', label: 'Hải Dương, VietNam' },
    { country: 'Vietnam', label: 'Hải Phòng, VietNam' },
    { country: 'Vietnam', label: 'Hưng Yên, VietNam' },
    { country: 'Vietnam', label: 'Thái Bình, VietNam' },
    { country: 'Vietnam', label: 'Hà Nam, VietNam' },
    { country: 'Vietnam', label: 'Nam Định, VietNam' },
    { country: 'Vietnam', label: 'Ninh Bình, VietNam' },
    { country: 'Vietnam', label: 'Thanh Hóa, VietNam' },
    { country: 'Vietnam', label: 'Nghệ An, VietNam' },
    { country: 'Vietnam', label: 'Hà Tĩnh, VietNam' },
    { country: 'Vietnam', label: 'Quảng Bình, VietNam' },
    { country: 'Vietnam', label: 'Quảng Trị, VietNam' },
    { country: 'Vietnam', label: 'Thừa Thiên Huế, VietNam' },
    { country: 'Vietnam', label: 'Đà Nẵng, VietNam' },
    { country: 'Vietnam', label: 'Quảng Nam, VietNam' },
    { country: 'Vietnam', label: 'Quảng Ngãi, VietNam' },
    { country: 'Vietnam', label: 'Bình Định, VietNam' },
    { country: 'Vietnam', label: 'Phú Yên, VietNam' },
    { country: 'Vietnam', label: 'Khánh Hòa, VietNam' },
    { country: 'Vietnam', label: 'Ninh Thuận, VietNam' },
    { country: 'Vietnam', label: 'Bình Thuận, VietNam' },
    { country: 'Vietnam', label: 'Kon Tum, VietNam' },
    { country: 'Vietnam', label: 'Gia Lai, VietNam' },
    { country: 'Vietnam', label: 'Đắk Lắk, VietNam' },
    { country: 'Vietnam', label: 'Đắk Nông, VietNam' },
    { country: 'Vietnam', label: 'Lâm Đồng, VietNam' },
    { country: 'Vietnam', label: 'Bình Phước, VietNam' },
    { country: 'Vietnam', label: 'Tây Ninh, VietNam' },
    { country: 'Vietnam', label: 'Bình Dương, VietNam' },
    { country: 'Vietnam', label: 'Đồng Nai, VietNam' },
    { country: 'Vietnam', label: 'Bà Rịa - Vũng Tàu, VietNam' },
    { country: 'Vietnam', label: 'TP. Hồ Chí Minh, VietNam' },
    { country: 'Vietnam', label: 'Long An, VietNam' },
    { country: 'Vietnam', label: 'Tiền Giang, VietNam' },
    { country: 'Vietnam', label: 'Bến Tre, VietNam' },
    { country: 'Vietnam', label: 'Trà Vinh, VietNam' },
    { country: 'Vietnam', label: 'Vĩnh Long, VietNam' },
    { country: 'Vietnam', label: 'Đồng Tháp, VietNam' },
    { country: 'Vietnam', label: 'An Giang, VietNam' },
    { country: 'Vietnam', label: 'Kiên Giang, VietNam' },
    { country: 'Vietnam', label: 'Cần Thơ, VietNam' },
    { country: 'Vietnam', label: 'Hậu Giang, VietNam' },
    { country: 'Vietnam', label: 'Sóc Trăng, VietNam' },
    { country: 'Vietnam', label: 'Bạc Liêu, VietNam' },
    { country: 'Vietnam', label: 'Cà Mau, VietNam' },
] as const;

type SettingsFormValues = z.infer<typeof formSchema>;

const SettingsForm = () => {
    const { data: store } = useCurrentStore();
    const { data: user } = useCurrentUser();
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const form = useForm<SettingsFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: store?.name,
            description: store?.description,
            address: store?.address,
            phone: store?.phone,
            storeAvatarUrl: store?.storeAvatarUrl || '',
            storeBannerUrl: store?.storeBannerUrl || '',
        },
    });

    const onSubmit = async (data: SettingsFormValues) => {
        try {
            setLoading(true);
            await axios.patch(`/api/${user.id}/${store.id}`, { ...data });
            toast.success('Update settings successfully');
            router.refresh();
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
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-2 gap-x-4">
                        <FormField
                            control={form.control}
                            name="storeAvatarUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Store Avatar</FormLabel>
                                    <FormControl>
                                        <SingleImageUpload
                                            value={
                                                field.value
                                                    ? field.value
                                                    : store?.storeAvatarUrl || '/placeholder-avatar.svg'
                                            }
                                            disabled={loading}
                                            onChange={(url) => field.onChange(url)}
                                            className="w-full h-[200px] border-2 border-violet-900"
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="storeBannerUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Store Banner</FormLabel>
                                    <FormControl>
                                        <SingleImageUpload
                                            value={
                                                field.value
                                                    ? field.value
                                                    : store?.storeBannerUrl || '/placeholder-store-banner.svg'
                                            }
                                            disabled={loading}
                                            onChange={(url) => field.onChange(url)}
                                            className="w-full h-[200px] border-2 border-violet-900"
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="grid md:grid-cols-2 md:grid-rows-2 grid-cols-1 gap-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Store Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Nedd E-commerce" {...field} disabled={loading} />
                                    </FormControl>
                                    <FormDescription>This is your public display Store Name.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="mt-2">
                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Address</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        disabled={loading}
                                                        variant="outline"
                                                        role="combobox"
                                                        className={cn(
                                                            'w-full justify-between',
                                                            !field.value && 'text-muted-foreground',
                                                        )}
                                                    >
                                                        {field.value
                                                            ? addressMockup.find(
                                                                  (address) => address.label === field.value,
                                                              )?.label
                                                            : 'Select address'}
                                                        <LuChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent
                                                className="max-w-[400px] p-0 overflow-y-auto max-h-[300px] no-scrollbar"
                                                align={'start'}
                                            >
                                                <Command>
                                                    <CommandInput placeholder="Search address..." />
                                                    <CommandEmpty>No address found.</CommandEmpty>
                                                    <CommandGroup>
                                                        {addressMockup.map((address) => (
                                                            <CommandItem
                                                                value={address.label}
                                                                key={address.label}
                                                                onSelect={() => {
                                                                    form.setValue('address', address.label);
                                                                    form.trigger('address');
                                                                }}
                                                                className="cursor-pointer"
                                                            >
                                                                <Check
                                                                    className={cn(
                                                                        'mr-2 h-4 w-4',
                                                                        address.label === field.value
                                                                            ? 'opacity-100'
                                                                            : 'opacity-0',
                                                                    )}
                                                                />
                                                                {address.label}
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                        <FormDescription>
                                            This is the address that will be used in the dashboard.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Store Phone Number</FormLabel>
                                    <FormControl>
                                        <InputMask
                                            disabled={loading}
                                            className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:border-violet-900 hover:border-violet-900 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300"
                                            mask="(999) 999-9999"
                                            placeholder="(123) 456-7890"
                                            {...field}
                                        ></InputMask>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Store Description</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} rows={2} disabled={loading} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button type="submit" className="rounded-full" variant={'outline'} disabled={loading}>
                        {loading ? (
                            <div className="flex items-center">
                                <p className="mr-2">Save Changes</p>
                                <TailSpin width={16} height={16} color="#ccc" />
                            </div>
                        ) : (
                            'Save Changes'
                        )}
                    </Button>
                </form>
            </Form>
        </>
    );
};

export default SettingsForm;
