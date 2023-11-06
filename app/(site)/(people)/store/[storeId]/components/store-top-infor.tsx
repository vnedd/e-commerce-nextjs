import { CiMail } from 'react-icons/ci';
import { AiOutlineHeart } from 'react-icons/ai';
import Container from '@/components/container';
import { Button } from '@/components/ui/button';
import { Store, User } from '@prisma/client';
import Image from 'next/image';

interface StoreTopInforProps {
    data: Store;
    user: User;
}

const StoreTopInfor: React.FC<StoreTopInforProps> = ({ data, user }) => {
    return (
        <div className="w-full bg-neutral-50">
            <Container>
                <div className="flex items-center justify-between relative">
                    <div className="flex items-center py-4 space-x-4">
                        <div className="w-[90px] h-[90px] lg:w-[120px] lg:h-[120px] rounded-md overflow-hidden bg-white relative">
                            <Image src={data.storeAvatarUrl || '/placeholder-avatar.svg'} alt="Shop Avatar" fill />
                        </div>
                        <div>
                            <h3 className="lg:text-4xl text-xl font-semibold text-dark-950 mb-2">{data?.name}</h3>
                            <p className="text-xs md:text-sm text-neutral-800">{data?.description}</p>
                            <p className="text-xs md:text-sm text-neutral-800 mt-2">{data?.address}</p>
                        </div>
                    </div>
                    <div>
                        <div className=" items-center flex-col space-y-2 sm:space-y-1 hidden md:flex">
                            <div className="bg-white rounded-full overflow-hidden relative lg:w-[80px] lg:h-[80px]">
                                <Image
                                    src={user?.image || '/placeholder-avatar.svg'}
                                    alt="Owner Store avatar"
                                    className=""
                                    fill
                                />
                            </div>
                            <span className="mt-2 text-xs text-gray-700">{user?.name}</span>
                            <Button variant={'ghost'} className="rounded-full" size={'sm'}>
                                <CiMail size={18} />
                                <p className="ml-2 text-sm">Contact</p>
                            </Button>
                        </div>
                    </div>
                    <Button
                        className="absolute rounded-full shadow-sm bottom-[-20px] translate-x-[98%]"
                        variant={'outline'}
                    >
                        <AiOutlineHeart size={18} />
                        <p className="text-sm ml-2">Follow Shop</p>
                    </Button>
                </div>
            </Container>
        </div>
    );
};

export default StoreTopInfor;
