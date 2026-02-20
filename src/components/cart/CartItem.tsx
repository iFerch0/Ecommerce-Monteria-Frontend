'use client';

import { formatPrice } from '@/lib/utils';
import type { CartItem as CartItemType } from '@/stores/cartStore';
import { useCartStore } from '@/stores/cartStore';

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore();

  return (
    <div className="border-border flex gap-3 rounded-lg border p-3">
      {/* Image */}
      <div className="bg-surface-alt flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg text-2xl">
        📦
      </div>

      {/* Info */}
      <div className="flex min-w-0 flex-1 flex-col">
        <h4 className="text-text truncate text-sm font-semibold">{item.product.name}</h4>

        {/* Variants */}
        <div className="text-text-muted mt-0.5 flex flex-wrap gap-2 text-xs">
          {item.selectedSize && <span>Talla: {item.selectedSize}</span>}
          {item.selectedColor && <span>Color: {item.selectedColor}</span>}
        </div>

        {/* Price */}
        <span className="text-accent mt-1 text-sm font-bold">
          {formatPrice(item.product.basePrice)}
          <span className="text-text-muted ml-1 text-xs font-normal">/ud</span>
        </span>

        {/* Quantity controls */}
        <div className="mt-2 flex items-center gap-2">
          <div className="border-border flex items-center rounded-lg border">
            <button
              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
              disabled={item.quantity <= item.product.minWholesaleQty}
              className="hover:bg-surface-alt px-2 py-1 text-sm font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-30"
            >
              −
            </button>
            <span className="text-text min-w-[2rem] text-center text-sm font-medium">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
              className="hover:bg-surface-alt px-2 py-1 text-sm font-bold transition-colors"
            >
              +
            </button>
          </div>

          <span className="text-text-muted text-[10px]">Min. {item.product.minWholesaleQty}</span>

          <button
            onClick={() => removeItem(item.product.id)}
            className="ml-auto text-xs text-red-500 transition-colors hover:text-red-700"
          >
            Eliminar
          </button>
        </div>

        {/* Subtotal */}
        <div className="border-border mt-2 border-t pt-1.5 text-right">
          <span className="text-text text-xs font-semibold">
            Subtotal: {formatPrice(item.product.basePrice * item.quantity)}
          </span>
        </div>
      </div>
    </div>
  );
}
