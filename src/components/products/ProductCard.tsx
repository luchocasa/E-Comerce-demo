"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { useAppDispatch } from "@/store/hooks";
import { addItem } from "@/store/cartSlice";
import type { Product } from "@/types";

export function ProductCard({ product }: { product: Product }) {
  const dispatch = useAppDispatch();

  return (
    <Card className="group overflow-hidden border-none bg-transparent shadow-none">
      <Link href={`/product/${product.id}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden rounded bg-muted">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </Link>

      <CardContent className="px-0 pt-3">
        <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
          {product.category.name}
        </p>

        <div className="mt-1 flex items-start justify-between gap-2">
          <Link href={`/product/${product.id}`}>
            <h3 className="font-display text-base leading-snug">
              {product.name}
              <span className="block h-px w-0 origin-left scale-x-0 bg-accent transition-transform duration-200 group-hover:w-full group-hover:animate-underline-in" />
            </h3>
          </Link>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <span className="font-mono text-sm">{formatPrice(product.priceCents)}</span>
          <Button
            size="icon"
            variant="outline"
            className="h-8 w-8"
            aria-label={`Agregar ${product.name} al carrito`}
            onClick={() => dispatch(addItem({ product }))}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
