import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../FireBase.js";
import { onAuthStateChanged } from "firebase/auth";

const cartContext = createContext();


const localStorageCart = () => {
  const stored = localStorage.getItem("storedCart");
  try {
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const initialState = {
  cart: localStorageCart(),
  cartItems: localStorageCart(),
};

function cartReducer(state, action) {
  switch (action.type) {
    case 'SET_CART':
      return { ...state, cart: action.payload };
    case 'SET_CART_ITEMS':
      return { ...state, cartItems: action.payload };
    case 'ADD_TO_CART':
      return { ...state, cart: action.payload };
    case 'REMOVE_FROM_CART':
      return { ...state, cart: action.payload };
    default:
      return state;
  }
}

const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const [currentUser, setCurrentUser] = useState(null);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);

      // When user logs in, load their cart from Firestore
      if (user) {
        loadCartFromFirestore(user.uid);
      }
    });
    return unsubscribe;
  }, []);

  // Load cart from Firestore for authenticated user
  async function loadCartFromFirestore(userId) {
    try {
      const userCartRef = doc(db, "userCarts", userId);
      const docSnap = await getDoc(userCartRef);

      if (docSnap.exists() && Array.isArray(docSnap.data().cart)) {
        dispatch({ type: 'SET_CART', payload: docSnap.data().cart });
      }
    } catch (error) {
      console.error("Error loading cart from Firestore:", error);
    }
  }

  // Save cart to Firestore for authenticated user
  async function saveCartToFirestore(cartData) {
    if (currentUser) {
      try {
        const userCartRef = doc(db, "userCarts", currentUser.uid);
        await setDoc(userCartRef, {
          cart: cartData,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      } catch (error) {
        console.error("Error saving cart to Firestore:", error);
      }
    }
  }

  // Persist cart in localStorage & sync with Firestore if user is logged in
  useEffect(() => {
    localStorage.setItem("storedCart", JSON.stringify(state.cart));
    saveCartToFirestore(state.cart);
  }, [state.cart, currentUser]);

  // Add item to cart
  const addToCart = (productId, quantity = 1) => {
    const existingItemIndex = state.cart.findIndex(item => item.id === productId);
    let updatedCart;

    if (existingItemIndex !== -1) {
      // Item already exists, update quantity
      updatedCart = state.cart.map((item, index) =>
        index === existingItemIndex
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      // New item, add to cart
      updatedCart = [...state.cart, { id: productId, quantity }];
    }

    dispatch({ type: 'ADD_TO_CART', payload: updatedCart });
    return true;
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    const updatedCart = state.cart.filter(item => item.id !== productId);
    dispatch({ type: 'REMOVE_FROM_CART', payload: updatedCart });

    // Also update cartItems to reflect the change immediately
    const updatedCartItems = state.cartItems.filter(item => item._id !== productId);
    dispatch({ type: 'SET_CART_ITEMS', payload: updatedCartItems });

    return true;
  };

  // Update item quantity in cart
  const updateCartItemQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const updatedCart = state.cart.map(item =>
      item.id === productId
        ? { ...item, quantity }
        : item
    );

    dispatch({ type: 'SET_CART', payload: updatedCart });
  };

  // Clear entire cart
  const clearCart = () => {
    dispatch({ type: 'SET_CART', payload: [] });
    dispatch({ type: 'SET_CART_ITEMS', payload: [] });
  };

  const setCart = (payload) => dispatch({ type: 'SET_CART', payload });
  const setCartItems = (payload) => dispatch({ type: 'SET_CART_ITEMS', payload });

  return (
    <cartContext.Provider
      value={{
        cart: state.cart,
        setCart,
        cartItems: state.cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        clearCart,
      }}
    >
      {children}
    </cartContext.Provider>
  );
};

export function useCart() {
  return useContext(cartContext);
}

export default CartProvider;