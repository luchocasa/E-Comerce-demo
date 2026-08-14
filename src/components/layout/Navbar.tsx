"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, ShoppingBag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useCartTotals } from "@/store/hooks";
import { toggleCart } from "@/store/cartSlice";

export function Navbar() {
  const dispatch = useAppDispatch();
  const { totalItems } = useCartTotals();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("search") ?? "");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (query.trim()) params.set("search", query.trim());
    else params.delete("search");
    router.push(`/?${params.toString()}`);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4">
        <Link href="/" className="font-display text-2xl tracking-tight">
          MERIDIAN
        </Link>

        <form onSubmit={handleSearch} className="relative ml-auto hidden max-w-xs flex-1 md:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar productos..."
            className="pl-9"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </form>

        <Button
          variant="ghost"
          size="icon"
          className="relative ml-auto md:ml-0"
          onClick={() => dispatch(toggleCart())}
          aria-label="Abrir carrito"
        >
          <ShoppingBag className="h-5 w-5" />
          {totalItems > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 font-mono text-[10px] text-accent-foreground">
              {totalItems}
            </span>
          )}
        </Button>
      </div>
    </header>
  );
}
