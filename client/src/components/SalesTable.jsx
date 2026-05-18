const SalesTable = ({
  saleItems,
  onQuantityChange,
  onRemove,
}) => {
  return (
    <div className="mt-6 bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">

      <div className="overflow-x-auto">

        <table className="w-full min-w-[700px]">

          <thead className="border-b border-zinc-800 text-zinc-400 text-sm">

            <tr>

              <th className="text-left p-4 font-medium">
                Product
              </th>

              <th className="text-left p-4 font-medium">
                Price
              </th>

              <th className="text-left p-4 font-medium">
                Quantity
              </th>

              <th className="text-left p-4 font-medium">
                Subtotal
              </th>

              <th className="text-left p-4 font-medium">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {saleItems.map((item) => (

              <tr
                key={item.id}
                className="border-b border-zinc-800"
              >

                <td className="p-4">
                  {item.name}
                </td>

                <td className="p-4">
                  ₹{item.price}
                </td>

                <td className="p-4">

                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      onQuantityChange(
                        item.id,
                        e.target.value
                      )
                    }
                    className="w-20 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2"
                  />

                </td>

                <td className="p-4">
                  ₹
                  {item.price *
                    item.quantity}
                </td>

                <td className="p-4">

                  <button
                    onClick={() =>
                      onRemove(item.id)
                    }
                    className="px-3 py-1 rounded-md bg-red-500/20 text-red-400 hover:bg-red-500/30 text-sm transition"
                  >
                    Remove
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default SalesTable;