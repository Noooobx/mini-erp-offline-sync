import { useEffect, useContext } from "react";
import AppRoutes from "./routes/AppRoutes";
import { AuthContext } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import { syncWithServer } from "./services/syncWorker";

const App = () => {
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    // Only attempt to synchronize with the backend if we possess a valid Shop token!
    if (!isAuthenticated) return;
    // 1. Immediately try to sync the second the user opens the app
    syncWithServer();

    // 2. Setup periodic background sync (15s)
    const timer = setInterval(() => {
      syncWithServer();
    }, 15000);

    // 3. Trigger immediate sync upon network reconnection
    window.addEventListener("online", syncWithServer);

    // 4. Clean up Windows memory if the user closes the app
    return () => {
      clearInterval(timer);
      window.removeEventListener("online", syncWithServer);
    };
  }, [isAuthenticated]);

  return (
    <>
      <Toaster position="top-right" />
      <AppRoutes />
    </>
  );
};

export default App;