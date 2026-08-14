import { ProductCard } from "./ProductCard";
import type { Product } from "@/types";

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded border border-dashed border-border py-24 text-center">
        <p className="font-display text-lg">Sin resultados</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Ajusta los filtros o prueba con otra búsqueda.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
