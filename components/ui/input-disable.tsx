import { Input } from '@/components/ui/input';

interface InputDisabledProps {
    type?: string;
    placeHolder?: string;
    value: string;
}

export const InputDisabled: React.FC<InputDisabledProps> = ({ type, placeHolder, value }) => {
    return <Input disabled type={type} placeholder={placeHolder} value={value} readOnly />;
};
