import { Button } from './button';

interface SocialButtonProps {
    icon: any;
    onClick: () => void;
    disabled: boolean;
}

const SocialButton: React.FC<SocialButtonProps> = ({ icon: Icon, onClick, disabled }) => {
    return (
        <Button onClick={onClick} variant="outline" className="w-full" disabled={disabled}>
            <Icon size={20} />
        </Button>
    );
};

export default SocialButton;
