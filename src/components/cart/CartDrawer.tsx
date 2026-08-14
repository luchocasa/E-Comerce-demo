"use client";

import { ShoppingBag } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";
import { useAppDispatch, useAppSelector, useCartTotals } from "@/store/hooks";
import { closeCart } from "@/store/cartSlice";
import { CartItem } from "./CartItem";
import { PayPalCheckoutButton } from "./PayPalCheckoutButton";

export function CartDrawer() {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.cart.isOpen);
  const { items, totalCents } = useCartTotals();

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && dispatch(closeCart())}>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Tu carrito</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center text-muted-foreground">
            <ShoppingBag className="h-8 w-8" />
            <p className="text-sm">Tu carrito está vacío</p>
          </div>
        ) : (
          <>
            <div className="flex-1 divide-y divide-border overflow-y-auto">
              {items.map((item) => (
                <CartItem key={item.productId} item={item} />
              ))}
            </div>

            <div>
              <Separator />
              <div className="flex items-center justify-between py-4">
                <span className="text-sm text-muted-foreground">Total</span>
                <span className="font-mono text-lg">{formatPrice(totalCents)}</span>
              </div>

              <PayPalCheckoutButton items={items} />

              <p className="mt-3 text-center text-[11px] text-muted-foreground">
                Pago simulado en el sandbox de PayPal — no se realizan cargos reales.
              </p>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

