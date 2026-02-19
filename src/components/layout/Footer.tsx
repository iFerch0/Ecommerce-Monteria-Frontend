import Link from 'next/link';
import { ROUTES, SITE_NAME, WHATSAPP_NUMBER } from '@/lib/constants';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-border bg-primary border-t text-white">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <div className="bg-accent flex h-10 w-10 items-center justify-center rounded-lg text-lg font-bold">
                M
              </div>
              <div>
                <h3 className="text-lg font-bold">{SITE_NAME}</h3>
                <p className="text-xs text-gray-400">Venta al por Mayor</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              Tu tienda mayorista de confianza en Montería, Córdoba. Los mejores precios en ropa,
              calzado y accesorios con envíos a todo Colombia.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="mb-4 text-sm font-semibold tracking-wider text-gray-400 uppercase">
              Tienda
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href={ROUTES.PRODUCTS}
                  className="hover:text-accent-light text-gray-300 transition-colors"
                >
                  Catálogo
                </Link>
              </li>
              <li>
                <Link
                  href={`${ROUTES.CATEGORIES}/ropa`}
                  className="hover:text-accent-light text-gray-300 transition-colors"
                >
                  Ropa
                </Link>
              </li>
              <li>
                <Link
                  href={`${ROUTES.CATEGORIES}/calzado`}
                  className="hover:text-accent-light text-gray-300 transition-colors"
                >
                  Calzado
                </Link>
              </li>
              <li>
                <Link
                  href={`${ROUTES.CATEGORIES}/accesorios`}
                  className="hover:text-accent-light text-gray-300 transition-colors"
                >
                  Accesorios
                </Link>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="mb-4 text-sm font-semibold tracking-wider text-gray-400 uppercase">
              Ayuda
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href={ROUTES.ABOUT}
                  className="hover:text-accent-light text-gray-300 transition-colors"
                >
                  Quiénes Somos
                </Link>
              </li>
              <li>
                <Link
                  href={ROUTES.CONTACT}
                  className="hover:text-accent-light text-gray-300 transition-colors"
                >
                  Contacto
                </Link>
              </li>
              <li>
                <Link
                  href={ROUTES.POLICIES}
                  className="hover:text-accent-light text-gray-300 transition-colors"
                >
                  Políticas
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 text-sm font-semibold tracking-wider text-gray-400 uppercase">
              Contacto
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-gray-300">
                <span>📍</span> Montería, Córdoba, Colombia
              </li>
              {WHATSAPP_NUMBER && (
                <li>
                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER.replace('+', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-300 transition-colors hover:text-green-400"
                  >
                    <span>💬</span> WhatsApp
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row">
          <p className="text-xs text-gray-500">
            © {currentYear} {SITE_NAME}. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-2">
            <span className="rounded bg-white/10 px-2 py-1 text-[10px] text-gray-400">
              💳 Wompi
            </span>
            <span className="rounded bg-white/10 px-2 py-1 text-[10px] text-gray-400">🏦 PSE</span>
            <span className="rounded bg-white/10 px-2 py-1 text-[10px] text-gray-400">
              📱 Nequi
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
