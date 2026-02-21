'use client';

import { useEffect } from 'react';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { useOrderStore } from '@/stores/orderStore';
import { useAuthStore } from '@/stores/authStore';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';
import { ROUTES } from '@/lib/constants';

const STATUS_MAP: Record<string, { label: string; color: string; icon: string }> = {
  pending: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-700', icon: '⏳' },
  confirmed: { label: 'Confirmado', color: 'bg-blue-100 text-blue-700', icon: '✅' },
  processing: { label: 'En preparación', color: 'bg-purple-100 text-purple-700', icon: '📦' },
  shipped: { label: 'Enviado', color: 'bg-indigo-100 text-indigo-700', icon: '🚚' },
  delivered: { label: 'Entregado', color: 'bg-green-100 text-green-700', icon: '✨' },
  cancelled: { label: 'Cancelado', color: 'bg-red-100 text-red-700', icon: '❌' },
};

function OrdersContent() {
  const { orders, isLoading, fetchMyOrders } = useOrderStore();
  const { token } = useAuthStore();

  useEffect(() => {
    if (token) {
      fetchMyOrders(token);
    }
  }, [token, fetchMyOrders]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <nav className="text-text-secondary mb-6 flex items-center gap-2 text-sm">
        <Link href={ROUTES.ACCOUNT} className="hover:text-accent transition-colors">
          Mi Cuenta
        </Link>
        <span>/</span>
        <span className="text-text">Mis Pedidos</span>
      </nav>

      <h1 className="text-text mb-6 text-3xl font-bold">📦 Mis Pedidos</h1>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-text-muted text-sm">Cargando pedidos...</div>
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <span className="mb-4 text-6xl">📭</span>
          <h2 className="text-text mb-2 text-xl font-bold">Aún no tienes pedidos</h2>
          <p className="text-text-secondary mb-6 max-w-sm">
            Cuando realices tu primera compra, podrás ver el estado y detalles de tus pedidos aquí.
          </p>
          <Link
            href={ROUTES.PRODUCTS}
            className="bg-accent hover:bg-accent-light rounded-full px-8 py-3 text-sm font-bold text-white transition-colors"
          >
            Explorar catálogo →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const status = STATUS_MAP[order.orderStatus] || STATUS_MAP.pending;
            return (
              <div
                key={order.documentId}
                className="border-border bg-surface rounded-2xl border p-5 transition-all hover:shadow-sm"
              >
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="text-accent text-sm font-bold">{order.orderNumber}</span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${status.color}`}
                    >
                      {status.icon} {status.label}
                    </span>
                  </div>
                  <span className="text-text-muted text-xs">
                    {new Date(order.createdAt).toLocaleDateString('es-CO', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                {/* Items preview */}
                <div className="text-text-secondary mb-3 text-sm">
                  {order.orderItems?.slice(0, 3).map((item, i) => (
                    <span key={i}>
                      {i > 0 && ', '}
                      {item.productName} ×{item.quantity}
                    </span>
                  ))}
                  {order.orderItems && order.orderItems.length > 3 && (
                    <span> y {order.orderItems.length - 3} más</span>
                  )}
                </div>

                <div className="border-border flex items-center justify-between border-t pt-3">
                  <span className="text-text text-sm font-bold">
                    Total: {formatPrice(order.total)}
                  </span>
                  {order.payment && (
                    <span className="text-text-muted text-xs">
                      Pago:{' '}
                      {STATUS_MAP[order.payment.paymentStatus]?.label ||
                        order.payment.paymentStatus}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function OrdersPage() {
  return (
    <AuthGuard>
      <OrdersContent />
    </AuthGuard>
  );
}
