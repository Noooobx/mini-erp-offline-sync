import ProductRow from "./ProductRow";

const ProductTable = ({ products, onEdit, onDelete }) => {
  return (
    <div className="mt-6 bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead className="border-b border-zinc-800 text-zinc-400 text-sm">
            <tr>
              <th className="text-left p-4 font-medium">Product</th>

              <th className="text-left p-4 font-medium">Barcode</th>

              <th className="text-left p-4 font-medium">Price</th>

              <th className="text-left p-4 font-medium">Stock</th>

              <th className="text-left p-4 font-medium">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <ProductRow
                key={product.id}
                product={product}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductTable;
