import prisma from '@/lib/prisma';
import { logger } from '@/lib/logger';

/**
 * Holt die hervorgehobenen Produkte für die Startseite.
 */
export async function getFeaturedProducts(limit = 8) {
  try {
    return await prisma.product.findMany({
      where: {
        isActive: true,
        isFeatured: true,
      },
      take: limit,
      include: {
        category: true,
      },
    });
  } catch (error) {
    logger.error('Error fetching featured products', error);
    return [];
  }
}

/**
 * Holt Produkte einer bestimmten Kategorie.
 */
export async function getProductsByCategory(categorySlug: string) {
  try {
    return await prisma.product.findMany({
      where: {
        isActive: true,
        category: {
          slug: categorySlug,
        },
      },
      include: {
        category: true,
      },
    });
  } catch (error) {
    logger.error(`Error fetching products for category ${categorySlug}`, error);
    return [];
  }
}

/**
 * Holt ein einzelnes Produkt anhand seines Slugs.
 */
export async function getProductBySlug(slug: string) {
  try {
    return await prisma.product.findUnique({
      where: {
        slug,
      },
      include: {
        category: true,
        compatibleVehicles: true,
        variants: true,
        reviews: {
          where: { isApproved: true },
          include: { user: true },
        },
      },
    });
  } catch (error) {
    logger.error(`Error fetching product ${slug}`, error);
    return null;
  }
}

/**
 * Sucht nach Produkten anhand eines Suchbegriffs.
 */
export async function searchProducts(query: string) {
  try {
    return await prisma.product.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { sku: { contains: query, mode: 'insensitive' } },
          { brand: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: {
        category: true,
      },
    });
  } catch (error) {
    logger.error(`Error searching products for query ${query}`, error);
    return [];
  }
}

/**
 * Sucht nach Produkten anhand von HSN/TSN.
 */
export async function getProductsByVehicle(hsn: string, tsn: string) {
  try {
    return await prisma.product.findMany({
      where: {
        isActive: true,
        compatibleVehicles: {
          some: {
            hsn: hsn.toUpperCase(),
            tsn: tsn.toUpperCase(),
          },
        },
      },
      include: {
        category: true,
      },
    });
  } catch (error) {
    logger.error(`Error fetching products for vehicle ${hsn}/${tsn}`, error);
    return [];
  }
}
