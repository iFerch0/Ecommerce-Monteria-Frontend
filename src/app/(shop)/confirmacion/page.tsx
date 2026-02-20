'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ROUTES, SITE_NAME } from '@/lib/constants';

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('order');

  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <div className="border-border bg-surface rounded-2xl border p-8 text-center">
        <div className="mb-4 text-6xl">🎉</div>
        <h1 className="text-text mb-2 text-2xl font-bold">¡Pedido confirmado!</h1>
        <p className="text-text-secondary mb-6">
          Tu pedido ha sido registrado exitosamente en {SITE_NAME}.
        </p>

        {orderNumber && (
          <div className="bg-surface-alt mb-6 inline-block rounded-xl px-6 py-3">
            <p className="text-text-muted text-xs tracking-wider uppercase">Número de pedido</p>
            <p className="text-accent text-xl font-bold">{orderNumber}</p>
          </div>
        )}

        <div className="border-border mb-6 space-y-3 rounded-lg border p-4 text-left text-sm">
          <div className="flex items-start gap-3">
            <span>📧</span>
            <p className="text-text-secondary">
              Recibirás un correo con los detalles de tu pedido.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <span>📦</span>
            <p className="text-text-secondary">Tu pedido será procesado y preparado para envío.</p>
          </div>
          <div className="flex items-start gap-3">
            <span>📞</span>
            <p className="text-text-secondary">
              Nos comunicaremos contigo para confirmar la entrega.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href={ROUTES.ORDERS}
            className="bg-accent hover:bg-accent-light rounded-full px-6 py-3 text-sm font-bold text-white transition-colors"
          >
            Ver mis pedidos
          </Link>
          <Link
            href={ROUTES.PRODUCTS}
            className="border-border hover:border-accent hover:text-accent rounded-full border px-6 py-3 text-sm font-medium transition-colors"
          >
            Seguir comprando
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="text-text-muted text-sm">Cargando...</div>
        </div>
      }
    >
      <ConfirmationContent />
    </Suspense>
  );
}
