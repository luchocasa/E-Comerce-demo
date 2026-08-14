import Link from "next/link";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CheckoutCancelPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center py-16 text-center">
      <XCircle className="h-10 w-10 text-rust" />
      <h1 className="mt-4 font-display text-2xl">Pago cancelado</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        No se completó el pago y no se realizó ningún cargo. Tu carrito sigue intacto,
        puedes intentarlo de nuevo cuando quieras.
      </p>
      <Button asChild className="mt-8">
        <Link href="/">Volver a la tienda</Link>
      </Button>
    </div>
  );
}
