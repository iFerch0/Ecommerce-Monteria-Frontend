import type { Metadata } from 'next';
import { fetchAPI } from '@/lib/strapi';
import { SITE_NAME, WHATSAPP_NUMBER } from '@/lib/constants';
import type { PageContent } from '@/types/cms';

export const metadata: Metadata = {
  title: 'Quiénes Somos',
  description:
    'Conoce la historia, misión y valores de El Mejor Precio, tu tienda mayorista de confianza en Montería, Córdoba.',
};

async function getPageSections(): Promise<PageContent[]> {
  try {
    const data = await fetchAPI<{ data: PageContent[] }>({
      endpoint: '/page-contents',
      query: {
        'filters[pageSlug][$eq]': 'nosotros',
        'filters[isActive][$eq]': 'true',
        sort: 'sortOrder:asc',
      },
      revalidate: 300,
      tags: ['page-content'],
    });
    return data.data || [];
  } catch {
    return [];
  }
}

const FALLBACK_SECTIONS = [
  {
    key: 'historia',
    title: 'Nuestra Historia',
    content:
      'Nacimos en Montería con una misión clara: ofrecer los mejores precios al por mayor en ropa, calzado y accesorios para comerciantes y emprendedores de la región Caribe. Con años de experiencia en el mercado, nos hemos convertido en el aliado de confianza de cientos de negocios en toda Colombia.',
    icon: '🏪',
  },
  {
    key: 'mision',
    title: 'Nuestra Misión',
    content:
      'Conectar a comerciantes y emprendedores con los mejores productos al por mayor, ofreciendo precios justos, calidad garantizada y un servicio personalizado que impulse el crecimiento de cada negocio.',
    icon: '🎯',
  },
  {
    key: 'vision',
    title: 'Nuestra Visión',
    content:
      'Ser la plataforma mayorista líder de la Costa Caribe colombiana, reconocida por la variedad de su catálogo, la competitividad de sus precios y la confianza que genera en cada transacción.',
    icon: '🌟',
  },
];

const VALUES = [
  { icon: '🤝', label: 'Confianza', desc: 'Relaciones honestas y transparentes con cada cliente' },
  { icon: '💰', label: 'Precio justo', desc: 'Los mejores márgenes para que tu negocio crezca' },
  { icon: '📦', label: 'Calidad', desc: 'Productos seleccionados que cumplen tus expectativas' },
  { icon: '🚀', label: 'Rapidez', desc: 'Despachos ágiles a todo el territorio nacional' },
];

export default async function NosotrosPage() {
  const sections = await getPageSections();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="from-primary via-primary-light to-primary bg-gradient-to-br px-4 py-20 text-center text-white">
        <div className="mx-auto max-w-3xl">
          <p className="text-accent-light mb-3 text-sm font-semibold tracking-widest uppercase">
            Montería, Córdoba
          </p>
          <h1 className="mb-6 text-4xl font-extrabold sm:text-5xl">
            Tu aliado mayorista en la{' '}
            <span className="from-accent-light to-accent bg-gradient-to-r bg-clip-text text-transparent">
              Costa Caribe
            </span>
          </h1>
          <p className="mx-auto max-w-xl text-lg leading-relaxed text-gray-300">
            Más que una tienda, somos el socio estratégico que tu negocio necesita para crecer con
            los mejores precios del mercado.
          </p>
        </div>
      </section>

      {/* Sections from CMS or fallback */}
      <section className="mx-auto max-w-5xl px-4 py-16">
        <div className="grid gap-10 md:grid-cols-1">
          {sections.length > 0
            ? sections.map((section) => (
                <div key={section.id} className="border-border bg-surface rounded-2xl border p-8">
                  {section.title && (
                    <h2 className="text-primary mb-4 text-2xl font-bold">{section.title}</h2>
                  )}
                  {section.content && (
                    <div
                      className="text-text-secondary prose prose-gray max-w-none leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: section.content }}
                    />
                  )}
                </div>
              ))
            : FALLBACK_SECTIONS.map((section) => (
                <div
                  key={section.key}
                  className="border-border bg-surface flex gap-6 rounded-2xl border p-8"
                >
                  <div className="text-4xl">{section.icon}</div>
                  <div>
                    <h2 className="text-primary mb-3 text-2xl font-bold">{section.title}</h2>
                    <p className="text-text-secondary leading-relaxed">{section.content}</p>
                  </div>
                </div>
              ))}
        </div>
      </section>

      {/* Values */}
      <section className="bg-surface-alt px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-primary mb-10 text-center text-2xl font-bold sm:text-3xl">
            Lo que nos define
          </h2>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {VALUES.map((v) => (
              <div
                key={v.label}
                className="border-border bg-surface rounded-2xl border p-6 text-center"
              >
                <div className="mb-3 text-4xl">{v.icon}</div>
                <h3 className="text-primary mb-1 font-bold">{v.label}</h3>
                <p className="text-text-muted text-sm">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="mx-auto max-w-5xl px-4 py-16">
        <div className="border-border bg-surface rounded-2xl border p-8 text-center">
          <div className="mb-4 text-5xl">📍</div>
          <h2 className="text-primary mb-3 text-2xl font-bold">Encuéntranos</h2>
          <p className="text-text-secondary mb-6">
            Estamos en Montería, Córdoba — y llegamos a todo Colombia con nuestros despachos.
          </p>
          {WHATSAPP_NUMBER && (
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, '')}?text=${encodeURIComponent('Hola, quiero conocer más sobre sus productos')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-accent hover:bg-accent-light inline-block rounded-full px-8 py-3 text-sm font-bold text-white transition-colors"
            >
              💬 Escríbenos por WhatsApp
            </a>
          )}
        </div>
      </section>
    </div>
  );
}
