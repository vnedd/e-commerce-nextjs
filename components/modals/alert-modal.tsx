import React from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { TailSpin } from 'react-loader-spinner';
interface AlertModalProps {
    title: string;
    description: string;
    loading: boolean;
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const AlertModal: React.FC<AlertModalProps> = ({ title, description, loading, isOpen, onClose, onConfirm }) => {
    return (
        <Modal title={title} description={description} isOpen={isOpen} onClose={onClose}>
            <div className="flex space-x-2 justify-end">
                <Button variant={'outline'} onClick={onClose} disabled={loading}>
                    Cancel
                </Button>
                <Button onClick={onConfirm} disabled={loading}>
                    {loading ? (
                        <div className="flex items-center">
                            <p className="mr-2">Confirm</p>
                            <TailSpin width={16} height={16} color="#ccc" />
                        </div>
                    ) : (
                        'Confirm'
                    )}
                </Button>
            </div>
        </Modal>
    );
};

export default AlertModal;
