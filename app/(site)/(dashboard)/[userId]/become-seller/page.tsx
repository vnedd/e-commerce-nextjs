'use client';
import AlertModal from '@/components/modals/alert-modal';
import { Button } from '@/components/ui/button';
import useCurrentStore from '@/hooks/use-current-store';
import useCurrentUser from '@/hooks/use-current-user';
import axios from 'axios';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { useState } from 'react';
import { BsArrowRight } from 'react-icons/bs';
const BecomeSeller = () => {
    const { data: user } = useCurrentUser();
    const { data: store } = useCurrentStore();
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    if (user?.isSeller) {
        redirect(store ? `/seller/${store.id}` : '/seller');
    }

    const handleRegisterSeller = async () => {
        try {
            setLoading(true);
            await axios.post(`/api/${user?.id}/register-seller`, {
                isSeller: true,
            });
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="w-full h-full md:bg-[url('/bc-seller-bg.svg')] md:bg-no-repeat md:bg-cover md:bg-bottom">
                <div className="p-6 flex items-center justify-center">
                    <div className="h-full flex flex-col justify-center ">
                        <h3 className="font-semibold text-5xl mb-8">
                            Welcome to <span className="text-violet-900">Nedd E-commerce!</span>
                            <p className="mt-4">Become a Seller Now!</p>
                        </h3>
                        <p className="text-md">
                            Where your dreams meet opportunity! Join our thriving Nedd E-commerce community of sellers
                            and transform your passion into profit. Start your journey as a Nedd seller today and unlock
                            endless opportunities to showcase your products, connect with customers, and grow your
                            business. It's easy, it's exciting, and it's all right here – become a Nedd seller with us
                            now!
                        </p>
                        <Button className="w-[200px] rounded-full mt-5" onClick={() => setIsOpen(true)}>
                            <p className="mr-2">Register now </p>
                            <BsArrowRight size={18} />
                        </Button>
                    </div>
                </div>
            </div>
            <AlertModal
                title="Are you sure you want to register as a seller?"
                description="If you choose confirm, you cannot undo it"
                isOpen={isOpen}
                loading={loading}
                onClose={() => setIsOpen(false)}
                onConfirm={handleRegisterSeller}
            />
        </>
    );
};

export default BecomeSeller;
