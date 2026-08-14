import { prisma } from "@/lib/prisma";
import { FilterSidebar } from "@/components/products/FilterSidebar";
import { ProductGrid } from "@/components/products/ProductGrid";
import type { Prisma } from "@prisma/client";

type SearchParams = {
  category?: string;
  search?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: string;
};

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  const where: Prisma.ProductWhereInput = {};
  const categorySlugs = params.category?.split(",").filter(Boolean);

  if (categorySlugs?.length) {
    where.category = { slug: { in: categorySlugs } };
  }
  if (params.search) {
    where.OR = [
      { name: { contains: params.search, mode: "insensitive" } },
      { description: { contains: params.search, mode: "insensitive" } },
    ];
  }
  if (params.minPrice || params.maxPrice) {
    where.priceCents = {
      ...(params.minPrice ? { gte: Number(params.minPrice) } : {}),
      ...(params.maxPrice ? { lte: Number(params.maxPrice) } : {}),
    };
  }

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    params.sort === "price_asc"
      ? { priceCents: "asc" }
      : params.sort === "price_desc"
        ? { priceCents: "desc" }
        : { createdAt: "desc" };

  const products = await prisma.product.findMany({
    where,
    orderBy,
    include: { category: true },
  });

  return (
    <div>
      <div className="mb-10 max-w-xl">
        <h1 className="font-display text-4xl leading-tight">
          Objetos con propósito para el hogar.
        </h1>
        <p className="mt-3 text-muted-foreground">
          Catálogo demo con filtros dinámicos por categoría y precio — parte de un
          proyecto de portafolio.
        </p>
      </div>

      <div className="flex flex-col gap-8 md:flex-row">
        <FilterSidebar categories={categories} />
        <div className="flex-1">
          <ProductGrid products={products} />
        </div>
      </div>
    </div>
  );
}
