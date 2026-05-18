import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Home from "../pages/Home";
import Products from "../pages/Products";
import Customers from "../pages/Customer";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/products"
          element={<Products />}
        />
        <Route
          path="/customers"
          element={<Customers />}
        />

      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;