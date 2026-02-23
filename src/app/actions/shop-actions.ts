'use server';

import { logEvent } from '@/lib/audit-logger';

export async function logAddToCartAction(productId: string, productName: string) {
  await logEvent({
    action: 'add_to_cart',
    resource: `product:${productId}`,
    status: 'SUCCESS',
    user: 'anonymous-user', // In einer echten App würde hier die User-ID stehen
    details: {
      productName,
      timestamp: new Date().toISOString(),
    },
  });
}

export async function logSearchAction(query: string, resultCount: number) {
  await logEvent({
    action: 'search',
    resource: 'shop_search',
    status: 'SUCCESS',
    user: 'anonymous-user',
    details: {
      query,
      resultCount,
    },
  });
}
