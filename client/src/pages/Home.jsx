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
      title: "New Sale (POS)",
      description: "Create invoices and ring up customers",
      path: "/sales",
    },
    {
      title: "Sales History",
      description: "View past invoices and receipts",
      path: "/sales-history",
    },
    {
      title: "Dashboard",
      description: "View analytics and reports",
      path: "/dashboard",
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col font-sans">
      {/* Navbar */}
      <header className="border-b border-zinc-900 bg-zinc-950 flex justify-between items-center px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          <div className="flex items-center gap-3">
            {/* Simple CSS logo for professional look */}
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Shop Pilot</h1>
          </div>
          <button 
            onClick={logout}
            className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 px-5 py-2 rounded-xl text-sm font-semibold transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col justify-center max-w-7xl mx-auto px-4 sm:px-6 w-full py-12 pb-24 text-center">
        
        {/* Intro Hero Section */}
        <div className="mb-12 max-w-3xl mx-auto px-2">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400">
            Unified Retail OS
          </h2>
          <p className="text-zinc-400 text-base sm:text-lg">
            Manage your shop operations, track inventory real-time, and run point-of-sale transactions all in one place.
          </p>
        </div>

        {/* Quick Links */}
        <section className="mt-4">
          <div className="text-left mb-6 px-2">
            <h3 className="text-xl font-bold text-white">System Modules</h3>
            <p className="text-zinc-500 text-sm mt-1">Select a module to begin managing your workflow.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-left">
            {quickLinks.map((item) => (
              <button
                key={item.title}
                onClick={() => navigate(item.path)}
                className="group bg-zinc-900 border border-zinc-800 hover:border-zinc-600 hover:bg-zinc-800/80 rounded-2xl p-6 text-left transition-all duration-150 transform hover:-translate-y-1 overflow-hidden relative"
              >
                <div className="flex flex-col h-full justify-between min-h-[140px] z-10 relative">
                  <div>
                    <h2 className="text-lg font-bold text-zinc-100 group-hover:text-emerald-400 transition-colors">
                      {item.title}
                    </h2>
                    <p className="text-zinc-400 text-sm mt-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center text-sm font-semibold text-zinc-500 group-hover:text-zinc-300 transition-colors">
                    Access Module
                    <svg className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>
      </main>

      {/* Structured Modern Footer */}
      <footer className="border-t border-zinc-800 bg-zinc-950 pt-12 pb-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-10 text-left">
            {/* Brand Column */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-md bg-zinc-800 flex items-center justify-center border border-zinc-700">
                  <svg className="w-3.5 h-3.5 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white">Shop Pilot</h3>
              </div>
              <p className="text-zinc-400 text-sm leading-relaxed max-w-xs">
                Empowering businesses with robust, offline-capable retail management tools. Fast, efficient, and reliable.
              </p>
            </div>

            {/* Navigation Column */}
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Quick Links</h4>
              <ul className="flex flex-col gap-2">
                <li><button onClick={() => navigate('/dashboard')} className="text-sm text-zinc-400 hover:text-emerald-400 transition-colors">Dashboard Analytics</button></li>
                <li><button onClick={() => navigate('/sales')} className="text-sm text-zinc-400 hover:text-emerald-400 transition-colors">Point of Sale (POS)</button></li>
                <li><button onClick={() => navigate('/products')} className="text-sm text-zinc-400 hover:text-emerald-400 transition-colors">Inventory Manager</button></li>
              </ul>
            </div>

            {/* Contact Column */}
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Support & Contact</h4>
              <ul className="flex flex-col gap-3">
                <li>
                  <a href="mailto:nandunandakishor345@gmail.com" className="flex items-center gap-3 text-sm text-zinc-400 hover:text-white transition-colors group">
                    <svg className="w-4 h-4 text-zinc-500 group-hover:text-emerald-400 transition-colors flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="truncate">nandunandakishor345@gmail.com</span>
                  </a>
                </li>
                <li>
                  <a href="tel:+919778129217" className="flex items-center gap-3 text-sm text-zinc-400 hover:text-white transition-colors group">
                    <svg className="w-4 h-4 text-zinc-500 group-hover:text-emerald-400 transition-colors flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>+91 9778129217</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="pt-6 border-t border-zinc-800/60 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-zinc-500 text-xs sm:text-sm">
              © {new Date().getFullYear()} Shop Pilot. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-xs sm:text-sm text-zinc-500">
              <span className="hover:text-zinc-300 cursor-pointer transition-colors">Privacy Policy</span>
              <span className="hover:text-zinc-300 cursor-pointer transition-colors">Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
