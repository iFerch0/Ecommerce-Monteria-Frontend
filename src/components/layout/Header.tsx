import Link from 'next/link';
import { ROUTES, SITE_NAME } from '@/lib/constants';

export function Header() {
  return (
    <header className="border-border bg-surface/95 sticky top-0 z-50 border-b backdrop-blur-sm">
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
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href={ROUTES.HOME} className="flex items-center gap-2">
            <div className="bg-accent flex h-10 w-10 items-center justify-center rounded-lg text-lg font-bold text-white">
              M
            </div>
            <div className="hidden sm:block">
              <h1 className="text-primary text-lg leading-tight font-bold">{SITE_NAME}</h1>
              <p className="text-text-secondary text-xs">Venta al por Mayor</p>
            </div>
          </Link>

          {/* Search bar */}
          <div className="flex max-w-xl flex-1 items-center px-4">
            <div className="relative w-full">
              <input
                type="search"
                placeholder="Buscar productos..."
                className="border-border bg-surface-alt focus:border-accent focus:ring-accent/20 w-full rounded-full border px-4 py-2 pl-10 text-sm transition-all focus:ring-2 focus:outline-none"
              />
              <svg
                className="text-text-muted absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
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

            <Link
              href={ROUTES.CART}
              className="text-text-secondary hover:bg-surface-alt hover:text-primary relative flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
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
              <span className="bg-accent absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white">
                0
              </span>
            </Link>
          </div>
        </div>

        {/* Category nav */}
        <nav className="scrollbar-hide -mx-4 flex items-center gap-1 overflow-x-auto px-4 pb-2">
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
  );
}
