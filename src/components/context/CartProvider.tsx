"use client";
import type {ReactNode} from "react";

import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import type { IDish } from "@/types/dish";

interface CartItem {
  dish: IDish;
  quantity: number;
}

interface RestaurantCarts {
  [restaurantId: string]: Map<string, CartItem>;
}

interface CartContextType {
  restaurantCarts: RestaurantCarts;
  addToCart: (restaurantId: string, dish: IDish, quantity: number) => void;
  removeFromCart: (restaurantId: string, dishId: string) => void;
  updateQuantity: (
    restaurantId: string,
    dishId: string,
    quantity: number
  ) => void;
  clearCart: (restaurantId: string) => void;
  clearAllCarts: () => void;
  getItemCount: (restaurantId: string) => number;
  getTotalPrice: (restaurantId: string) => number;
  getCartItems: (restaurantId: string) => CartItem[];
  getItemQuantity: (restaurantId: string, dishId: string) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Helper function to serialize Map for localStorage
const serializeCarts = (carts: RestaurantCarts): string => {
  const serialized: any = {};
  Object.keys(carts).forEach((restaurantId) => {
    serialized[restaurantId] = Array.from(carts[restaurantId].entries());
  });
  return JSON.stringify(serialized);
};

// Helper function to deserialize from localStorage
const deserializeCarts = (serialized: string): RestaurantCarts => {
  try {
    const parsed = JSON.parse(serialized);
    const carts: RestaurantCarts = {};
    Object.keys(parsed).forEach((restaurantId) => {
      carts[restaurantId] = new Map(parsed[restaurantId]);
    });
    return carts;
  } catch {
    return {};
  }
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [restaurantCarts, setRestaurantCarts] = useState<RestaurantCarts>({});

  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCarts = localStorage.getItem("meowth-carts");
    if (savedCarts) {
      setRestaurantCarts(deserializeCarts(savedCarts));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("meowth-carts", serializeCarts(restaurantCarts));
  }, [restaurantCarts]);

  // Validate restaurantId
  const validateRestaurantId = (restaurantId: string): boolean => {
    return !!restaurantId && typeof restaurantId === 'string' && restaurantId.trim().length > 0;
  };

  const addToCart = (restaurantId: string, dish: IDish, quantity: number) => {
    if (!validateRestaurantId(restaurantId)) {
      console.warn('Invalid restaurantId provided to addToCart');
      return;
    }

    setRestaurantCarts((prev) => {
      const newCarts = { ...prev };
      const cart = newCarts[restaurantId] || new Map();
      const existingItem = cart.get(dish.id);

      if (existingItem) {
        cart.set(dish.id, {
          ...existingItem,
          quantity: existingItem.quantity + quantity,
        });
      } else {
        cart.set(dish.id, {
          dish,
          quantity: quantity,
        });
      }
      newCarts[restaurantId] = new Map(cart);
      return newCarts;
    });
  };

  const removeFromCart = (restaurantId: string, dishId: string) => {
    if (!validateRestaurantId(restaurantId)) {
      console.warn('Invalid restaurantId provided to removeFromCart');
      return;
    }

    setRestaurantCarts((prev) => {
      const newCarts = { ...prev };
      const cart = newCarts[restaurantId];

      if (cart) {
        const existingItem = cart.get(dishId);
        if (existingItem) {
          if (existingItem.quantity <= 1) {
            cart.delete(dishId);
          } else {
            cart.set(dishId, {
              ...existingItem,
              quantity: existingItem.quantity - 1,
            });
          }
          newCarts[restaurantId] = new Map(cart);
        }
      }
      return newCarts;
    });
  };

  const updateQuantity = (
    restaurantId: string,
    dishId: string,
    quantity: number
  ) => {
    if (!validateRestaurantId(restaurantId)) {
      console.warn('Invalid restaurantId provided to updateQuantity');
      return;
    }

    if (quantity <= 0) {
      removeFromCart(restaurantId, dishId);
      return;
    }

    setRestaurantCarts((prev) => {
      const newCarts = { ...prev };
      const cart = newCarts[restaurantId];

      if (cart) {
        const existingItem = cart.get(dishId);
        if (existingItem) {
          cart.set(dishId, {
            ...existingItem,
            quantity,
          });
          newCarts[restaurantId] = new Map(cart);
        }
      }
      return newCarts;
    });
  };

  const clearCart = (restaurantId: string) => {
    if (!validateRestaurantId(restaurantId)) {
      console.warn('Invalid restaurantId provided to clearCart');
      return;
    }

    setRestaurantCarts((prev) => ({
      ...prev,
      [restaurantId]: new Map(),
    }));
  };

  const clearAllCarts = () => {
    setRestaurantCarts({});
  };

  const getItemCount = (restaurantId: string): number => {
    if (!validateRestaurantId(restaurantId)) {
      return 0;
    }

    const cart = restaurantCarts[restaurantId];
    if (!cart) return 0;
    return Array.from(cart.values()).reduce(
      (sum, item) => sum + item.quantity,
      0
    );
  };

  const getTotalPrice = (restaurantId: string): number => {
    if (!validateRestaurantId(restaurantId)) {
      return 0;
    }

    const cart = restaurantCarts[restaurantId];
    if (!cart) return 0;
    return Array.from(cart.values()).reduce((sum, item) => {
      return sum + item.dish.price * item.quantity;
    }, 0);
  };

  const getCartItems = (restaurantId: string): CartItem[] => {
    if (!validateRestaurantId(restaurantId)) {
      return [];
    }

    const cart = restaurantCarts[restaurantId];
    if (!cart) return [];
    return Array.from(cart.values());
  };

  const getItemQuantity = (restaurantId: string, dishId: string): number => {
    if (!validateRestaurantId(restaurantId)) {
      return 0;
    }

    const cart = restaurantCarts[restaurantId];
    if (!cart) return 0;
    return cart.get(dishId)?.quantity || 0;
  };

  const value: CartContextType = {
    restaurantCarts,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    clearAllCarts,
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