"use client";

import { useState } from "react";
import { ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/store/hooks";
import { addItem } from "@/store/cartSlice";
import type { Product } from "@/types";

export function AddToCartButton({ product }: { product: Product }) {
  const dispatch = useAppDispatch();
  const [quantity, setQuantity] = useState(1);
  const outOfStock = product.stock <= 0;

  const handleAdd = () => {
    dispatch(addItem({ product, quantity }));
    toast.success(`${product.name} agregado al carrito`);
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 rounded border border-border">
        <button
          className="p-2.5 hover:bg-muted disabled:opacity-40"
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          disabled={outOfStock}
          aria-label="Disminuir cantidad"
        >
          −
        </button>
        <span className="w-6 text-center font-mono text-sm">{quantity}</span>
        <button
          className="p-2.5 hover:bg-muted disabled:opacity-40"
          onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
          disabled={outOfStock}
          aria-label="Aumentar cantidad"
        >
          +
        </button>
      </div>

      <Button className="flex-1" size="lg" onClick={handleAdd} disabled={outOfStock}>
        <ShoppingBag className="h-4 w-4" />
        {outOfStock ? "Sin stock" : "Agregar al carrito"}
      </Button>
    </div>
  );
}
