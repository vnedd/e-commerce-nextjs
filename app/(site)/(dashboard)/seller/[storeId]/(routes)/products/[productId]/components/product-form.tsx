'use client';
import React, { useState, useEffect } from 'react';
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
import { Category, Color, Image, Product, ProductColor, ProductSize, Size } from '@prisma/client';
import Heading from '@/components/heading';
import { Separator } from '@/components/ui/separator';
import MultipleImageUpload from '@/components/ui/multiple-image-upload';
import { Popover, PopoverTrigger } from '@radix-ui/react-popover';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown } from 'lucide-react';
import { PopoverContent } from '@/components/ui/popover';
import { Command, CommandGroup, CommandItem } from '@/components/ui/command';
import { Checkbox } from '@/components/ui/checkbox';

const formSchema = z.object({
    name: z.string().min(2, {
        message: 'Enter product name..',
    }),
    images: z.object({ url: z.string() }).array(),
    price: z.coerce.number().min(1),
    categoryId: z.string().min(1),
    sizes: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: 'You have to select at least one item.',
    }),
    colors: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: 'You have to select at least one item.',
    }),
    isFeatured: z.boolean().default(false).optional(),
});

type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
    initialData:
        | (Product & {
              images: Image[];
              productSize: ProductSize[];
              productColor: ProductColor[];
          })
        | null;
    categories: Category[];
    sizes: Size[];
    colors: Color[];
}

