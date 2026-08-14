import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

// GET /api/products?category=cocina,textiles&search=lampara&minPrice=0&maxPrice=20000&sort=price_asc
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const categorySlugs = searchParams.get("category")?.split(",").filter(Boolean);
  const search = searchParams.get("search")?.trim();
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const sort = searchParams.get("sort");

  const where: Prisma.ProductWhereInput = {};

  if (categorySlugs?.length) {
    where.category = { slug: { in: categorySlugs } };
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  if (minPrice || maxPrice) {
    where.priceCents = {
      ...(minPrice ? { gte: Number(minPrice) } : {}),
      ...(maxPrice ? { lte: Number(maxPrice) } : {}),
    };
  }

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    sort === "price_asc"
      ? { priceCents: "asc" }
      : sort === "price_desc"
        ? { priceCents: "desc" }
        : { createdAt: "desc" };

  try {
    const products = await prisma.product.findMany({
      where,
      orderBy,
      include: { category: true },
    });
    return NextResponse.json({ products });
  } catch (error) {
    console.error("[GET /api/products]", error);
    return NextResponse.json({ error: "No se pudieron cargar los productos" }, { status: 500 });
  }
}
