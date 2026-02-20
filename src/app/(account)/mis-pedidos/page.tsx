'use client';

import { AuthGuard } from '@/components/auth/AuthGuard';
import Link from 'next/link';
import { ROUTES } from '@/lib/constants';

function OrdersContent() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-text-secondary mb-6 flex items-center gap-2 text-sm">
        <Link href={ROUTES.ACCOUNT} className="hover:text-accent transition-colors">
          Mi Cuenta
        </Link>
        <span>/</span>
        <span className="text-text">Mis Pedidos</span>
      </nav>

      <h1 className="text-text mb-6 text-3xl font-bold">📦 Mis Pedidos</h1>

      {/* Empty state */}
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
