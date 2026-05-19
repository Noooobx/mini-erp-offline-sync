const CustomerRow = ({ customer, onEdit, onDelete }) => {
  return (
    <tr className="border-b border-zinc-800 hover:bg-zinc-800/20">
      <td className="p-4 font-medium whitespace-nowrap">{customer.name}</td>

      <td className="p-4 text-zinc-400 whitespace-nowrap">
        {customer.phone || "-"}
      </td>

      <td className="p-4 text-zinc-400 max-w-[320px] truncate">
        {customer.address || "-"}
      </td>

      <td className="p-4">
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(customer)}
            className="px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-sm"
          >
            Edit
          </button>

          <button
            onClick={() => onDelete(customer.id)}
            className="px-3 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 text-sm"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
};

export default CustomerRow;
