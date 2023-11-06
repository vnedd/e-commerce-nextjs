import { DataTable } from '@/components/ui/data-table';
import { columns, CategoriesColumn } from './column';

interface CategoriesClientProps {
    data: CategoriesColumn[];
}

const CategoriesClient: React.FC<CategoriesClientProps> = ({ data }) => {
    return (
        <div>
            <DataTable columns={columns} data={data} />
        </div>
    );
};

export default CategoriesClient;
