const CustomerRow = ({
  customer,
  onEdit,
  onDelete,
}) => {
  return (
    <tr className="border-b border-zinc-800 hover:bg-zinc-800/30 transition">

      <td className="p-4">
        {customer.name}
      </td>

      <td className="p-4 text-zinc-400">
        {customer.phone}
      </td>

      <td className="p-4">
        {customer.address}
      </td>

      <td className="p-4">

        <div className="flex gap-2">

          <button
            onClick={() =>
              onEdit(customer)
            }
            className="px-3 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-sm transition"
          >
            Edit
          </button>

          <button
            onClick={() =>
              onDelete(customer.id)
            }
            className="px-3 py-1 rounded-md bg-red-500/20 text-red-400 hover:bg-red-500/30 text-sm transition"
          >
            Delete
          </button>

        </div>

      </td>

    </tr>
  );
};

export default CustomerRow;