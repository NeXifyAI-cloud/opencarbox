import { describe, it, expect, vi } from 'vitest';
import { getFeaturedProducts } from '@/lib/api/products';
import prisma from '@/lib/prisma';

vi.mock('@/lib/prisma', () => ({
  default: {
    product: {
      findMany: vi.fn(),
    },
  },
}));

describe('Products API', () => {
  it('should fetch featured products', async () => {
    const mockProducts = [{ id: '1', name: 'Test Product', isActive: true, isFeatured: true }];
    (prisma.product.findMany as any).mockResolvedValue(mockProducts);

    const result = await getFeaturedProducts(5);

    expect(result).toEqual(mockProducts);
    expect(prisma.product.findMany).toHaveBeenCalledWith(expect.objectContaining({
      where: { isActive: true, isFeatured: true },
      take: 5
    }));
  });
});
