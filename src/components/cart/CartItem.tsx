"use client";

import Image from "next/image";
import { Minus, Plus, X } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useAppDispatch } from "@/store/hooks";
import { updateQuantity, removeItem } from "@/store/cartSlice";
import type { CartItem as CartItemType } from "@/types";

export function CartItem({ item }: { item: CartItemType }) {
  const dispatch = useAppDispatch();

  return (
    <div className="flex gap-3 py-4">
      <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded bg-muted">
        <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
      </div>

      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <p className="font-display text-sm leading-snug">{item.name}</p>
          <button
            onClick={() => dispatch(removeItem({ productId: item.productId }))}
            className="text-muted-foreground hover:text-rust"
            aria-label={`Quitar ${item.name}`}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center gap-2 rounded border border-border">
            <button
              className="p-1.5 hover:bg-muted disabled:opacity-40"
              onClick={() =>
                dispatch(updateQuantity({ productId: item.productId, quantity: item.quantity - 1 }))
              }
              aria-label="Disminuir cantidad"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="w-4 text-center font-mono text-xs">{item.quantity}</span>
            <button
              className="p-1.5 hover:bg-muted disabled:opacity-40"
              disabled={item.quantity >= item.stock}
              onClick={() =>
                dispatch(updateQuantity({ productId: item.productId, quantity: item.quantity + 1 }))
              }
              aria-label="Aumentar cantidad"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
          <span className="font-mono text-sm">{formatPrice(item.priceCents * item.quantity)}</span>
        </div>
      </div>
    </div>
  );
}
