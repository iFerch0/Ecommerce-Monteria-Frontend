'use client';

import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';
import { useOrderStore } from '@/stores/orderStore';
import { WompiWidget } from '@/components/payment/WompiWidget';
import { formatPrice } from '@/lib/utils';
import { ROUTES } from '@/lib/constants';

const shippingSchema = z.object({
  fullName: z.string().min(3, 'Nombre completo requerido'),
  phone: z
    .string()
    .min(7, 'Teléfono inválido')
    .regex(/^[0-9+\-\s()]+$/, 'Solo números'),
  department: z.string().min(2, 'Departamento requerido'),
  city: z.string().min(2, 'Ciudad requerida'),
  address: z.string().min(5, 'Dirección muy corta'),
  notes: z.string().optional(),
});

type ShippingFormData = z.infer<typeof shippingSchema>;

const DEPARTMENTS = [
  'Antioquia',
  'Atlántico',
  'Bolívar',
  'Boyacá',
  'Caldas',
  'Caquetá',
  'Casanare',
  'Cauca',
  'Cesar',
  'Córdoba',
  'Cundinamarca',
  'Huila',
  'La Guajira',
  'Magdalena',
  'Meta',
  'Nariño',
  'Norte de Santander',
  'Putumayo',
  'Quindío',
  'Risaralda',
  'Santander',
  'Sucre',
  'Tolima',
  'Valle del Cauca',
];

