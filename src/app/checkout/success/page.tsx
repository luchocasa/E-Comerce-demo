import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const { orderId } = await searchParams;
  const order = orderId
    ? await prisma.order.findUnique({
        where: { id: orderId },
        include: { items: { include: { product: true } } },
      })
    : null;

  return (
    <div className="mx-auto flex max-w-md flex-col items-center py-16 text-center">
      <CheckCircle2 className="h-10 w-10 text-accent" />
      <h1 className="mt-4 font-display text-2xl">¡Pago recibido!</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {order?.status === "PAID"
          ? "Tu orden fue confirmada. Este es un checkout de prueba (PayPal sandbox), no se realizó ningún cargo real."
          : "No pudimos confirmar el estado de tu pago todavía. Si acabas de pagar, refresca en unos segundos."}
      </p>

      {order && (
        <div className="mt-8 w-full rounded border border-border p-5 text-left">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Orden</span>
            <span className="font-mono text-xs">{order.id}</span>
          </div>
          <div className="mt-1 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Estado</span>
            <span className="font-mono text-xs uppercase">{order.status}</span>
          </div>
          <div className="mt-4 divide-y divide-border">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between py-2 text-sm">
                <span>
                  {item.product.name} × {item.quantity}
                </span>
                <span className="font-mono">
                  {formatPrice(item.priceCents * item.quantity)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex justify-between border-t border-border pt-3 text-sm font-medium">
            <span>Total</span>
            <span className="font-mono">{formatPrice(order.totalCents)}</span>
          </div>
        </div>
      )}

      <Button asChild className="mt-8">
        <Link href="/">Seguir explorando</Link>
      </Button>
    </div>
  );
}
