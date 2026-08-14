import type { Metadata } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { Providers } from "./providers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "MERIDIAN — Tienda demo de portafolio",
  description:
    "Proyecto de portafolio: e-commerce con carrito, filtros dinámicos y checkout con PayPal (sandbox).",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${fraunces.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body>
        <Providers>
          <Navbar />
          <main className="mx-auto min-h-[70vh] max-w-6xl px-4 py-8">{children}</main>
          <Footer />
          <CartDrawer />
          <Toaster position="bottom-center" />
        </Providers>
      </body>
    </html>
  );
}
