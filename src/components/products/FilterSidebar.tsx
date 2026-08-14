"use client";

import { useCallback, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { formatPrice } from "@/lib/utils";

const MAX_PRICE = 20000; // $200.00 en centavos, techo del slider

type Category = { id: string; name: string; slug: string };

function FilterBody({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const activeCategories = searchParams.get("category")?.split(",").filter(Boolean) ?? [];
  const min = Number(searchParams.get("minPrice") ?? 0);
  const max = Number(searchParams.get("maxPrice") ?? MAX_PRICE);
  const [range, setRange] = useState<[number, number]>([min, max]);

  const pushParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === "") params.delete(key);
        else params.set(key, value);
      }
      startTransition(() => router.push(`/?${params.toString()}`));
    },
    [router, searchParams]
  );

  const toggleCategory = (slug: string) => {
    const next = activeCategories.includes(slug)
      ? activeCategories.filter((c) => c !== slug)
      : [...activeCategories, slug];
    pushParams({ category: next.join(",") || null });
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Categoría
        </h3>
        <div className="flex flex-col gap-2.5">
          {categories.map((c) => (
            <label key={c.id} className="flex items-center gap-2.5 text-sm">
              <Checkbox
                checked={activeCategories.includes(c.slug)}
                onCheckedChange={() => toggleCategory(c.slug)}
              />
              {c.name}
            </label>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Precio
        </h3>
        <Slider
          min={0}
          max={MAX_PRICE}
          step={500}
          value={range}
          onValueChange={(v) => setRange([v[0], v[1]] as [number, number])}
          onValueCommit={(v) =>
            pushParams({ minPrice: String(v[0]), maxPrice: String(v[1]) })
          }
        />
        <div className="mt-2 flex justify-between font-mono text-xs text-muted-foreground">
          <span>{formatPrice(range[0])}</span>
          <span>{formatPrice(range[1])}</span>
        </div>
      </div>

      <Separator />

      <Button
        variant="ghost"
        size="sm"
        className="justify-start px-0 text-muted-foreground"
        onClick={() => {
          setRange([0, MAX_PRICE]);
          router.push("/");
        }}
      >
        Limpiar filtros
      </Button>
    </div>
  );
}

export function FilterSidebar({ categories }: { categories: Category[] }) {
  return (
    <>
      {/* Desktop: sidebar fija */}
      <aside className="hidden w-56 shrink-0 md:block">
        <FilterBody categories={categories} />
      </aside>

      {/* Mobile: se abre en un Sheet */}
      <div className="mb-4 md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm">
              <SlidersHorizontal className="h-4 w-4" />
              Filtros
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>Filtros</SheetTitle>
            </SheetHeader>
            <div className="pt-6">
              <FilterBody categories={categories} />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
