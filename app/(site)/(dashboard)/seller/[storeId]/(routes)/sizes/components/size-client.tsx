import { DataTable } from '@/components/ui/data-table';
import { columns, SizesColumn } from './column';

interface SizesClientProps {
    data: SizesColumn[];
}

const SizesClient: React.FC<SizesClientProps> = ({ data }) => {
    return (
        <div>
            <DataTable columns={columns} data={data} />
        </div>
    );
};

export default SizesClient;
