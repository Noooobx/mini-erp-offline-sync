import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { toast, Toaster } from 'react-hot-toast';

const Login = () => {
  const { login, register } = useContext(AuthContext);
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [shopName, setShopName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isRegistering) {
        await register(email, password, shopName);
        toast.success("Shop registered successfully!");
      } else {
        await login(email, password);
        toast.success("Logged in successfully!");
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
      <Toaster position="top-right" />
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 w-full max-w-md shadow-2xl">
        <h2 className="text-3xl font-bold text-center mb-2">
          {isRegistering ? "Create your Shop" : "Welcome Back"}
        </h2>
        <p className="text-zinc-500 text-center mb-8 text-sm">
          {isRegistering ? "Register your business to start syncing." : "Securely login to your isolated workspace."}
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {isRegistering && (
            <div>
              <label className="block text-zinc-400 text-sm mb-2">Shop Name</label>
              <input
                type="text"
                required
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm outline-none focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700 transition-all"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                placeholder="My Awesome Store"
              />
            </div>
          )}

          <div>
            <label className="block text-zinc-400 text-sm mb-2">Email Address</label>
            <input
              type="email"
              required
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm outline-none focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700 transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@myshop.com"
            />
          </div>

          <div>
            <label className="block text-zinc-400 text-sm mb-2">Password</label>
            <input
              type="password"
              required
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm outline-none focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700 transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-white text-black hover:bg-zinc-200 py-3 rounded-xl font-bold transition-all mt-4 flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {isRegistering ? "Registering..." : "Logging in..."}
              </>
            ) : (
              isRegistering ? "Register Shop" : "Login Securely"
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-zinc-500 text-sm">
          {isRegistering ? "Already have a shop? " : "Need to register a business? "}
          <button
            type="button"
            disabled={isLoading}
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-white hover:underline focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRegistering ? "Login here" : "Create one now"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
