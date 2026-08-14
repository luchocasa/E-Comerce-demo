import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CartItem, Product } from "@/types";

type CartState = {
  items: CartItem[];
  isOpen: boolean;
};

const initialState: CartState = {
  items: [],
  isOpen: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<{ product: Product; quantity?: number }>) => {
      const { product, quantity = 1 } = action.payload;
      const existing = state.items.find((i) => i.productId === product.id);

      if (existing) {
        existing.quantity = Math.min(existing.quantity + quantity, product.stock);
      } else {
        state.items.push({
          productId: product.id,
          name: product.name,
          slug: product.slug,
          priceCents: product.priceCents,
          imageUrl: product.imageUrl,
          quantity: Math.min(quantity, product.stock),
          stock: product.stock,
        });
      }
      state.isOpen = true;
    },

    removeItem: (state, action: PayloadAction<{ productId: string }>) => {
      state.items = state.items.filter((i) => i.productId !== action.payload.productId);
    },

    updateQuantity: (
      state,
      action: PayloadAction<{ productId: string; quantity: number }>
    ) => {
      const item = state.items.find((i) => i.productId === action.payload.productId);
      if (!item) return;
      if (action.payload.quantity <= 0) {
        state.items = state.items.filter((i) => i.productId !== action.payload.productId);
      } else {
        item.quantity = Math.min(action.payload.quantity, item.stock);
      }
    },

    clearCart: (state) => {
      state.items = [];
    },

    openCart: (state) => {
      state.isOpen = true;
    },

    closeCart: (state) => {
      state.isOpen = false;
    },

    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },
  },
});

export const {
  addItem,
  removeItem,
  updateQuantity,
  clearCart,
  openCart,
  closeCart,
  toggleCart,
} = cartSlice.actions;

export default cartSlice.reducer;
