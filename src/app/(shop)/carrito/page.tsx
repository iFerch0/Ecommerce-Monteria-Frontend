'use client';

import { useCartStore } from '@/stores/cartStore';
import { CartItem } from '@/components/cart/CartItem';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';
import { ROUTES } from '@/lib/constants';

export default function CartPage() {
  const { items, getSubtotal, getItemCount, clearCart } = useCartStore();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-text mb-6 text-3xl font-bold">🛒 Carrito de Compras</h1>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <span className="mb-4 text-6xl">🛒</span>
          <h2 className="text-text mb-2 text-xl font-bold">Tu carrito está vacío</h2>
          <p className="text-text-secondary mb-6">
            Agrega productos al por mayor desde nuestro catálogo.
          </p>
          <Link
            href={ROUTES.PRODUCTS}
            className="bg-accent hover:bg-accent-light rounded-full px-8 py-3 text-sm font-bold text-white transition-colors"
          >
            Ver catálogo →
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Cart items */}
          <div className="space-y-4 lg:col-span-2">
            <div className="text-text-secondary mb-2 flex items-center justify-between text-sm">
              <span>
                {items.length} producto{items.length !== 1 ? 's' : ''} · {getItemCount()} unidades
              </span>
              <button
                onClick={clearCart}
                className="text-error hover:text-error/80 text-xs transition-colors"
              >
                Vaciar carrito
              </button>
            </div>

            {items.map((item) => (
              <CartItem
                key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`}
                item={item}
              />
            ))}
          </div>

          {/* Summary sidebar */}
          <div className="lg:col-span-1">
            <div className="border-border bg-surface-alt sticky top-28 rounded-2xl border p-6">
              <h3 className="text-text mb-4 text-lg font-bold">Resumen del pedido</h3>

              <div className="border-border space-y-3 border-b pb-4">
                <div className="text-text-secondary flex justify-between text-sm">
                  <span>Subtotal ({getItemCount()} uds.)</span>
                  <span className="text-text font-medium">{formatPrice(getSubtotal())}</span>
                </div>
                <div className="text-text-secondary flex justify-between text-sm">
                  <span>Envío</span>
                  <span className="text-text-muted text-xs">Calculado en checkout</span>
                </div>
              </div>

              <div className="text-text flex justify-between pt-4 text-lg font-bold">
                <span>Total estimado</span>
                <span className="text-accent">{formatPrice(getSubtotal())}</span>
              </div>

              <div className="mt-6 flex flex-col gap-3">
                <Link
                  href={ROUTES.CHECKOUT}
                  className="bg-accent hover:bg-accent-light rounded-full py-3 text-center text-sm font-bold text-white shadow-lg transition-all"
                >
                  Proceder al checkout →
                </Link>
                <Link
                  href={ROUTES.PRODUCTS}
                  className="border-border hover:bg-surface rounded-full border py-3 text-center text-sm font-medium transition-colors"
                >
                  Seguir comprando
                </Link>
              </div>

              <div className="mt-4 rounded-lg bg-purple-50 p-3 text-xs text-purple-700">
                <strong>💡 Tip:</strong> Compra en grandes volúmenes para obtener mejores precios.
                Los descuentos se aplican automáticamente al alcanzar los mínimos.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
