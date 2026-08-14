"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { toast } from "sonner";
import { useAppDispatch } from "@/store/hooks";
import { clearCart, closeCart } from "@/store/cartSlice";
import type { CartItem } from "@/types";

export function PayPalCheckoutButton({ items }: { items: CartItem[] }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  // El botón de PayPal separa createOrder de onApprove en dos llamadas distintas;
  // usamos un ref para pasar el id de nuestra Order local de una a la otra.
  const localOrderIdRef = useRef<string | null>(null);

  return (
    <PayPalButtons
      style={{ layout: "vertical", shape: "rect", label: "pay", height: 45 }}
      disabled={items.length === 0}
      forceReRender={[items.map((i) => `${i.productId}:${i.quantity}`).join("|")]}
      createOrder={async () => {
        const res = await fetch("/api/paypal/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
          }),
        });
        const data = await res.json();
        if (!res.ok || !data.id) {
          toast.error(data.error ?? "No se pudo iniciar el pago con PayPal");
          throw new Error(data.error ?? "No se pudo crear la orden");
        }
        localOrderIdRef.current = data.localOrderId;
        return data.id;
      }}
      onApprove={async (data) => {
        try {
          const res = await fetch("/api/paypal/capture-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderID: data.orderID,
              localOrderId: localOrderIdRef.current,
            }),
          });
          const result = await res.json();
          if (!res.ok || result.status !== "PAID") {
            throw new Error(result.error ?? "El pago no se pudo confirmar");
          }
          dispatch(clearCart());
          dispatch(closeCart());
          router.push(`/checkout/success?orderId=${result.orderId}`);
        } catch (err) {
          console.error(err);
          toast.error("Hubo un problema al confirmar el pago. Intenta de nuevo.");
        }
      }}
      onCancel={() => {
        toast.message("Pago cancelado", { description: "No se realizó ningún cargo." });
      }}
      onError={(err) => {
        console.error("[paypal buttons]", err);
        toast.error("Ocurrió un error con PayPal. Intenta de nuevo.");
      }}
    />
  );
}
