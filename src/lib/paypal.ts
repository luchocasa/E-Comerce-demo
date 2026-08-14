// Cliente mínimo de la API REST de PayPal (Orders v2), sin SDK oficial de servidor
// (el `@paypal/checkout-server-sdk` está deprecado). Todo vía fetch + OAuth2.
// Docs: https://developer.paypal.com/docs/api/orders/v2/

const PAYPAL_API_BASE = process.env.PAYPAL_API_BASE ?? "https://api-m.sandbox.paypal.com";

function assertCredentials() {
  if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
    throw new Error(
      "Faltan PAYPAL_CLIENT_ID / PAYPAL_CLIENT_SECRET en las variables de entorno"
    );
  }
}

/** Pide un access token OAuth2 (client_credentials) a PayPal. Expira en ~9h. */
async function getAccessToken(): Promise<string> {
  assertCredentials();

  const auth = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString("base64");

  const res = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
  });

  if (!res.ok) {
    console.error("[paypal] error obteniendo access token:", await res.text());
    throw new Error("No se pudo autenticar con PayPal");
  }

  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}

type PayPalLineItem = {
  name: string;
  quantity: number;
  unitAmountCents: number;
};

/**
 * Crea una orden en PayPal (POST /v2/checkout/orders).
 * `referenceId` es el id de nuestra Order local, para poder cruzarla luego.
 */
export async function createPayPalOrder(params: {
  totalCents: number;
  referenceId: string;
  items: PayPalLineItem[];
  currency?: string;
}) {
  const accessToken = await getAccessToken();
  const currency = params.currency ?? "USD";
  const toAmount = (cents: number) => (cents / 100).toFixed(2);

  const res = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: params.referenceId,
          amount: {
            currency_code: currency,
            value: toAmount(params.totalCents),
            breakdown: {
              item_total: { currency_code: currency, value: toAmount(params.totalCents) },
            },
          },
          items: params.items.map((item) => ({
            name: item.name.slice(0, 127),
            quantity: String(item.quantity),
            unit_amount: { currency_code: currency, value: toAmount(item.unitAmountCents) },
          })),
        },
      ],
    }),
    cache: "no-store",
  });

  const data = await res.json();
  if (!res.ok) {
    console.error("[paypal] error creando orden:", data);
    throw new Error("No se pudo crear la orden en PayPal");
  }

  return data as { id: string; status: string };
}

/** Captura el pago de una orden ya aprobada por el comprador (POST /v2/checkout/orders/{id}/capture). */
export async function capturePayPalOrder(paypalOrderId: string) {
  const accessToken = await getAccessToken();

  const res = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${paypalOrderId}/capture`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  const data = await res.json();
  if (!res.ok) {
    console.error("[paypal] error capturando orden:", data);
    throw new Error("No se pudo capturar el pago en PayPal");
  }

  return data as {
    id: string;
    status: string;
    payer?: { email_address?: string };
    purchase_units?: Array<{
      payments?: { captures?: Array<{ id: string; status: string }> };
    }>;
  };
}
