import Heading from '@/components/heading';
import { Separator } from '@/components/ui/separator';
import React from 'react';
import SettingsForm from './components/settings-form';

const StoreSettingsPage = () => {
    return (
        <div className="flex flex-col space-y-6">
            <Heading title="Store Settings" subTitle="View and change your store information!" />
            <Separator className="my-6" />
            <SettingsForm />
        </div>
    );
};

export default StoreSettingsPage;
