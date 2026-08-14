import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Formatea centavos a un precio legible, ej: 3400 -> "$34.00" */
export function formatPrice(cents: number, currency: string = "USD") {
  return new Intl.NumberFormat("es-419", {
    style: "currency",
    currency,
  }).format(cents / 100);
}
