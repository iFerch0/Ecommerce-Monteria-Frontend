'use client';

import { CartDrawer } from '@/components/cart/CartDrawer';

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <CartDrawer />
    </>
  );
}
