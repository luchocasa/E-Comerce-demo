# MERIDIAN — E-commerce demo (proyecto de portafolio)

Tienda demo full-stack: catálogo con filtros dinámicos, carrito con Redux Toolkit
y checkout real (modo sandbox) con PayPal. Pensado como pieza de portafolio para
mostrar manejo de frontend, backend y pagos en un solo proyecto Next.js.

## Stack

| Capa            | Tecnología                                              |
|-----------------|----------------------------------------------------------|
| Frontend        | Next.js 14 (App Router) + TypeScript + Tailwind CSS      |
| Componentes UI  | shadcn/ui (Radix UI) + Lucide Icons                       |
| Estado global   | Redux Toolkit (carrito)                                   |
| Backend         | API Routes de Next.js (Route Handlers)                    |
| Base de datos   | PostgreSQL + Prisma ORM                                   |
| Pagos           | PayPal Checkout (Orders API v2, modo Sandbox)              |
| Notificaciones  | sonner (toasts)                                            |

## Funcionalidades

- Catálogo de productos con imágenes, categoría y precio.
- **Filtros dinámicos**: por categoría (multi-selección), rango de precio (slider) y
  búsqueda por texto. Todo se sincroniza con la URL (`?category=..&minPrice=..`), así
  que los filtros son compartibles y funcionan con el botón "atrás" del navegador.
- **Carrito** persistente en memoria (Redux) con drawer lateral, edición de cantidades
  y validación de stock.
- **Checkout con PayPal**: al hacer clic en el botón se crea una orden `PENDING` en la
  base de datos y una orden equivalente en PayPal (`/v2/checkout/orders`). El comprador
  aprueba el pago en el popup de PayPal; al aprobarlo se captura el pago
  (`/v2/checkout/orders/{id}/capture`) y la orden local pasa a `PAID`. Los precios
  siempre se recalculan en el servidor (nunca se confía en lo que manda el cliente).
- Página de producto individual + productos relacionados.
- Páginas de confirmación (`/checkout/success`) y cancelación (`/checkout/cancel`).

## Puesta en marcha local

### 1. Instalar dependencias

```bash
npm install
```

### 2. Base de datos (Neon)

