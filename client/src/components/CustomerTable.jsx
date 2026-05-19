import CustomerRow from "./CustomerRow";

const CustomerTable = ({ customers, onEdit, onDelete }) => {
  return (
    <div className="mt-6 bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden">
      <div className="px-5 py-4 border-b border-zinc-800">
        <h2 className="text-lg font-semibold">Customer Directory</h2>

        <p className="text-zinc-500 text-sm mt-1">
          View and manage customer records.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px]">
          <thead className="border-b border-zinc-800 text-zinc-500 text-sm bg-zinc-950/40">
            <tr>
              <th className="text-left p-4 font-medium">Name</th>

              <th className="text-left p-4 font-medium">Phone</th>

              <th className="text-left p-4 font-medium">Address</th>

              <th className="text-left p-4 font-medium">Actions</th>
            </tr>
          </thead>

          <tbody>
            {customers.map((customer) => (
              <CustomerRow
                key={customer.id}
                customer={customer}
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

export default CustomerTable;
