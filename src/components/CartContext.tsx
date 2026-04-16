import React, { createContext, useContext, useState, useCallback } from "react";

export type PizzaSize = "SM" | "MD" | "XXL";

export interface ExtraOption {
  name: string;
  price: number;
  icon: string;
}

export const EXTRA_OPTIONS: ExtraOption[] = [
  { name: "Extra Cheese", price: 2.5, icon: "🧀" },
  { name: "Extra Garlic", price: 1.5, icon: "🧄" },
  { name: "Mushrooms", price: 2.0, icon: "🍄" },
  { name: "Olives", price: 1.5, icon: "🫒" },
  { name: "Spicy Sauce", price: 1.0, icon: "🌶️" },
];

export const SIZE_MULTIPLIER: Record<PizzaSize, number> = {
  SM: 0.8,
  MD: 1,
  XXL: 1.4,
};

export const SIZE_LABELS: Record<PizzaSize, string> = {
  SM: "Small 8\"",
  MD: "Medium 12\"",
  XXL: "Extra Large 16\"",
};

export interface CartItem {
  id: string;
  name: string;
  basePrice: number;
  image: string;
  quantity: number;
  size: PizzaSize;
  extras: string[];
}

export const getItemPrice = (item: CartItem): number => {
  const sizePrice = item.basePrice * SIZE_MULTIPLIER[item.size];
  const extrasPrice = item.extras.reduce((sum, extraName) => {
    const extra = EXTRA_OPTIONS.find((e) => e.name === extraName);
    return sum + (extra?.price || 0);
  }, 0);
  return sizePrice + extrasPrice;
};

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "id" | "quantity">) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  totalItems: number;
  totalPrice: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  checkoutOpen: boolean;
  setCheckoutOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const addToCart = useCallback((item: Omit<CartItem, "id" | "quantity">) => {
    const id = `${item.name}-${item.size}-${item.extras.sort().join(",")}`;
    setItems((prev) => {
      const existing = prev.find((i) => i.id === id);
      if (existing) {
        return prev.map((i) => (i.id === id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prev, { ...item, id, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.id !== id));
    } else {
      setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity } : i)));
    }
  }, []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.quantity * getItemPrice(i), 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQuantity, totalItems, totalPrice, isOpen, setIsOpen, checkoutOpen, setCheckoutOpen }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
