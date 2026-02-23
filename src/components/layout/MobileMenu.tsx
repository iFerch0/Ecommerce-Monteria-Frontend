'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ROUTES } from '@/lib/constants';
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  storeName: string;
  tagline: string;
  logoUrl: string | null;
}

const navLinks = [
  { href: ROUTES.PRODUCTS, label: 'Catálogo', emoji: '🛍️' },
  { href: `${ROUTES.CATEGORIES}/ropa`, label: 'Ropa', emoji: '👕' },
  { href: `${ROUTES.CATEGORIES}/calzado`, label: 'Calzado', emoji: '👟' },
  { href: `${ROUTES.CATEGORIES}/accesorios`, label: 'Accesorios', emoji: '👜' },
  { href: `${ROUTES.CATEGORIES}/variados`, label: 'Variados', emoji: '📦' },
  { href: ROUTES.ABOUT, label: 'Nosotros', emoji: '🏪' },
  { href: ROUTES.CONTACT, label: 'Contacto', emoji: '📞' },
  { href: ROUTES.POLICIES, label: 'Políticas', emoji: '📋' },
];

export function MobileMenu({ isOpen, onClose, storeName, tagline, logoUrl }: MobileMenuProps) {
  const { isAuthenticated, user, logout } = useAuthStore();
  const { openCart } = useCartStore();

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className="fixed inset-y-0 left-0 z-50 flex w-80 max-w-[85vw] flex-col bg-white shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 p-4">
          <div className="flex items-center gap-2">
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt={storeName}
                width={36}
                height={36}
                unoptimized
                className="h-9 w-9 rounded-lg object-contain"
              />
            ) : (
              <div className="bg-accent flex h-9 w-9 items-center justify-center rounded-lg text-base font-bold text-white">
                {storeName.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <p className="text-primary text-sm leading-tight font-bold">{storeName}</p>
              <p className="text-text-secondary text-xs">{tagline}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text hover:bg-surface-alt rounded-lg p-2 transition-colors"
            aria-label="Cerrar menú"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={onClose}
                  className="hover:bg-surface-alt hover:text-accent flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-gray-700 transition-colors"
                >
                  <span className="text-lg">{link.emoji}</span>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer actions */}
        <div className="space-y-2 border-t border-gray-100 p-4">
          {isAuthenticated ? (
            <>
              <Link
                href={ROUTES.ACCOUNT}
                onClick={onClose}
                className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span className="truncate">{user?.email?.split('@')[0]}</span>
              </Link>
              <Link
                href={ROUTES.ORDERS}
                onClick={onClose}
                className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                Mis pedidos
              </Link>
              <button
                onClick={() => {
                  logout();
                  onClose();
                }}
                className="text-error hover:bg-error/10 flex w-full items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-colors"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link
                href={ROUTES.LOGIN}
                onClick={onClose}
                className="border-border flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                Ingresar
              </Link>
              <Link
                href={ROUTES.REGISTER}
                onClick={onClose}
                className="bg-accent hover:bg-accent-light flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-white transition-colors"
              >
                Crear cuenta mayorista
              </Link>
            </>
          )}

          <button
            onClick={() => {
              openCart();
              onClose();
            }}
            className="bg-surface-alt hover:bg-border flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 transition-colors"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
              />
            </svg>
            Ver carrito
          </button>
        </div>
      </div>
    </>
  );
}
