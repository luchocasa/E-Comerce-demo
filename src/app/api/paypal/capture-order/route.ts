import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { capturePayPalOrder } from "@/lib/paypal";

type CaptureBody = {
  orderID: string; // id de la orden en PayPal (viene del onApprove del botón)
  localOrderId: string; // id de nuestra Order en la base de datos
};

// POST /api/paypal/capture-order
// Se llama en el onApprove del botón, una vez que el comprador aprobó el pago
// en PayPal. Captura el dinero y marca la Order local como PAID.
export async function POST(req: NextRequest) {
  try {
    const body: CaptureBody = await req.json();

    if (!body.orderID || !body.localOrderId) {
      return NextResponse.json({ error: "Faltan datos de la orden" }, { status: 400 });
    }

    const capture = await capturePayPalOrder(body.orderID);
    const captureId = capture.purchase_units?.[0]?.payments?.captures?.[0]?.id;
    const status = capture.status === "COMPLETED" ? "PAID" : "FAILED";

    const order = await prisma.order.update({
      where: { id: body.localOrderId },
      data: {
        status,
        paypalCaptureId: captureId,
        customerEmail: capture.payer?.email_address,
      },
    });

    return NextResponse.json({ status: order.status, orderId: order.id });
  } catch (error) {
    console.error("[POST /api/paypal/capture-order]", error);
    return NextResponse.json({ error: "No se pudo confirmar el pago" }, { status: 400 });
  }
}
