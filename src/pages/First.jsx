import { useEffect, useState } from "react";
import instance from "../config/axiosConfig";
import "../ecommerce.css";
import { PiCurrencyInr } from "react-icons/pi";
import { Link } from "react-router-dom";
import { useCart } from '../contexts/CartProvider';
import { useAuth } from '../contexts/AuthProvider';
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { FaHeart, FaShoppingCart } from "react-icons/fa";

function First() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const { cartId, setCartId, wishListId, setWishListId, showMessage } =
    useCart();
  const { user } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (!user) return;

    async function fetchUserData() {
      const db = getFirestore();

      const cartSnap = await getDoc(doc(db, "cart", user.uid));
      if (cartSnap.exists()) setCartId(cartSnap.data().items || []);

      const wishlistSnap = await getDoc(doc(db, "wishlist", user.uid));
      if (wishlistSnap.exists()) setWishListId(wishlistSnap.data().items || []);
    }

    fetchUserData();
  }, [user]);

  async function getData() {
    try {
      setLoading(true);

      const response = await instance.get("/product/get");

      if (Array.isArray(response.data)) {
        setProducts(response.data);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("API Error:", error);
      alert("Failed to fetch products. Check console.");
    } finally {
      setLoading(false);
    }
  }

  async function handleAddToCart(productId) {
    if (!user) return navigate("/login");

    setIsUpdating(true);
    try {
      const db = getFirestore();
      const cartRef = doc(db, "cart", user.uid);
      const cartSnap = await getDoc(cartRef);
      const existing = cartSnap.exists() ? cartSnap.data().items || [] : [];

      let updated;
      const found = existing.find((item) => item.productId === productId);

      if (found) {
        updated = existing.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updated = [...existing, { productId, quantity: 1 }];
      }

      await setDoc(cartRef, { items: updated }, { merge: true });
      setCartId(updated);
      showMessage("success", "Added to cart!");
    } catch (err) {
      showMessage("error", "Error adding to cart.");
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleWishList(productId) {
    if (!user) return navigate("/login");

    if (wishListId.includes(productId)) {
      showMessage("success", "Already in wishlist!");
      return;
    }

    setIsUpdating(true);
    try {
      const updated = [...wishListId, productId];

      const db = getFirestore();
      const wishlistRef = doc(db, "wishlist", user.uid);
      await setDoc(wishlistRef, { items: updated }, { merge: true });

      setWishListId(updated);
      showMessage("success", "Added to wishlist!");
    } catch (err) {
      showMessage("error", "Error adding to wishlist.");
    } finally {
      setIsUpdating(false);
    }
  }

  function trimContent(txt, len) {
    if (!txt) return "";
    const arr = txt.split(" ");
    return arr.length > len ? arr.slice(0, len).join(" ") + "..." : txt;
  }

  if (loading) return <div className="loader">Loading...</div>;

  return (
    <>
      <section className="products">
        {products.length > 0 ? (
          products.map((obj) => (
            <div className="product" key={obj._id}>
              <Link to={`/product/${obj._id}`}>
                <img src={obj.image} alt={obj.name} />
              </Link>

              <h3>
                <Link to={`/product/${obj._id}`}>{trimContent(obj.name, 8)}</Link>
              </h3>

              <p className="price">
                <PiCurrencyInr /> {obj.price}
              </p>

              {/* Wishlist + Cart Buttons */}
              <div className="action-buttons">
                <button
                  className="wish-btn"
                  onClick={() => handleWishList(obj._id)}
                >
                  <FaHeart />
                </button>

                <button
                  className="cart-btn"
                  onClick={() => handleAddToCart(obj._id)}
                >
                  <FaShoppingCart />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p style={{ textAlign: "center", width: "100%" }}>
            No products found.
          </p>
        )}
      </section>
    </>
  );
}

export default First;