const ProductForm: React.FC<ProductFormProps> = ({ initialData, categories, sizes, colors }) => {
    const [loading, setLoading] = useState(false);
    const [checkedColors, setCheckedColor] = useState<string[]>([]);
    const [checkedSizes, setCheckedSizes] = useState<string[]>([]);
    const { data: user } = useCurrentUser();
    const { data: store } = useCurrentStore();
    const router = useRouter();

    const title = initialData ? 'Edit product' : 'Create product';
    const description = initialData ? 'Edit a product.' : 'Add a new product';
    const toastMessage = initialData ? 'Product updated!' : 'Product created.';
    const action = initialData ? 'Save changes' : 'Create product';

    useEffect(() => {
        if (initialData) {
            setCheckedColor(initialData.productColor.map((item) => item.colorId));
            setCheckedSizes(initialData.productSize.map((item) => item.sizeId));
            console.log('set checked');
        }
    }, [initialData]);

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData
            ? {
                  ...initialData,
                  price: parseFloat(String(initialData?.price)),
              }
            : {
                  name: '',
                  images: [],
                  price: 0,
                  categoryId: '',
                  colors: [],
                  sizes: [],
                  isFeatured: false,
              },
    });

    const onSubmit = async (data: ProductFormValues) => {
        console.log(data);
        try {
            setLoading(true);
            if (initialData) {
                await axios.patch(`/api/${user?.id}/${store?.id}/products/${initialData.id}`, data);
            } else {
                await axios.post(`/api/${user?.id}/${store?.id}/products`, data);
            }
            toast.success(toastMessage);
            router.refresh();
            router.push(`/seller/${store.id}/products`);
        } catch (error: any) {
            if (error.response) {
                toast.error(error.response.data);
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
                    <div>
                        <FormField
                            control={form.control}
                            name="images"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <MultipleImageUpload
                                            disabled={loading}
                                            value={field.value.map((image) => image.url)}
                                            onChange={(url) => field.onChange([...field.value, { url }])}
                                            onRemove={(url) =>
                                                field.onChange([
                                                    ...field.value.filter((current) => current.url !== url),
                                                ])
                                            }
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="grid lg:grid-cols-3 grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Product Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Example: Black" {...field} disabled={loading} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Price</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Example: Black" {...field} disabled={loading} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* category id */}
                        <FormField
                            control={form.control}
                            name="categoryId"
                            render={({ field }) => (
                                <FormItem className="">
                                    <FormLabel>Category</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    disabled={loading}
                                                    className={cn(
                                                        'w-full justify-between',
                                                        !field.value && 'text-muted-foreground',
                                                    )}
                                                >
                                                    {field.value
                                                        ? categories.find((category) => category.id === field.value)
                                                              ?.name
                                                        : 'Select category'}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[250px] p-0">
                                            <Command>
                                                <CommandGroup>
                                                    {categories.map((category) => (
                                                        <CommandItem
                                                            value={category.id}
                                                            key={category.id}
                                                            onSelect={() => {
                                                                form.setValue('categoryId', category.id);
                                                            }}
                                                            className="cursor-pointer"
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    'mr-2 h-4 w-4',
                                                                    category.id === field.value
                                                                        ? 'opacity-100'
                                                                        : 'opacity-0',
                                                                )}
                                                            />
                                                            {category.name}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* Sizes */}
                        <FormField
                            control={form.control}
                            name="sizes"
                            render={() => (
                                <FormItem>
                                    <div className="mb-4">
                                        <FormLabel className="text-base">Sizes</FormLabel>
                                    </div>
                                    {sizes.map((item) => (
                                        <FormField
                                            key={item.id}
                                            control={form.control}
                                            name="sizes"
                                            render={({ field }) => {
                                                const sizeId = item.id;
                                                const isChecked = checkedSizes.some((item) => item === sizeId);
                                                return (
                                                    <FormItem
                                                        key={item.id}
                                                        className="flex flex-row items-start space-x-3 space-y-0"
                                                    >
                                                        <FormControl>
                                                            <Checkbox
                                                                disabled={loading}
                                                                checked={field.value?.includes(item.id) || isChecked}
                                                                onCheckedChange={(checked) => {
                                                                    if (Array.isArray(field.value)) {
                                                                        if (checked) {
                                                                            field.onChange([...field.value, item.id]);
                                                                            setCheckedSizes((prev) => [
                                                                                ...prev,
                                                                                item.id,
                                                                            ]);
                                                                        } else {
                                                                            field.onChange(
                                                                                field.value.filter(
                                                                                    (value) => value !== item.id,
                                                                                ),
                                                                            );
                                                                            setCheckedSizes((prev) =>
                                                                                prev.filter((size) => size !== item.id),
                                                                            );
                                                                        }
                                                                    } else {
                                                                        field.onChange([item.id]);
                                                                    }
                                                                }}
                                                            />
                                                        </FormControl>
                                                        <FormLabel className="font-normal">{item.name}</FormLabel>
                                                    </FormItem>
                                                );
                                            }}
                                        />
                                    ))}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* Colors */}
                        <FormField
                            control={form.control}
                            name="colors"
                            render={() => (
                                <FormItem>
                                    <div className="mb-4">
                                        <FormLabel className="text-base">Colors</FormLabel>
                                    </div>
                                    {colors.map((item) => (
                                        <FormField
                                            key={item.id}
                                            control={form.control}
                                            name="colors"
                                            render={({ field }) => {
                                                const colorId = item.id;
                                                const isChecked = checkedColors.some((item) => item === colorId);
                                                return (
                                                    <FormItem
                                                        key={item.id}
                                                        className="flex flex-row items-start space-x-3 space-y-0"
                                                    >
                                                        <FormControl>
                                                            <Checkbox
                                                                disabled={loading}
                                                                checked={field.value?.includes(item.id) || isChecked}
                                                                onCheckedChange={(checked) => {
                                                                    if (Array.isArray(field.value)) {
                                                                        if (checked) {
                                                                            field.onChange([...field.value, item.id]);
                                                                            setCheckedColor((prev) => [
                                                                                ...prev,
                                                                                item.id,
                                                                            ]);
                                                                        } else {
                                                                            field.onChange(
                                                                                field.value.filter(
                                                                                    (value) => value !== item.id,
                                                                                ),
                                                                            );
                                                                            setCheckedColor((prev) =>
                                                                                prev.filter(
                                                                                    (color) => color !== item.id,
                                                                                ),
                                                                            );
                                                                        }
                                                                    } else {
                                                                        field.onChange([item.id]);
                                                                    }
                                                                }}
                                                            />
                                                        </FormControl>
                                                        <FormLabel className="font-normal cursor-pointer">
                                                            {item.name}
                                                        </FormLabel>
                                                    </FormItem>
                                                );
                                            }}
                                        />
                                    ))}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* feature */}
                        <FormField
                            control={form.control}
                            name="isFeatured"
                            render={({ field }) => (
                                <FormItem className="">
                                    <FormLabel>Featured Product?</FormLabel>
                                    <div className="flex flex-row max-h-[70px] items-start space-x-3 space-y-0 rounded-md border p-4">
                                        <FormControl>
                                            <Checkbox
                                                disabled={loading}
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none ">
                                            <FormLabel className="cursor-pointer">
                                                This product will appear on the home page
                                            </FormLabel>
                                        </div>
                                    </div>
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

export default ProductForm;
