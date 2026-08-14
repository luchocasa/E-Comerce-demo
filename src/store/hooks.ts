import { useDispatch, useSelector, type TypedUseSelectorHook } from "react-redux";
import type { RootState, AppDispatch } from "./store";

// Hooks tipados: úsalos en lugar de `useDispatch` / `useSelector` a secas
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useCartTotals = () => {
  const items = useAppSelector((state) => state.cart.items);
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalCents = items.reduce((sum, i) => sum + i.quantity * i.priceCents, 0);
  return { items, totalItems, totalCents };
};
