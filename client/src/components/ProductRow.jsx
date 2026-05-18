const ProductRow = ({ product, onEdit, onDelete }) => {
  return (
    <tr className="border-b border-zinc-800 hover:bg-zinc-800/30 transition">
      <td className="p-4">{product.name}</td>

      <td className="p-4 text-zinc-400">{product.barcode}</td>

      <td className="p-4">₹{product.price}</td>

      <td className="p-4">{product.stock_qty}</td>

      <td className="p-4">
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(product)}
            className="px-3 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-sm transition"
          >
            Edit
          </button>

          <button
            onClick={() => onDelete(product.id)}
            className="px-3 py-1 rounded-md bg-red-500/20 text-red-400 hover:bg-red-500/30 text-sm transition"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ProductRow;
