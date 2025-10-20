"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { IDish } from "@/types/dish";
import { CartItem } from "@/types/order";


interface CartContextType {
  cart: Map<string, CartItem>;
  addToCart: (dish: IDish, quantity: number) => void;
  removeFromCart: (dishId: string) => void;
  updateQuantity: (dishId: string, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getTotalPrice: () => number;
  getCartItems: () => CartItem[];
  getItemQuantity: (dishId: string) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Map<string, CartItem>>(new Map());

  // Add dish to cart
  const addToCart = (dish: IDish, quantity: number) => {
    setCart((prev) => {
      const newCart = new Map(prev);
      const existingItem = newCart.get(dish.id);

      if (existingItem) {
        newCart.set(dish.id, {
          ...existingItem,
          quantity: existingItem.quantity + quantity,
        });
      } else {
        newCart.set(dish.id, {
          dish,
          quantity: quantity,
        });
      }
      return newCart;
    });
  };

  const removeFromCart = (dishId: string) => {
    setCart((prev) => {
      const newCart = new Map(prev);
      const existingItem = newCart.get(dishId);

      if (existingItem) {
        if (existingItem.quantity <= 1) {
          newCart.delete(dishId);
        } else {
          newCart.set(dishId, {
            ...existingItem,
            quantity: existingItem.quantity - 1,
          });
        }
      }
      return newCart;
    });
  };

  const updateQuantity = (dishId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(dishId);
      return;
    }

    setCart((prev) => {
      const newCart = new Map(prev);
      const existingItem = newCart.get(dishId);

      if (existingItem) {
        newCart.set(dishId, {
          ...existingItem,
          quantity,
        });
      }
      return newCart;
    });
  };

  const clearCart = () => {
    setCart(new Map());
  };

  const getItemCount = () => {
    return Array.from(cart.values()).reduce(
      (sum, item) => sum + item.quantity,
      0
    );
  };

  const getTotalPrice = () => {
    return Array.from(cart.values()).reduce((sum, item) => {
      return sum + item.dish.price * item.quantity;
    }, 0);
  };

  const getCartItems = (): CartItem[] => {
    return Array.from(cart.values());
  };

  const getItemQuantity = (dishId: string): number => {
    return cart.get(dishId)?.quantity || 0;
  };

  const value: CartContextType = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getItemCount,
    getTotalPrice,
    getCartItems,
    getItemQuantity,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
