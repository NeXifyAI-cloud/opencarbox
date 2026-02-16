import { featuredProducts, type FeaturedProduct } from '@/lib/mock-data';
import { slugify } from '@/lib/utils';

export function getProductSlug(productName: string): string {
  return slugify(productName);
}

export function findFeaturedProductBySlug(slug: string): FeaturedProduct | undefined {
  return featuredProducts.find((product) => getProductSlug(product.name) === slug);
}
