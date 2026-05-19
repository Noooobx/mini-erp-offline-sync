const ProductRow = ({ product, onEdit, onDelete }) => {
  return (
    <tr className="border-b border-zinc-800 hover:bg-zinc-800/20">
      <td className="p-4 font-medium whitespace-nowrap">{product.name}</td>

      <td className="p-4 text-zinc-400 whitespace-nowrap">
        {product.barcode || "-"}
      </td>

      <td className="p-4 whitespace-nowrap">₹{product.price}</td>

      <td className="p-4">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            product.stock_qty > 0
              ? "bg-green-500/10 text-green-400"
              : "bg-red-500/10 text-red-400"
          }`}
        >
          {product.stock_qty} units
        </span>
      </td>

      <td className="p-4">
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(product)}
            className="px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-sm"
          >
            Edit
          </button>

          <button
            onClick={() => onDelete(product.id)}
            className="px-3 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 text-sm"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ProductRow;
