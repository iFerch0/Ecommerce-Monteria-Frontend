'use client';

import { useState } from 'react';
import { useCartStore } from '@/stores/cartStore';
import type { Product } from '@/types/product';

interface AddToCartButtonProps {
  product: Product;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addItem } = useCartStore();
  const [quantity, setQuantity] = useState(product.minWholesaleQty);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="border-border mt-6 rounded-xl border p-4">
      <div className="mb-3 flex items-center gap-3">
        <label className="text-text text-sm font-medium">Cantidad:</label>
        <div className="border-border flex items-center rounded-lg border">
          <button
            onClick={() => setQuantity(Math.max(product.minWholesaleQty, quantity - 1))}
            className="hover:bg-surface-alt px-3 py-1.5 text-sm font-bold transition-colors"
          >
            −
          </button>
          <input
            type="number"
            value={quantity}
            onChange={(e) =>
              setQuantity(
                Math.max(
                  product.minWholesaleQty,
                  parseInt(e.target.value) || product.minWholesaleQty
                )
              )
            }
            className="text-text border-border w-16 border-x bg-transparent py-1.5 text-center text-sm"
            min={product.minWholesaleQty}
          />
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="hover:bg-surface-alt px-3 py-1.5 text-sm font-bold transition-colors"
          >
            +
          </button>
        </div>
        <span className="text-text-muted text-xs">(mín. {product.minWholesaleQty})</span>
      </div>

      <button
        onClick={handleAdd}
        className={`w-full rounded-full py-3 text-sm font-bold text-white transition-all ${
          added
            ? 'bg-success'
            : 'bg-accent hover:bg-accent-light shadow-accent/20 shadow-lg hover:shadow-xl'
        }`}
      >
        {added ? '✅ Agregado al carrito' : '🛒 Agregar al carrito'}
      </button>
    </div>
  );
}
