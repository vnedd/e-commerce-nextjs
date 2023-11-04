'use client';
import { signIn } from 'next-auth/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import Link from 'next/link';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { AiOutlineGithub } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
import SocialButton from '@/components/ui/social-button';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { TailSpin } from 'react-loader-spinner';
const formSchema = z.object({
    name: z.string().min(4),
    email: z.string().email({
        message: 'Enter valid email',
    }),
    password: z.string().min(6, {
        message: 'Password minimum 6 characters',
    }),
});

const SignUpPage = () => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
        },
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            setLoading(true);
            await axios.post('/api/register', {
                ...data,
            });
            toast.success('Register successfully!');
            router.push('/sign-in');
        } catch (error) {
            console.log(error);
            toast.error('Something went wrong!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white lg:w-2/5 md:w-1/2 w-full sm:w-2/3 h-full sm:h-auto rounded-md shadow-lg px-4 py-5">
            <div className="flex items-center justify-center space-x-1 text-center text-xl font-bold mb-4">
                <h1>SIGN</h1>
                <h1 className="text-violet-700">UP</h1>
            </div>
            <div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="name"
                            disabled={loading}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Example: David" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            disabled={loading}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="example@domain.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            disabled={loading}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? <TailSpin width={20} height={20} color="#ccc" /> : 'Sign Up'}
                        </Button>
                    </form>
                    <div className="relative w-full my-8 flex items-center justify-center">
                        <div className="w-full border-b"></div>
                        <div className="absolute px-2 py-2 bg-white text-neutral-400 font-light text-xs flex items-center justify-center">
                            or continute with
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <SocialButton
                            icon={AiOutlineGithub}
                            onClick={() => signIn('github', { callbackUrl: '/' })}
                            disabled={loading}
                        />
                        <SocialButton
                            icon={FcGoogle}
                            onClick={() => signIn('google', { callbackUrl: '/' })}
                            disabled={loading}
                        />
                    </div>
                    <div className="flex items-center justify-center gap-2 text-sm mt-8">
                        <p>Have an account?</p>
                        <Link href="/sign-in" className="text-violet-600">
                            Sign in now!
                        </Link>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default SignUpPage;
