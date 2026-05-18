import CustomerRow from "./CustomerRow";

const CustomerTable = ({
  customers,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="mt-6 bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">

      <div className="overflow-x-auto">

        <table className="w-full min-w-[700px]">

          <thead className="border-b border-zinc-800 text-zinc-400 text-sm">

            <tr>

              <th className="text-left p-4 font-medium">
                Name
              </th>

              <th className="text-left p-4 font-medium">
                Phone
              </th>

              <th className="text-left p-4 font-medium">
                Address
              </th>

              <th className="text-left p-4 font-medium">
                Actions
              </th>

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