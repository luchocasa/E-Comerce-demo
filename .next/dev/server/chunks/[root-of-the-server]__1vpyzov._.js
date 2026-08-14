module.exports = [
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/runtime-reacts.external.js [external] (next/dist/server/runtime-reacts.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/runtime-reacts.external.js", () => require("next/dist/server/runtime-reacts.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/node:stream [external] (node:stream, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("node:stream", () => require("node:stream"));

module.exports = mod;
}),
"[project]/src/app/api/paypal/create-order/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/prisma.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$paypal$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/paypal.ts [app-route] (ecmascript)");
;
;
;
async function POST(req) {
    try {
        const body = await req.json();
        if (!body.items?.length) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "El carrito está vacío"
            }, {
                status: 400
            });
        }
        const productIds = body.items.map((i)=>i.productId);
        const products = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].product.findMany({
            where: {
                id: {
                    in: productIds
                }
            }
        });
        const lineItems = body.items.map((item)=>{
            const product = products.find((p)=>p.id === item.productId);
            if (!product) throw new Error(`Producto no encontrado: ${item.productId}`);
            if (item.quantity > product.stock) {
                throw new Error(`Sin stock suficiente para ${product.name}`);
            }
            return {
                product,
                quantity: item.quantity
            };
        });
        const totalCents = lineItems.reduce((sum, li)=>sum + li.product.priceCents * li.quantity, 0);
        const order = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].order.create({
            data: {
                totalCents,
                status: "PENDING",
                items: {
                    create: lineItems.map((li)=>({
                            productId: li.product.id,
                            quantity: li.quantity,
                            priceCents: li.product.priceCents
                        }))
                }
            }
        });
        const paypalOrder = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$paypal$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createPayPalOrder"])({
            totalCents,
            referenceId: order.id,
            items: lineItems.map((li)=>({
                    name: li.product.name,
                    quantity: li.quantity,
                    unitAmountCents: li.product.priceCents
                }))
        });
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].order.update({
            where: {
                id: order.id
            },
            data: {
                paypalOrderId: paypalOrder.id
            }
        });
        // El SDK de botones de PayPal espera que createOrder devuelva el id de la
        // orden de PayPal; localOrderId viaja aparte para usarlo al capturar.
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            id: paypalOrder.id,
            localOrderId: order.id
        });
    } catch (error) {
        console.error("[POST /api/paypal/create-order]", error);
        const message = error instanceof Error ? error.message : "Error al iniciar el pago";
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: message
        }, {
            status: 400
        });
    }
}
}),
"[project]/src/lib/paypal.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "capturePayPalOrder",
    ()=>capturePayPalOrder,
    "createPayPalOrder",
    ()=>createPayPalOrder
]);
// Cliente mínimo de la API REST de PayPal (Orders v2), sin SDK oficial de servidor
// (el `@paypal/checkout-server-sdk` está deprecado). Todo vía fetch + OAuth2.
// Docs: https://developer.paypal.com/docs/api/orders/v2/
const PAYPAL_API_BASE = process.env.PAYPAL_API_BASE ?? "https://api-m.sandbox.paypal.com";
function assertCredentials() {
    if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
        throw new Error("Faltan PAYPAL_CLIENT_ID / PAYPAL_CLIENT_SECRET en las variables de entorno");
    }
}
/** Pide un access token OAuth2 (client_credentials) a PayPal. Expira en ~9h. */ async function getAccessToken() {
    assertCredentials();
    const auth = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString("base64");
    const res = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
        method: "POST",
        headers: {
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: "grant_type=client_credentials",
        cache: "no-store"
    });
    if (!res.ok) {
        console.error("[paypal] error obteniendo access token:", await res.text());
        throw new Error("No se pudo autenticar con PayPal");
    }
    const data = await res.json();
    return data.access_token;
}
async function createPayPalOrder(params) {
    const accessToken = await getAccessToken();
    const currency = params.currency ?? "USD";
    const toAmount = (cents)=>(cents / 100).toFixed(2);
    const res = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`
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
                            item_total: {
                                currency_code: currency,
                                value: toAmount(params.totalCents)
                            }
                        }
                    },
                    items: params.items.map((item)=>({
                            name: item.name.slice(0, 127),
                            quantity: String(item.quantity),
                            unit_amount: {
                                currency_code: currency,
                                value: toAmount(item.unitAmountCents)
                            }
                        }))
                }
            ]
        }),
        cache: "no-store"
    });
    const data = await res.json();
    if (!res.ok) {
        console.error("[paypal] error creando orden:", data);
        throw new Error("No se pudo crear la orden en PayPal");
    }
    return data;
}
async function capturePayPalOrder(paypalOrderId) {
    const accessToken = await getAccessToken();
    const res = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${paypalOrderId}/capture`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`
        },
        cache: "no-store"
    });
    const data = await res.json();
    if (!res.ok) {
        console.error("[paypal] error capturando orden:", data);
        throw new Error("No se pudo capturar el pago en PayPal");
    }
    return data;
}
}),
"[project]/src/lib/prisma.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "prisma",
    ()=>prisma
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs, [project]/node_modules/@prisma/client)");
;
// Evita crear múltiples instancias de PrismaClient en desarrollo
// (Next.js recarga módulos en cada cambio con Fast Refresh).
const globalForPrisma = globalThis;
const prisma = globalForPrisma.prisma ?? new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__["PrismaClient"]();
if ("TURBOPACK compile-time truthy", 1) {
    globalForPrisma.prisma = prisma;
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__1vpyzov._.js.map