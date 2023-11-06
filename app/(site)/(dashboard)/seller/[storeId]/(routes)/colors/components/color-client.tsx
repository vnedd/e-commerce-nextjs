import { DataTable } from '@/components/ui/data-table';
import { columns, ColorsColumn } from './column';

interface ColorsClientProps {
    data: ColorsColumn[];
}

const ColorsClient: React.FC<ColorsClientProps> = ({ data }) => {
    return (
        <div>
            <DataTable columns={columns} data={data} />
        </div>
    );
};

export default ColorsClient;
