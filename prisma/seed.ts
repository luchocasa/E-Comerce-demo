import { PrismaClient } from "@prisma/client";

// El seed corre muchas queries seguidas: si tu DATABASE_URL pasa por el pooler
// de Neon (PgBouncer en modo transacción), puede fallar con errores de
// "prepared statement already exists". Por eso, si existe DIRECT_URL (conexión
// sin -pooler) la usamos acá explícitamente; si no, caemos a DATABASE_URL.
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL ?? process.env.DATABASE_URL,
    },
  },
});

const categories = [
  { name: "Cocina", slug: "cocina" },
  { name: "Textiles", slug: "textiles" },
  { name: "Iluminación", slug: "iluminacion" },
  { name: "Mobiliario", slug: "mobiliario" },
];

// Imágenes de Unsplash (uso libre) sólo como placeholder de demo.
const products = [
  { name: "Set de tazones de cerámica", slug: "set-tazones-ceramica", categorySlug: "cocina", priceCents: 3400, description: "Set de 4 tazones de cerámica esmaltada a mano, ideales para cocinar y servir.", imageUrl: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=600" },
  { name: "Prensa francesa de vidrio", slug: "prensa-francesa-vidrio", categorySlug: "cocina", priceCents: 2800, description: "Cafetera de émbolo de 1L, vidrio borosilicato y estructura de acero inoxidable.", imageUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600" },
  { name: "Tabla de cortar de roble", slug: "tabla-cortar-roble", categorySlug: "cocina", priceCents: 4200, description: "Tabla maciza de roble con asa integrada, tratada con aceite mineral.", imageUrl: "https://images.unsplash.com/photo-1594385208974-2e75f8d7bb48?w=600" },
  { name: "Manta de lana merino", slug: "manta-lana-merino", categorySlug: "textiles", priceCents: 8900, description: "Manta tejida en lana merino 100%, 130x180cm, disponible en tono natural.", imageUrl: "https://images.unsplash.com/photo-1580301762395-83f8b0414de6?w=600" },
  { name: "Funda de cojín de lino", slug: "funda-cojin-lino", categorySlug: "textiles", priceCents: 1900, description: "Funda de lino lavado 45x45cm con cierre invisible, tacto suave y transpirable.", imageUrl: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600" },
  { name: "Alfombra de fibra natural", slug: "alfombra-fibra-natural", categorySlug: "textiles", priceCents: 12900, description: "Alfombra tejida a mano en yute, 160x230cm, resistente y de bajo mantenimiento.", imageUrl: "https://images.unsplash.com/photo-1600166898405-da9535204843?w=600" },
  { name: "Lámpara de mesa de latón", slug: "lampara-mesa-laton", categorySlug: "iluminacion", priceCents: 6700, description: "Lámpara de mesa con base de latón cepillado y pantalla de lino color crudo.", imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600" },
  { name: "Aplique de pared regulable", slug: "aplique-pared-regulable", categorySlug: "iluminacion", priceCents: 5400, description: "Aplique articulado de acero negro mate, ideal para lectura junto a la cama.", imageUrl: "https://images.unsplash.com/photo-1524634126442-357e0eac3c14?w=600" },
  { name: "Guirnalda de luces cálidas", slug: "guirnalda-luces-calidas", categorySlug: "iluminacion", priceCents: 2200, description: "Guirnalda de 20 luces LED de bajo consumo, 4 metros, temperatura cálida.", imageUrl: "https://images.unsplash.com/photo-1482849297070-f4fae2173efe?w=600" },
  { name: "Silla de roble y ratán", slug: "silla-roble-ratan", categorySlug: "mobiliario", priceCents: 15900, description: "Silla de comedor con estructura de roble macizo y respaldo tejido en ratán.", imageUrl: "https://images.unsplash.com/photo-1503602642458-232111445657?w=600" },
  { name: "Mesa auxiliar de nogal", slug: "mesa-auxiliar-nogal", categorySlug: "mobiliario", priceCents: 18500, description: "Mesa auxiliar de madera de nogal con acabado natural, 45x45x50cm.", imageUrl: "https://images.unsplash.com/photo-1499933374294-4584851497cc?w=600" },
  { name: "Estante flotante de fresno", slug: "estante-flotante-fresno", categorySlug: "mobiliario", priceCents: 5900, description: "Estante de pared de madera de fresno con herrajes ocultos, 80cm de largo.", imageUrl: "https://images.unsplash.com/photo-1594620302200-9a762244a156?w=600" },
];

async function main() {
  console.log("Sembrando categorías...");
  const categoryMap = new Map<string, string>();
  for (const c of categories) {
    const created = await prisma.category.upsert({
      where: { slug: c.slug },
      update: {},
      create: c,
    });
    categoryMap.set(c.slug, created.id);
  }

  console.log("Sembrando productos...");
  for (const p of products) {
    const categoryId = categoryMap.get(p.categorySlug)!;
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        priceCents: p.priceCents,
        imageUrl: p.imageUrl,
        categoryId,
      },
    });
  }

  console.log(`Listo: ${categories.length} categorías, ${products.length} productos.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
