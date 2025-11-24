import { createBrowserRouter, RouterProvider } from "react-router-dom";
import OutletComponent from "./OutletComponent";
import Cart from "./Cart";
import SingleProduct from "./SingleProduct";
import First from "./First";
import Wishlist from "./Wishlist";
import About from "./About";
import Login from "./Login";
import Register from "./Register";
import Home from "./Home";
import ProtectedRoute from "../components/ProtectedRoute";
import CartProvider from "../contexts/CartProvider";
import AuthProvider from "../contexts/AuthProvider";

const router = createBrowserRouter([
  {
    path: "/",
    element: <OutletComponent />,
    children: [
      {
        index: true,
        element: <First />,
      },
      {
        path: "/cart",
        element: <Cart />,
      },
      {
        path: "/wishlist",
        element: <Wishlist />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/shop",
        element: <First />,
      },
      {
        path: "/product/:id",
        element: <SingleProduct />,
      },
      {
        path: "/home",
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

function Router() {
  return (
    <AuthProvider>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </AuthProvider>
  );
}

export default Router;
