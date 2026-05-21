import { useEffect, useContext } from "react";
import AppRoutes from "./routes/AppRoutes";
import { syncWithServer } from "./services/syncWorker"; // Import our new courier!
import { AuthContext } from "./context/AuthContext";

const App = () => {
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    // Only attempt to synchronize with the backend if we possess a valid Shop token!
    if (!isAuthenticated) return;
    // 1. Immediately try to sync the second the user opens the app
    syncWithServer();

    // 2. The Routine: Set an automated timer to quietly sync every 15 seconds in the background
    const timer = setInterval(() => {
      syncWithServer();
    }, 15000);

    // 3. The Magic Touch: The browser strictly monitors the Wi-Fi. The EXACT millisecond 
    // the iPad leaves airplane mode and reconnects, this forces an immediate sync!
    window.addEventListener("online", syncWithServer);

    // 4. Clean up Windows memory if the user closes the app
    return () => {
      clearInterval(timer);
      window.removeEventListener("online", syncWithServer);
    };
  }, [isAuthenticated]);

  return <AppRoutes />;
};

export default App;