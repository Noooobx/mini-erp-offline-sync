import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Home = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const quickLinks = [
    {
      title: "Products",
      description: "Manage inventory and stock",
      path: "/products",
    },
    {
      title: "Customers",
      description: "View and manage customers",
      path: "/customers",
    },
    {
      title: "Sales",
      description: "Create invoices and track sales",
      path: "/sales",
    },
    {
      title: "Dashboard",
      description: "View analytics and reports",
      path: "/dashboard",
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Navbar */}
      <header className="border-b border-zinc-800 bg-zinc-950/95 backdrop-blur flex justify-between items-center px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Shop Pilot</h1>
            <p className="text-zinc-400 text-sm mt-1">Retail management system</p>
          </div>
          <button 
            onClick={logout}
            className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 px-4 py-2 rounded-xl text-sm font-medium transition-all"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 mb-8">
          <div className="max-w-3xl">
            <p className="text-zinc-400 text-sm uppercase tracking-wider mb-3">
              Business Dashboard
            </p>

            <h2 className="text-3xl sm:text-4xl font-bold leading-tight">
              Manage your shop operations efficiently
            </h2>

            <p className="text-zinc-400 mt-4 text-sm sm:text-base leading-relaxed">
              Track inventory, manage customers, monitor sales, and organize
              your business from one clean dashboard.
            </p>
          </div>
        </section>

        {/* Quick Links */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-semibold">Quick Access</h3>

            <p className="text-zinc-500 text-sm">{quickLinks.length} modules</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {quickLinks.map((item) => (
              <button
                key={item.title}
                onClick={() => navigate(item.path)}
                className="group bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-5 text-left transition-all duration-200 hover:-translate-y-1"
              >
                <div className="flex flex-col h-full justify-between min-h-[170px]">
                  <div>
                    <h2 className="text-lg font-semibold group-hover:text-white">
                      {item.title}
                    </h2>

                    <p className="text-zinc-400 text-sm mt-3 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center text-sm text-zinc-500 group-hover:text-zinc-300 transition">
                    Open
                    <span className="ml-2 transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
