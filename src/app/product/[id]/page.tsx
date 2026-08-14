import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { AddToCartButton } from "@/components/products/AddToCartButton";
import { ProductGrid } from "@/components/products/ProductGrid";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true },
  });

  if (!product) notFound();

  const related = await prisma.product.findMany({
    where: { categoryId: product.categoryId, id: { not: product.id } },
    include: { category: true },
    take: 3,
  });

  return (
    <div>
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" />
        Volver al catálogo
      </Link>

      <div className="grid gap-10 md:grid-cols-2">
        <div className="relative aspect-[4/5] overflow-hidden rounded bg-muted">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority
          />
          {product.stock <= 5 && (
            <Badge className="absolute left-3 top-3 bg-rust text-rust-foreground">
              Últimas {product.stock} unidades
            </Badge>
          )}
        </div>

        <div className="flex flex-col">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            {product.category.name}
          </p>
          <h1 className="mt-2 font-display text-3xl leading-tight">{product.name}</h1>
          <p className="mt-4 font-mono text-xl">{formatPrice(product.priceCents)}</p>

          <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
            {product.description}
          </p>

          <div className="mt-8 max-w-xs">
            <AddToCartButton product={product} />
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            {product.stock > 0 ? `${product.stock} disponibles` : "Sin stock por ahora"}
          </p>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-20">
          <h2 className="mb-6 font-display text-xl">También te puede interesar</h2>
          <ProductGrid products={related} />
        </div>
      )}
    </div>
  );
}
