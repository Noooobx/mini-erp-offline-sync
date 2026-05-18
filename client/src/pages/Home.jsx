import { useNavigate } from "react-router-dom";
const Home = () => {
  const navigate = useNavigate();
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
  ];
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {" "}
      {/* Navbar */}{" "}
      <header className="border-b border-zinc-800 px-4 sm:px-6 py-4 flex items-center justify-between">
        {" "}
        <div>
          {" "}
          <h1 className="text-xl sm:text-2xl font-semibold"> Mini ERP </h1>{" "}
          <p className="text-zinc-400 text-sm mt-1">
            {" "}
            Offline-first retail management{" "}
          </p>{" "}
        </div>{" "}
        <div className="flex items-center gap-3">
          {" "}
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            {" "}
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>{" "}
            Synced{" "}
          </div>{" "}
          <button className="bg-blue-500 hover:bg-blue-600 transition px-4 py-2 rounded-lg text-sm font-medium">
            {" "}
            Dashboard{" "}
          </button>{" "}
        </div>{" "}
      </header>{" "}
      <main className="p-4 sm:p-6">
        {" "}
        {/* Stats */}{" "}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {" "}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            {" "}
            <p className="text-zinc-400 text-sm"> Today's Sales </p>{" "}
            <h2 className="text-2xl sm:text-3xl font-semibold mt-3">
              {" "}
              ₹0{" "}
            </h2>{" "}
          </div>{" "}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            {" "}
            <p className="text-zinc-400 text-sm"> Products </p>{" "}
            <h2 className="text-2xl sm:text-3xl font-semibold mt-3">
              {" "}
              0{" "}
            </h2>{" "}
          </div>{" "}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            {" "}
            <p className="text-zinc-400 text-sm"> Low Stock </p>{" "}
            <h2 className="text-2xl sm:text-3xl font-semibold mt-3">
              {" "}
              0{" "}
            </h2>{" "}
          </div>{" "}
        </div>{" "}
        {/* Quick Access */}{" "}
        <section className="mt-10">
          {" "}
          <h2 className="text-lg sm:text-xl font-semibold">
            {" "}
            Quick Access{" "}
          </h2>{" "}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
            {" "}
            {quickLinks.map((item) => (
              <button
                key={item.title}
                onClick={() => navigate(item.path)}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 text-left hover:border-zinc-700 hover:bg-zinc-900/80 transition"
              >
                {" "}
                <h3 className="text-lg font-medium"> {item.title} </h3>{" "}
                <p className="text-zinc-400 text-sm mt-2">
                  {" "}
                  {item.description}{" "}
                </p>{" "}
              </button>
            ))}{" "}
          </div>{" "}
        </section>{" "}
      </main>{" "}
    </div>
  );
};
export default Home;
