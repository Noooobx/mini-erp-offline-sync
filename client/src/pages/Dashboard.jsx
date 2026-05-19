import { useEffect, useState } from "react";

import { getDashboardStats } from "../services/dashboard.service";

const Dashboard = () => {
  const [stats, setStats] = useState({
    todaySales: 0,
    totalProducts: 0,
    lowStock: 0,
    totalCustomers: 0,
  });

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await getDashboardStats();

        setStats(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchDashboard();
  }, []);

  const cards = [
    {
      title: "Today's Sales",
      value: `₹${stats.todaySales}`,
      description: "Revenue generated today",
    },
    {
      title: "Products",
      value: stats.totalProducts,
      description: "Products in inventory",
    },
    {
      title: "Low Stock",
      value: stats.lowStock,
      description: "Items needing refill",
    },
    {
      title: "Customers",
      value: stats.totalCustomers,
      description: "Registered customers",
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Hero */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-zinc-500 text-sm uppercase tracking-wide">
                Analytics
              </p>

              <h1 className="text-3xl sm:text-4xl font-bold mt-2">Dashboard</h1>

              <p className="text-zinc-400 mt-3 max-w-2xl text-sm sm:text-base leading-relaxed">
                Monitor your business performance, inventory, customer activity,
                and daily sales from one centralized dashboard.
              </p>
            </div>

            {/* Mini Chart */}
            <div className="w-full lg:w-[320px] bg-zinc-950 border border-zinc-800 rounded-2xl p-5">
              <div className="flex items-end justify-between h-40 gap-2">
                {[40, 70, 45, 90, 60, 120, 85].map((height, index) => (
                  <div
                    key={index}
                    className="flex-1 bg-white/90 rounded-t-xl"
                    style={{
                      height: `${height}px`,
                    }}
                  />
                ))}
              </div>

              <div className="flex justify-between mt-4 text-xs text-zinc-500">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mt-6">
          {cards.map((card) => (
            <div
              key={card.title}
              className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5"
            >
              <div className="flex flex-col justify-between min-h-[170px]">
                <div>
                  <p className="text-zinc-500 text-sm">{card.title}</p>

                  <h2 className="text-4xl font-bold mt-4 tracking-tight">
                    {card.value}
                  </h2>
                </div>

                <p className="text-zinc-400 text-sm mt-6">{card.description}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Bottom Section */}
        <section className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
          {/* Revenue Card */}
          <div className="xl:col-span-2 bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Revenue Overview</h2>

                <p className="text-zinc-500 text-sm mt-1">
                  Last 7 days performance
                </p>
              </div>

              <div className="text-right">
                <p className="text-zinc-500 text-sm">Total Revenue</p>

                <h3 className="text-2xl font-bold mt-1">₹{stats.todaySales}</h3>
              </div>
            </div>

            {/* Fake Graph */}
            <div className="mt-8 h-64 flex items-end gap-3">
              {[80, 120, 100, 170, 140, 210, 190].map((height, index) => (
                <div
                  key={index}
                  className="flex-1 bg-zinc-700 hover:bg-white transition rounded-t-2xl"
                  style={{
                    height: `${height}px`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Activity */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <h2 className="text-xl font-semibold">Business Status</h2>

            <p className="text-zinc-500 text-sm mt-1">
              Current system overview
            </p>

            <div className="mt-6 space-y-4">
              <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Inventory</span>

                  <span className="text-green-400 text-sm">Healthy</span>
                </div>
              </div>

              <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Sales</span>

                  <span className="text-green-400 text-sm">Active</span>
                </div>
              </div>

              <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Customers</span>

                  <span className="text-blue-400 text-sm">Growing</span>
                </div>
              </div>

              <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Low Stock Alerts</span>

                  <span className="text-red-400 text-sm">{stats.lowStock}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
