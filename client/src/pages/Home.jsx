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
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      {/* Navbar */}
      <header className="border-b border-zinc-800 bg-zinc-950/95 backdrop-blur flex justify-between items-center px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Shop Pilot</h1>
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
      <main className="flex-1 flex flex-col justify-center max-w-7xl mx-auto px-4 sm:px-6 w-full py-8 text-center pb-20">
        {/* Quick Links */}
        <section>
          <div className="flex items-center justify-between mb-8 px-2">
            <h3 className="text-xl font-semibold">Quick Access</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 text-left">
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

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-zinc-500 text-sm">
            © {new Date().getFullYear()} Shop Pilot. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-zinc-400">
            <a href="mailto:nandunandakishor345@gmail.com" className="hover:text-zinc-200 transition-colors">
              nandunandakishor345@gmail.com
            </a>
            <a href="tel:9778129217" className="hover:text-zinc-200 transition-colors">
              +91 9778129217
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
