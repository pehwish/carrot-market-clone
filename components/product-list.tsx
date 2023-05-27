import useSWR from 'swr';
import Item from './item';
import { ProductWithCount } from 'pages';

interface Record {
  id: number;
  product: ProductWithCount;
}

interface ProductListResponse {
  ok: boolean;
  records: Record[];
}

interface ProductListProps {
  kind: 'fav' | 'sale' | 'purchase';
}

export default function ProductList({ kind }: ProductListProps) {
  const { data } = useSWR<ProductListResponse>(
    `/api/users/me/records?kind=${kind}`
  );

  return data ? (
    <>
      {data?.records.map((record) => (
        <Item
          id={record.product.id}
          key={record.product.id}
          title={record.product.name}
          price={record.product.price}
          hearts={record.product._count.records}
        />
      ))}
    </>
  ) : null;
}
