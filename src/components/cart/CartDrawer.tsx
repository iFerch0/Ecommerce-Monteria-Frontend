'use client';

import { useCartStore } from '@/stores/cartStore';
import { CartItem } from './CartItem';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';
import { ROUTES } from '@/lib/constants';
import { useEffect } from 'react';

export function CartDrawer() {
  const { items, isOpen, closeCart, getSubtotal, getItemCount, clearCart } = useCartStore();

  // Close on Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isOpen, closeCart]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      {/* Drawer */}
      <aside className="bg-surface fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col shadow-2xl">
        {/* Header */}
        <div className="border-border flex items-center justify-between border-b p-4">
          <h2 className="text-text text-lg font-bold">🛒 Carrito ({getItemCount()})</h2>
          <button
            onClick={closeCart}
            className="text-text-secondary hover:text-text rounded-lg p-2 transition-colors"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <span className="mb-4 text-5xl">🛒</span>
              <h3 className="text-text mb-2 text-lg font-semibold">Tu carrito está vacío</h3>
              <p className="text-text-secondary mb-6 text-sm">
                Explora nuestro catálogo y agrega productos al por mayor.
              </p>
              <button
                onClick={closeCart}
                className="bg-accent hover:bg-accent-light rounded-full px-6 py-2.5 text-sm font-bold text-white transition-colors"
              >
                Ver catálogo
              </button>
            </div>
          ) : (
            items.map((item) => (
              <CartItem
                key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`}
                item={item}
              />
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-border border-t p-4">
            {/* Summary */}
            <div className="mb-4 space-y-2">
              <div className="text-text-secondary flex justify-between text-sm">
                <span>Productos ({getItemCount()} uds.)</span>
                <span className="text-text font-semibold">{formatPrice(getSubtotal())}</span>
              </div>
              <div className="text-text flex justify-between text-base font-bold">
                <span>Subtotal</span>
                <span className="text-accent">{formatPrice(getSubtotal())}</span>
              </div>
              <p className="text-text-muted text-[11px]">Envío calculado en el checkout</p>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2">
              <Link
                href={ROUTES.CART}
                onClick={closeCart}
                className="bg-accent hover:bg-accent-light rounded-full py-3 text-center text-sm font-bold text-white transition-colors"
              >
                Ver carrito completo
              </Link>
              <Link
                href={ROUTES.CHECKOUT}
                onClick={closeCart}
                className="bg-primary hover:bg-primary-light rounded-full py-3 text-center text-sm font-bold text-white transition-colors"
              >
                Ir al checkout →
              </Link>
              <button
                onClick={clearCart}
                className="text-text-muted hover:text-error mt-1 text-center text-xs transition-colors"
              >
                Vaciar carrito
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
