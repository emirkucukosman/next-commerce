import createStore from "zustand";

// Lib
import { Product } from "@prisma/client";

export interface CartItem extends Product {
  quantity: number;
}

interface CartStore {
  cart: CartItem[];
  addToCart: (cartItem: CartItem) => void;
  itemExists: (productId: number) => boolean;
  increaseQuantity: (productId: number, by: number) => void;
  removeFromCart: (productId: number) => void;
}

export const useCartStore = createStore<CartStore>((set, get) => ({
  cart: [],
  addToCart: (cartItem) => {
    // Check if item already exists in cart
    if (get().itemExists(cartItem.id)) {
      // If it does, increase quantity by quantity argument
      return get().increaseQuantity(cartItem.id, cartItem.quantity);
    }
    // If it doesn't, add it to cart
    set((state) => ({
      cart: [...state.cart, cartItem],
    }));
  },
  // Check if item exists in cart
  itemExists: (productId) => {
    return get().cart.some((item) => item.id === productId);
  },
  // Increase quantity of item in cart
  increaseQuantity: (productId, by) => {
    set((state) => ({
      cart: state.cart.map((cartItem) => {
        if (cartItem.id === productId) {
          return { ...cartItem, quantity: cartItem.quantity + by };
        }
        return cartItem;
      }),
    }));
  },
  // Remove item from cart
  removeFromCart: (productId) => {
    set((state) => ({
      cart: state.cart.filter((item) => item.id !== productId),
    }));
  },
}));
