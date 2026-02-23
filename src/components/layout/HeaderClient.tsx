'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSyncExternalStore } from 'react';
import { ROUTES, SITE_NAME } from '@/lib/constants';
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';
import { MobileMenu } from './MobileMenu';
import { SearchBar } from './SearchBar';

export function HeaderClient() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { openCart } = useCartStore();
  const { isAuthenticated, user, logout } = useAuthStore();

  const itemCount = useSyncExternalStore(
    useCartStore.subscribe,
    () => useCartStore.getState().items.reduce((n, item) => n + item.quantity, 0),
    () => 0
  );

  return (
    <>
      <header className="border-border bg-surface/95 sticky top-0 z-40 border-b backdrop-blur-sm">
        {/* Top bar */}
        <div className="bg-primary text-white">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5 text-xs sm:text-sm">
            <span>📍 Montería, Córdoba — Envíos a todo Colombia</span>
            <div className="hidden items-center gap-4 sm:flex">
              <Link href={ROUTES.ABOUT} className="hover:text-accent-light transition-colors">
                Nosotros
              </Link>
              <Link href={ROUTES.CONTACT} className="hover:text-accent-light transition-colors">
                Contacto
              </Link>
            </div>
          </div>
        </div>

        {/* Main nav */}
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex h-16 items-center justify-between gap-2 sm:gap-4">
            {/* Hamburger (mobile only) */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="text-text-secondary hover:bg-surface-alt hover:text-primary -ml-2 flex items-center justify-center rounded-lg p-2 transition-colors sm:hidden"
              aria-label="Abrir menú"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            {/* Logo */}
            <Link href={ROUTES.HOME} className="flex shrink-0 items-center gap-2">
              <div className="bg-accent flex h-9 w-9 items-center justify-center rounded-lg text-base font-bold text-white sm:h-10 sm:w-10 sm:text-lg">
                M
              </div>
              <div className="hidden sm:block">
                <p className="text-primary text-lg leading-tight font-bold">{SITE_NAME}</p>
                <p className="text-text-secondary text-xs">Venta al por Mayor</p>
              </div>
            </Link>

            {/* Search bar — functional with autocomplete */}
            <div className="min-w-0 flex-1 px-1 sm:px-4">
              <SearchBar />
            </div>

            {/* Right actions */}
            <div className="flex shrink-0 items-center gap-1 sm:gap-3">
              {isAuthenticated ? (
                <div className="hidden items-center gap-2 sm:flex">
                  <Link
                    href={ROUTES.ACCOUNT}
                    className="text-text-secondary hover:bg-surface-alt hover:text-primary flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span className="max-w-[80px] truncate">{user?.email?.split('@')[0]}</span>
                  </Link>
                  <button
                    onClick={logout}
                    className="text-text-muted hover:text-error text-xs transition-colors"
                  >
                    Salir
                  </button>
                </div>
              ) : (
                <Link
                  href={ROUTES.LOGIN}
                  className="text-text-secondary hover:bg-surface-alt hover:text-primary hidden items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors sm:flex"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span>Ingresar</span>
                </Link>
              )}

              {/* Cart button */}
              <button
                onClick={openCart}
                className="text-text-secondary hover:bg-surface-alt hover:text-primary relative flex items-center gap-1.5 rounded-lg px-2 py-2 text-sm font-medium transition-colors sm:px-3"
                aria-label="Ver carrito"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
                  />
                </svg>
                <span className="hidden sm:inline">Carrito</span>
                {itemCount > 0 && (
                  <span
                    suppressHydrationWarning
                    className="bg-accent absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white"
                  >
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Category nav — desktop */}
          <nav className="scrollbar-hide -mx-4 hidden items-center gap-1 overflow-x-auto px-4 pb-2 sm:flex">
            {['Ropa', 'Calzado', 'Accesorios', 'Variados'].map((cat) => (
              <Link
                key={cat}
                href={`${ROUTES.CATEGORIES}/${cat.toLowerCase()}`}
                className="text-text-secondary hover:bg-accent/10 hover:text-accent shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors"
              >
                {cat}
              </Link>
            ))}
            <Link
              href={ROUTES.PRODUCTS}
              className="text-accent hover:bg-accent/10 shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors"
            >
              Ver todo →
            </Link>
          </nav>
        </div>
      </header>

      {/* Mobile drawer */}
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
}
