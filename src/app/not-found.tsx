import Link from 'next/link';
import { ROUTES } from '@/lib/constants';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Página no encontrada',
  robots: { index: false, follow: false },
};

const quickLinks = [
  { label: 'Catálogo de productos', href: ROUTES.PRODUCTS },
  { label: 'Categorías', href: ROUTES.CATEGORIES },
  { label: 'Sobre nosotros', href: ROUTES.ABOUT },
  { label: 'Contáctanos', href: ROUTES.CONTACT },
];

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 text-center">
      {/* Visual */}
      <div className="mb-6 text-8xl select-none" aria-hidden>
        🔍
      </div>

      {/* Heading */}
      <h1 className="text-text mb-3 text-4xl font-extrabold sm:text-5xl">
        <span className="text-accent">404</span> — Página no encontrada
      </h1>
      <p className="text-text-secondary mx-auto mb-8 max-w-md text-base">
        La página que buscas no existe o fue movida. Prueba buscando un producto o explora nuestras
        categorías.
      </p>

      {/* Quick links */}
      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {quickLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="border-border bg-surface hover:border-accent/50 hover:text-accent text-text-secondary rounded-xl border px-4 py-3 text-sm font-medium transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Primary CTA */}
      <Link
        href={ROUTES.HOME}
        className="bg-accent hover:bg-accent/90 rounded-full px-8 py-3 text-sm font-bold text-white shadow-lg transition-colors"
      >
        ← Volver al inicio
      </Link>
    </main>
  );
}