function CheckoutContent() {
  const { items, getSubtotal, clearCart } = useCartStore();
  const { token, user } = useAuthStore();
  const { createOrder, confirmPayment, isLoading } = useOrderStore();
  const router = useRouter();
  const [error, setError] = useState('');
  const [step, setStep] = useState<'shipping' | 'review' | 'payment'>('shipping');
  const [shippingData, setShippingData] = useState<ShippingFormData | null>(null);
  const [wompiData, setWompiData] = useState<{
    reference: string;
    amountInCents: number;
    signature: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ShippingFormData>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      department: 'Córdoba',
      city: 'Montería',
    },
  });

  const subtotal = getSubtotal();
  const shippingCost = 0;
  const total = subtotal + shippingCost;

  const handleWompiSuccess = useCallback(
    async (transaction: { id: string }) => {
      if (wompiData && token) {
        try {
          await confirmPayment(wompiData.reference, transaction.id, token);
        } catch (err) {
          console.error('confirmPayment error:', err);
          // El webhook de Wompi corregirá el estado como respaldo
        }
      }
      clearCart();
      if (wompiData) {
        router.push(`${ROUTES.CONFIRMATION}?order=${wompiData.reference}`);
      }
    },
    [clearCart, confirmPayment, router, token, wompiData]
  );

  const handleWompiClose = useCallback(() => {
    // Payment was not approved — redirect to confirmation with pending status
    if (wompiData) {
      clearCart();
      router.push(`${ROUTES.CONFIRMATION}?order=${wompiData.reference}`);
    }
  }, [clearCart, router, wompiData]);

  if (items.length === 0 && step !== 'payment') {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <span className="mb-4 text-6xl">🛒</span>
        <h2 className="text-text mb-2 text-xl font-bold">Tu carrito está vacío</h2>
        <p className="text-text-secondary mb-6">Agrega productos antes de hacer checkout.</p>
        <Link
          href={ROUTES.PRODUCTS}
          className="bg-accent hover:bg-accent-light rounded-full px-8 py-3 text-sm font-bold text-white transition-colors"
        >
          Ver catálogo →
        </Link>
      </div>
    );
  }

  const onShippingSubmit = (data: ShippingFormData) => {
    setShippingData(data);
    setStep('review');
  };

  const onConfirmOrder = async () => {
    if (!shippingData || !token) return;
    setError('');

    try {
      const orderItems = items.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        productSlug: item.product.slug,
        quantity: item.quantity,
        unitPrice: item.product.basePrice,
        selectedSize: item.selectedSize || undefined,
        selectedColor: item.selectedColor || undefined,
      }));

      const result = await createOrder(
        orderItems,
        {
          fullName: shippingData.fullName,
          address: shippingData.address,
          city: shippingData.city,
          department: shippingData.department,
          phone: shippingData.phone,
        },
        shippingData.notes || '',
        token
      );

      // Amount in cents for Wompi (prices are already in COP, multiply by 100)
      const amountInCents = Math.round(result.total * 100);

      // Get integrity signature from server
      const sigRes = await fetch('/api/wompi/signature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reference: result.orderNumber,
          amountInCents,
          currency: 'COP',
        }),
      });

      if (!sigRes.ok) throw new Error('Error generando firma de pago');
      const { signature } = await sigRes.json();

      setWompiData({
        reference: result.orderNumber,
        amountInCents,
        signature,
      });
      setStep('payment');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al procesar el pedido');
    }
  };

  const inputClass =
    'w-full rounded-lg border border-border bg-surface-alt px-4 py-2.5 text-sm transition-all focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-none';

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-text-secondary mb-6 flex items-center gap-2 text-sm">
        <Link href={ROUTES.CART} className="hover:text-accent transition-colors">
          Carrito
        </Link>
        <span>/</span>
        <span className="text-text">Checkout</span>
      </nav>

      <h1 className="text-text mb-6 text-3xl font-bold">💳 Finalizar compra</h1>

      {/* Steps indicator */}
      <div className="mb-8 flex items-center gap-4">
        <button
          onClick={() => step !== 'payment' && setStep('shipping')}
          className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            step === 'shipping'
              ? 'bg-accent text-white'
              : 'bg-surface-alt text-text-secondary hover:text-accent'
          }`}
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-xs font-bold">
            1
          </span>
          Envío
        </button>
        <div className="bg-border h-px flex-1" />
        <div
          className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ${
            step === 'review' ? 'bg-accent text-white' : 'bg-surface-alt text-text-muted'
          }`}
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-xs font-bold">
            2
          </span>
          Confirmar
        </div>
        <div className="bg-border h-px flex-1" />
        <div
          className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ${
            step === 'payment' ? 'bg-accent text-white' : 'bg-surface-alt text-text-muted'
          }`}
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-xs font-bold">
            3
          </span>
          Pagar
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 p-3 text-sm text-red-600">❌ {error}</div>
      )}

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2">
          {step === 'shipping' ? (
            <form
              onSubmit={handleSubmit(onShippingSubmit)}
              className="border-border bg-surface space-y-4 rounded-2xl border p-6"
            >
              <h2 className="text-text mb-2 text-lg font-bold">📍 Dirección de envío</h2>

              <div>
                <label htmlFor="fullName" className="text-text mb-1 block text-sm font-medium">
                  Nombre completo *
                </label>
                <input
                  id="fullName"
                  {...register('fullName')}
                  className={inputClass}
                  placeholder="Juan Pérez"
                />
                {errors.fullName && (
                  <p className="mt-1 text-xs text-red-500">{errors.fullName.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="phone" className="text-text mb-1 block text-sm font-medium">
                    Teléfono *
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    {...register('phone')}
                    className={inputClass}
                    placeholder="+57 300 123 4567"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="department" className="text-text mb-1 block text-sm font-medium">
                    Departamento *
                  </label>
                  <select id="department" {...register('department')} className={inputClass}>
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="city" className="text-text mb-1 block text-sm font-medium">
                    Ciudad *
                  </label>
                  <input
                    id="city"
                    {...register('city')}
                    className={inputClass}
                    placeholder="Montería"
                  />
                  {errors.city && (
                    <p className="mt-1 text-xs text-red-500">{errors.city.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="address" className="text-text mb-1 block text-sm font-medium">
                    Dirección *
                  </label>
                  <input
                    id="address"
                    {...register('address')}
                    className={inputClass}
                    placeholder="Cra 1 #2-3, Barrio..."
                  />
                  {errors.address && (
                    <p className="mt-1 text-xs text-red-500">{errors.address.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="notes" className="text-text mb-1 block text-sm font-medium">
                  Notas (opcional)
                </label>
                <textarea
                  id="notes"
                  {...register('notes')}
                  className={inputClass}
                  rows={2}
                  placeholder="Instrucciones especiales de entrega..."
                />
              </div>

              <button
                type="submit"
                className="bg-accent hover:bg-accent-light w-full rounded-full py-3 text-sm font-bold text-white transition-colors"
              >
                Continuar al resumen →
              </button>
            </form>
          ) : step === 'review' ? (
            <div className="border-border bg-surface space-y-4 rounded-2xl border p-6">
              <h2 className="text-text mb-2 text-lg font-bold">📋 Resumen del pedido</h2>

              {/* Shipping info */}
              <div className="border-border rounded-lg border p-4">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-text text-sm font-semibold">Enviar a:</h3>
                  <button
                    onClick={() => setStep('shipping')}
                    className="text-accent text-xs font-medium"
                  >
                    Editar
                  </button>
                </div>
                <p className="text-text text-sm">{shippingData?.fullName}</p>
                <p className="text-text-secondary text-sm">
                  {shippingData?.address}, {shippingData?.city}, {shippingData?.department}
                </p>
                <p className="text-text-secondary text-sm">📞 {shippingData?.phone}</p>
              </div>

              {/* Items */}
              <div className="divide-border divide-y">
                {items.map((item) => (
                  <div
                    key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`}
                    className="flex items-center justify-between py-3"
                  >
                    <div>
                      <p className="text-text text-sm font-medium">{item.product.name}</p>
                      <p className="text-text-muted text-xs">
                        {item.quantity} × {formatPrice(item.product.basePrice)}
                        {item.selectedSize && ` · ${item.selectedSize}`}
                        {item.selectedColor && ` · ${item.selectedColor}`}
                      </p>
                    </div>
                    <span className="text-text text-sm font-semibold">
                      {formatPrice(item.quantity * item.product.basePrice)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-lg bg-green-50 p-3 text-xs text-green-700">
                <strong>💳 Pago seguro:</strong> Al confirmar, se abrirá la pasarela de pago Wompi
                donde podrás pagar con tarjeta de crédito, débito, Nequi o PSE.
              </div>

              <button
                onClick={onConfirmOrder}
                disabled={isLoading}
                className="bg-accent hover:bg-accent-light w-full rounded-full py-3 text-sm font-bold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? 'Procesando...' : `Pagar con Wompi · ${formatPrice(total)}`}
              </button>
            </div>
          ) : (
            /* Payment step — Wompi Widget */
            <div className="border-border bg-surface rounded-2xl border p-6">
              <h2 className="text-text mb-4 text-lg font-bold">💳 Pasarela de pago</h2>
              {wompiData && (
                <WompiWidget
                  amountInCents={wompiData.amountInCents}
                  reference={wompiData.reference}
                  signature={wompiData.signature}
                  customerEmail={user?.email}
                  customerName={shippingData?.fullName}
                  customerPhone={shippingData?.phone}
                  shippingAddress={
                    shippingData
                      ? {
                          address: shippingData.address,
                          city: shippingData.city,
                          phone: shippingData.phone,
                          department: shippingData.department,
                        }
                      : undefined
                  }
                  onSuccess={handleWompiSuccess}
                  onClose={handleWompiClose}
                />
              )}
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="border-border bg-surface sticky top-24 rounded-2xl border p-6">
            <h3 className="text-text mb-4 text-lg font-bold">Resumen</h3>
            <div className="text-text-secondary space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal ({items.reduce((n, i) => n + i.quantity, 0)} artículos)</span>
                <span className="text-text font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Envío</span>
                <span className="text-success font-medium">
                  {shippingCost === 0 ? 'Gratis' : formatPrice(shippingCost)}
                </span>
              </div>
              <div className="border-border border-t pt-2">
                <div className="flex justify-between">
                  <span className="text-text text-base font-bold">Total</span>
                  <span className="text-accent text-lg font-bold">{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <AuthGuard>
      <CheckoutContent />
    </AuthGuard>
  );
}
