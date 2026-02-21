import type { Metadata } from 'next';
import { fetchAPI } from '@/lib/strapi';
import { PoliciesTabs } from '@/components/policies/PoliciesTabs';
import type { PageContent } from '@/types/cms';

export const metadata: Metadata = {
  title: 'Políticas',
  description:
    'Políticas de privacidad, envío, devoluciones y términos y condiciones de El Mejor Precio.',
};

const POLICY_SLUGS = [
  'politicas-privacidad',
  'politicas-envio',
  'politicas-devolucion',
  'terminos',
] as const;

const POLICY_LABELS: Record<string, string> = {
  'politicas-privacidad': 'Privacidad',
  'politicas-envio': 'Envíos',
  'politicas-devolucion': 'Devoluciones',
  terminos: 'Términos',
};

async function getPolicies(): Promise<Record<string, PageContent[]>> {
  const result: Record<string, PageContent[]> = {};

  try {
    const data = await fetchAPI<{ data: PageContent[] }>({
      endpoint: '/page-contents',
      query: {
        'filters[pageSlug][$in][0]': 'politicas-privacidad',
        'filters[pageSlug][$in][1]': 'politicas-envio',
        'filters[pageSlug][$in][2]': 'politicas-devolucion',
        'filters[pageSlug][$in][3]': 'terminos',
        'filters[isActive][$eq]': 'true',
        sort: 'sortOrder:asc',
        'pagination[pageSize]': '100',
      },
      revalidate: 300,
      tags: ['page-content'],
    });

    for (const slug of POLICY_SLUGS) {
      result[slug] = (data.data || []).filter((s) => s.pageSlug === slug);
    }
  } catch {
    for (const slug of POLICY_SLUGS) {
      result[slug] = [];
    }
  }

  return result;
}

const FALLBACK_POLICIES: Record<string, { title: string; content: string }[]> = {
  'politicas-privacidad': [
    {
      title: 'Recopilación de información',
      content:
        'Recopilamos información personal como nombre, correo electrónico, dirección y teléfono únicamente para procesar tus pedidos y mejorar tu experiencia de compra.',
    },
    {
      title: 'Uso de la información',
      content:
        'Tu información personal nunca será compartida con terceros sin tu consentimiento, salvo requerimiento legal o para procesar pagos a través de pasarelas certificadas como Wompi.',
    },
    {
      title: 'Seguridad',
      content:
        'Implementamos medidas de seguridad técnicas y organizativas para proteger tu información contra acceso no autorizado, pérdida o alteración.',
    },
  ],
  'politicas-envio': [
    {
      title: 'Tiempos de entrega',
      content:
        'Los pedidos se procesan en 1-2 días hábiles. Los tiempos de entrega varían según el destino: Montería y alrededores 1-2 días, resto del país 3-7 días hábiles.',
    },
    {
      title: 'Costos de envío',
      content:
        'El costo de envío se calcula según el peso del pedido y la ciudad de destino. Los pedidos mayoristas pueden tener condiciones especiales de envío.',
    },
    {
      title: 'Seguimiento',
      content:
        'Una vez despachado tu pedido, recibirás el número de guía por WhatsApp para hacer seguimiento en tiempo real.',
    },
  ],
  'politicas-devolucion': [
    {
      title: 'Condiciones para devolución',
      content:
        'Aceptamos devoluciones dentro de los 5 días hábiles siguientes a la recepción del pedido, siempre que el producto esté en perfectas condiciones, sin uso y con su empaque original.',
    },
    {
      title: 'Proceso de devolución',
      content:
        'Para iniciar una devolución, contáctanos por WhatsApp o email con tu número de pedido y el motivo de la devolución. Te indicaremos los pasos a seguir.',
    },
    {
      title: 'Reembolsos',
      content:
        'Una vez recibido y verificado el producto, procesaremos el reembolso en un plazo de 5-10 días hábiles a través del mismo medio de pago utilizado.',
    },
  ],
  terminos: [
    {
      title: 'Uso del sitio',
      content:
        'Al utilizar este sitio web, aceptas estos términos y condiciones. El acceso y uso del sitio está condicionado a la aceptación de las presentes condiciones.',
    },
    {
      title: 'Precios y disponibilidad',
      content:
        'Nos reservamos el derecho de modificar precios y disponibilidad de productos sin previo aviso. Los precios mostrados incluyen IVA cuando aplique.',
    },
    {
      title: 'Propiedad intelectual',
      content:
        'Todos los contenidos de este sitio (imágenes, textos, logos) son propiedad de El Mejor Precio y están protegidos por las leyes de propiedad intelectual colombiana.',
    },
  ],
};

export default async function PoliticasPage() {
  const policies = await getPolicies();

  const tabs = POLICY_SLUGS.map((slug) => ({
    slug,
    label: POLICY_LABELS[slug],
    sections:
      policies[slug].length > 0
        ? policies[slug].map((s) => ({ title: s.title || '', content: s.content || '' }))
        : FALLBACK_POLICIES[slug],
  }));

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="from-primary to-primary-light bg-gradient-to-r px-4 py-16 text-center text-white">
        <div className="mx-auto max-w-2xl">
          <h1 className="mb-4 text-4xl font-extrabold sm:text-5xl">Políticas</h1>
          <p className="text-lg text-gray-300">
            Transparencia y claridad en cada aspecto de nuestra relación contigo.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 py-12">
        <PoliciesTabs tabs={tabs} />
      </div>
    </div>
  );
}
