import { NavLink } from "react-router-dom";
import { useCart } from "../contexts/CartProvider";
import { useAuth } from "../contexts/AuthProvider";

function Header() {
  const { cart } = useCart();
  const { isLoggedIn, logout } = useAuth();

  return (
    <header>
      <h1>
        <NavLink to="/">Ecommerce</NavLink>
      </h1>
      <ul>
        <li>
          <NavLink to="/cart">Cart {cart.length}</NavLink>
        </li>
        <li>
          <NavLink to="/wishlist">Wishlist</NavLink>
        </li>
        <li>
          {isLoggedIn ? (
            <button onClick={logout} className="logout">
              Logout
            </button>
          ) : (
            <NavLink to="/login">Login</NavLink>
          )}
        </li>
      </ul>
    </header>
  );
}

export default Header;
