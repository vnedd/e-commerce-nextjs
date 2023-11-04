'use client';

import Heading from '@/components/heading';
import { Separator } from '@/components/ui/separator';
import UpdateInfoForm from './components/update-info-form';
import UpdatePassform from './components/update-pass-form';

const UserPage = () => {
    return (
        <div className="px-8 py-4 pb-10 ">
            <Heading title={'Account Details'} subTitle="Manage your Nedd profile" />
            <Separator className="my-6" />
            <div className="flex flex-col space-y-6 mt-8">
                <UpdateInfoForm />
                <Separator />
                <UpdatePassform />
            </div>
        </div>
    );
};

export default UserPage;
