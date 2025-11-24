import React, { useEffect, useState } from "react";
import { useCart } from "../contexts/CartProvider";
import instance from "../config/axiosConfig";

function Cart() {
  const {
    cart,
    setCart,
    cartItems,
    setCartItems,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
  } = useCart();

  const [loading, setLoading] = useState(false);

  // When cart (ids + quantities) changes, fetch product details
  useEffect(() => {
    let mounted = true;
    async function fetchCartItems() {
      if (!cart || cart.length === 0) {
        if (mounted) setCartItems([]);
        return;
      }

      setLoading(true);
      try {
        const promises = cart.map((c) => instance.get(`/product/product/${c.id}`));
        const results = await Promise.all(promises);
        const products = results.map((r) => r.data);
        // attach quantity from cart
        const merged = products.map((p) => {
          const q = cart.find((ci) => ci.id === p._id)?.quantity || 1;
          return { ...p, quantity: q };
        });
        if (mounted) setCartItems(merged);
      } catch (err) {
        console.error("Failed to load cart items:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchCartItems();
    return () => (mounted = false);
  }, [cart]);

  function handleRemove(id) {
    // update cart (ids + quantities)
    const updated = cart.filter((c) => c.id !== id);
    setCart(updated);
    // cartItems will be updated by effect
  }

  function changeQuantity(id, newQty) {
    const updated = cart.map((c) => (c.id === id ? { ...c, quantity: newQty } : c));
    setCart(updated);
  }

  if (loading) return <div className="loader">Loading cart...</div>;

  if (!cart || cart.length === 0) {
    return <div style={{ padding: 20 }}>Your cart is empty.</div>;
  }

  return (
    <section className="cart-page" style={{ padding: 20 }}>
      <h2>Your Cart</h2>
      <button onClick={() => { clearCart(); }} style={{ marginBottom: 12 }}>
        Clear Cart
      </button>

      <div className="cart-items">
        {cartItems && cartItems.length > 0 ? (
          cartItems.map((item) => (
            <div key={item._id} className="cart-item" style={{ display: "flex", gap: 12, marginBottom: 16 }}>
              <img src={item.image} alt={item.name} style={{ width: 100, height: 100, objectFit: "cover" }} />
              <div style={{ flex: 1 }}>
                <h3>{item.name}</h3>
                <p>Price: ₹{item.price}</p>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <label>Qty:</label>
                  <input
                    type="number"
                    value={item.quantity}
                    min={1}
                    onChange={(e) => changeQuantity(item._id, Number(e.target.value))}
                    style={{ width: 60 }}
                  />
                  <button onClick={() => handleRemove(item._id)}>Remove</button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No detailed items to show yet.</p>
        )}
      </div>
    </section>
  );
}

export default Cart;