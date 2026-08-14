import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createPayPalOrder } from "@/lib/paypal";

type CreateOrderBody = {
  items: { productId: string; quantity: number }[];
};

// POST /api/paypal/create-order
// 1) Crea una Order local en estado PENDING con los precios recalculados desde la BD.
// 2) Crea la orden equivalente en PayPal (Orders API v2) y devuelve su id al botón.
// Los precios SIEMPRE se recalculan en el servidor: nunca se confía en lo que
// manda el cliente.
export async function POST(req: NextRequest) {
  try {
    const body: CreateOrderBody = await req.json();

    if (!body.items?.length) {
      return NextResponse.json({ error: "El carrito está vacío" }, { status: 400 });
    }

    const productIds = body.items.map((i) => i.productId);
    const products = await prisma.product.findMany({ where: { id: { in: productIds } } });

    const lineItems = body.items.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) throw new Error(`Producto no encontrado: ${item.productId}`);
      if (item.quantity > product.stock) {
        throw new Error(`Sin stock suficiente para ${product.name}`);
      }
      return { product, quantity: item.quantity };
    });

    const totalCents = lineItems.reduce(
      (sum, li) => sum + li.product.priceCents * li.quantity,
      0
    );

    const order = await prisma.order.create({
      data: {
        totalCents,
        status: "PENDING",
        items: {
          create: lineItems.map((li) => ({
            productId: li.product.id,
            quantity: li.quantity,
            priceCents: li.product.priceCents,
          })),
        },
      },
    });

    const paypalOrder = await createPayPalOrder({
      totalCents,
      referenceId: order.id,
      items: lineItems.map((li) => ({
        name: li.product.name,
        quantity: li.quantity,
        unitAmountCents: li.product.priceCents,
      })),
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { paypalOrderId: paypalOrder.id },
    });

    // El SDK de botones de PayPal espera que createOrder devuelva el id de la
    // orden de PayPal; localOrderId viaja aparte para usarlo al capturar.
    return NextResponse.json({ id: paypalOrder.id, localOrderId: order.id });
  } catch (error) {
    console.error("[POST /api/paypal/create-order]", error);
    const message = error instanceof Error ? error.message : "Error al iniciar el pago";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
