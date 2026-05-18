import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const quickLinks = [
    {
      title: "Products",
      description: "Manage inventory and stock",
    },
    {
      title: "Customers",
      description: "View and manage customers",
    },
    {
      title: "Sales",
      description: "Create invoices and track sales",
    },
    {
      title: "Offline Sync",
      description: "Monitor sync status",
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Top Navbar */}
      <header className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Mini ERP</h1>

          <p className="text-sm text-zinc-400 mt-1">
            Offline-first retail management
          </p>
        </div>

        <button className="bg-blue-500 hover:bg-blue-600 transition px-4 py-2 rounded-lg text-sm font-medium">
          Dashboard
        </button>
      </header>

      <main className="p-6">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <p className="text-zinc-400 text-sm">Today's Sales</p>

            <h2 className="text-3xl font-semibold mt-3">₹0</h2>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <p className="text-zinc-400 text-sm">Products</p>

            <h2 className="text-3xl font-semibold mt-3">0</h2>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <p className="text-zinc-400 text-sm">Low Stock</p>

            <h2 className="text-3xl font-semibold mt-3">0</h2>
          </div>
        </div>

        {/* Quick Access */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold">Quick Access</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
            {quickLinks.map((item) => (
              <div
                key={item.title}
                onClick={() => {
                  if (item.title === "Products") {
                    navigate("/products");
                  }
                }}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700 transition cursor-pointer"
              >
                <h3 className="text-lg font-medium">{item.title}</h3>

                <p className="text-zinc-400 text-sm mt-2">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
