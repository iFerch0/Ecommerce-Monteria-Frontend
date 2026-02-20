'use client';

import { useAuthStore } from '@/stores/authStore';
import { AuthGuard } from '@/components/auth/AuthGuard';
import Link from 'next/link';
import { ROUTES, SITE_NAME } from '@/lib/constants';

function AccountContent() {
  const { user, logout } = useAuthStore();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-text mb-6 text-3xl font-bold">👤 Mi Cuenta</h1>

      {/* User Info Card */}
      <div className="border-border bg-surface mb-6 rounded-2xl border p-6">
        <div className="mb-4 flex items-center gap-4">
          <div className="bg-accent flex h-14 w-14 items-center justify-center rounded-full text-xl font-bold text-white">
            {user?.email?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <h2 className="text-text text-lg font-bold">{user?.email?.split('@')[0]}</h2>
            <p className="text-text-secondary text-sm">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href={ROUTES.ORDERS}
          className="border-border bg-surface hover:border-accent/30 group flex items-center gap-4 rounded-2xl border p-5 transition-all hover:-translate-y-0.5 hover:shadow-md"
        >
          <span className="text-3xl">📦</span>
          <div>
            <h3 className="text-text group-hover:text-accent font-semibold transition-colors">
              Mis Pedidos
            </h3>
            <p className="text-text-secondary text-sm">Historial y seguimiento</p>
          </div>
        </Link>

        <Link
          href={ROUTES.PRODUCTS}
          className="border-border bg-surface hover:border-accent/30 group flex items-center gap-4 rounded-2xl border p-5 transition-all hover:-translate-y-0.5 hover:shadow-md"
        >
          <span className="text-3xl">🛍️</span>
          <div>
            <h3 className="text-text group-hover:text-accent font-semibold transition-colors">
              Seguir comprando
            </h3>
            <p className="text-text-secondary text-sm">Explora el catálogo</p>
          </div>
        </Link>

        <Link
          href={ROUTES.CART}
          className="border-border bg-surface hover:border-accent/30 group flex items-center gap-4 rounded-2xl border p-5 transition-all hover:-translate-y-0.5 hover:shadow-md"
        >
          <span className="text-3xl">🛒</span>
          <div>
            <h3 className="text-text group-hover:text-accent font-semibold transition-colors">
              Mi Carrito
            </h3>
            <p className="text-text-secondary text-sm">Ver productos agregados</p>
          </div>
        </Link>

        <button
          onClick={logout}
          className="border-border bg-surface hover:border-error/30 group flex items-center gap-4 rounded-2xl border p-5 text-left transition-all hover:-translate-y-0.5 hover:shadow-md"
        >
          <span className="text-3xl">🚪</span>
          <div>
            <h3 className="text-text group-hover:text-error font-semibold transition-colors">
              Cerrar sesión
            </h3>
            <p className="text-text-secondary text-sm">Salir de {SITE_NAME}</p>
          </div>
        </button>
      </div>
    </div>
  );
}

export default function AccountPage() {
  return (
    <AuthGuard>
      <AccountContent />
    </AuthGuard>
  );
}
