import { DataTable } from '@/components/ui/data-table';
import { columns, ProductColumn } from './column';

interface ProductsClientProps {
    data: ProductColumn[];
}

const ProductsClient: React.FC<ProductsClientProps> = ({ data }) => {
    return (
        <div>
            <DataTable columns={columns} data={data} />
        </div>
    );
};

export default ProductsClient;