1. Crea una cuenta gratis en [neon.tech](https://neon.tech) y un proyecto nuevo
   (Postgres 16, la región más cercana a ti).
2. En el dashboard del proyecto, click en **Connect** y copia las dos connection
   strings: la que tiene `-pooler` en el hostname y la que no lo tiene.
3. Copia `.env.example` a `.env` y pega ahí `DATABASE_URL` (la de `-pooler`, la usa la
   app) y `DIRECT_URL` (la que no tiene `-pooler`, la usa la CLI de Prisma).

   ```bash
   cp .env.example .env
   ```

4. Genera el cliente, crea las tablas y carga los datos de ejemplo:

   ```bash
   npx prisma generate     # descarga el engine de Prisma (requiere internet)
   npm run db:push         # crea las tablas a partir de prisma/schema.prisma
   npm run db:seed         # carga categorías y productos de ejemplo
   ```

5. (Opcional) `npm run db:studio` abre Prisma Studio para ver los datos ya cargados en
   Neon.

> `npx prisma generate` necesita acceso a internet para descargar el motor de consultas
> de Prisma la primera vez. Si trabajas detrás de un proxy/firewall restrictivo, corre
> este paso desde tu máquina local antes de continuar.
>
> ¿Por qué dos URLs? El endpoint `-pooler` de Neon corre PgBouncer en modo transacción,
> lo que rompe *prepared statements* y migraciones largas. Por eso `DATABASE_URL` (con
> pooler) es para las queries normales de tu app, y `DIRECT_URL` (sin pooler) es para
> `prisma generate` / `db push` / `migrate` / `db seed`.

### 3. PayPal (modo sandbox)

1. Entra a [developer.paypal.com](https://developer.paypal.com) con una cuenta PayPal
   (o crea una gratis) y ve a **Apps & Credentials**, pestaña **Sandbox**.
2. Crea una app (tipo "Merchant"). Copia el **Client ID** y el **Secret** de esa app.
3. Pégalos en `.env`: `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET` y también
   `NEXT_PUBLIC_PAYPAL_CLIENT_ID` (mismo valor que `PAYPAL_CLIENT_ID`, pero expuesto al
   cliente porque el botón de PayPal se renderiza en el navegador).
4. En **Sandbox → Accounts** ya tienes una cuenta *personal* de prueba creada por
   defecto: úsala para "comprar" (inicia sesión con ese email/clave de sandbox dentro
   del popup de PayPal, nunca con tu cuenta real).
5. No hace falta nada como la Stripe CLI: al ser un popup con aprobación + captura
   síncrona, no dependemos de webhooks para que el pedido pase a `PAID`. (Como mejora a
   futuro, se puede sumar un webhook de PayPal para reforzar la confirmación server-to-
   server; ver Roadmap).

### 4. Levantar el proyecto

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Estructura del proyecto

```
src/
  app/
    page.tsx                  # catálogo (server component, lee filtros de la URL)
    product/[id]/page.tsx     # detalle de producto
    checkout/success/page.tsx
    checkout/cancel/page.tsx
    api/
      products/route.ts             # GET productos con filtros (también usable por un futuro cliente externo)
      paypal/create-order/route.ts  # POST crea Order local + orden en PayPal
      paypal/capture-order/route.ts # POST captura el pago aprobado y marca la Order como PAID
  components/
    products/                 # ProductCard, ProductGrid, FilterSidebar, AddToCartButton
    cart/                     # CartDrawer, CartItem, PayPalCheckoutButton
    layout/                   # Navbar, Footer
    ui/                       # componentes shadcn/ui (button, sheet, slider, etc.)
  store/                      # Redux Toolkit: store, cartSlice, hooks tipados
  lib/                        # prisma client, cliente REST de PayPal, utils (cn, formatPrice)
  types/                      # tipos compartidos de dominio
prisma/
  schema.prisma                # Category, Product, Order, OrderItem
  seed.ts                       # datos de ejemplo
```

## Decisiones de diseño

- **Filtros vía URL + Server Components**: en vez de manejar el catálogo con estado de
  cliente, `page.tsx` lee `searchParams` y hace la query a Prisma en el servidor. Es
  menos JavaScript en el cliente y los filtros quedan en la URL de forma gratuita.
- **El carrito sí vive en Redux** porque es estado de UI que persiste mientras navegas
  entre páginas (abrir/cerrar el drawer, cantidades, etc.), un caso de uso natural para
  Redux Toolkit.
- **Los precios nunca vienen del cliente**: `/api/paypal/create-order` recalcula todo
  desde la base de datos antes de crear la orden en PayPal, para evitar manipulación
  de precios.
- **Sin SDK de servidor de PayPal**: `@paypal/checkout-server-sdk` está deprecado, así
  que `lib/paypal.ts` habla directo con la REST API (`fetch` + OAuth2 client_credentials),
  que es lo que PayPal recomienda actualmente.
- **Paleta propia** (papel cálido, tinta casi negra, verde como acento de marca,
  tipografía Fraunces/Inter/JetBrains Mono) en vez de un theme por defecto de shadcn.

## Roadmap (ideas para seguir ampliándolo)

- [ ] Webhook de PayPal (`PAYMENT.CAPTURE.COMPLETED`) como confirmación server-to-server
      adicional a la captura síncrona (requiere una URL pública, ej. con `ngrok` en local).
- [ ] Agregar Stripe como método de pago alternativo con tarjeta.
- [ ] Autenticación (NextAuth/Auth.js) + historial de pedidos por usuario.
- [ ] Panel de administración simple para crear/editar productos.
- [ ] Tests: Vitest para lógica de carrito, Playwright para el flujo de checkout.
- [ ] Reseñas y ratings de producto.
- [ ] Internacionalización (es/en) y múltiples monedas.

## Despliegue

- **Frontend**: [Vercel](https://vercel.com) (recomendado, cero configuración con Next.js)
  o Netlify.
- **Base de datos**: [Neon](https://neon.tech) o [Supabase](https://supabase.com)
  (Postgres serverless, capa gratuita).
- Configura las mismas variables de `.env.example` en el panel de tu hosting. Para pasar
  a producción real con PayPal, cambia `PAYPAL_API_BASE` a `https://api-m.paypal.com` y
  usa credenciales de una app "Live" (no Sandbox) del Developer Dashboard.

## Notas

- Este proyecto usa Next.js 14.2.35. La rama 14.x ya está en EOL (fin de soporte); para
  un proyecto nuevo de cero considera empezar directamente en Next.js 15+. Se dejó en
  14 aquí por compatibilidad con el resto del stack elegido, pero está en el último
  parche de seguridad disponible de esa rama.
- Las imágenes de producto son de Unsplash y solo se usan como placeholder de demo.
- No es una tienda real: todos los pagos se procesan en modo sandbox de PayPal.
