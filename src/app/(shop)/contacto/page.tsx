import type { Metadata } from 'next';
import { fetchAPI } from '@/lib/strapi';
import { ContactForm } from '@/components/contact/ContactForm';
import { SITE_NAME, WHATSAPP_NUMBER } from '@/lib/constants';
import type { GlobalSetting } from '@/types/cms';

export const metadata: Metadata = {
  title: 'Contacto',
  description: `Ponte en contacto con ${SITE_NAME}. Estamos en Montería, Córdoba. Escríbenos por WhatsApp o envíanos un mensaje.`,
};

async function getGlobalSetting(): Promise<GlobalSetting | null> {
  try {
    const data = await fetchAPI<{ data: GlobalSetting }>({
      endpoint: '/global-setting',
      revalidate: 300,
      tags: ['global-setting'],
    });
    return data.data || null;
  } catch {
    return null;
  }
}

export default async function ContactoPage() {
  const settings = await getGlobalSetting();

  const phone = settings?.phone || null;
  const email = settings?.email || null;
  const address = settings?.address || 'Montería, Córdoba, Colombia';
  const whatsapp = settings?.whatsappNumber || WHATSAPP_NUMBER;
  const whatsappMsg = settings?.whatsappMessage || 'Hola, me interesa hacer un pedido';

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="from-primary to-primary-light bg-gradient-to-r px-4 py-16 text-center text-white">
        <div className="mx-auto max-w-2xl">
          <h1 className="mb-4 text-4xl font-extrabold sm:text-5xl">Contáctanos</h1>
          <p className="text-lg text-gray-300">
            Estamos aquí para ayudarte. Escríbenos y te respondemos lo antes posible.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-5">
          {/* Contact info */}
          <aside className="space-y-4 lg:col-span-2">
            {/* WhatsApp — prominent */}
            {whatsapp && (
              <a
                href={`https://wa.me/${whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(whatsappMsg)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 rounded-2xl bg-[#25D366] p-5 text-white shadow-lg shadow-green-500/20 transition-transform hover:scale-[1.02]"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/20">
                  <svg viewBox="0 0 24 24" fill="white" className="h-7 w-7">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-medium text-white/80">La forma más rápida</p>
                  <p className="font-bold">WhatsApp</p>
                  <p className="text-sm text-white/80">{whatsapp}</p>
                </div>
              </a>
            )}

            {/* Other contact info */}
            <div className="border-border bg-surface space-y-4 rounded-2xl border p-5">
              {phone && (
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg">
                    📞
                  </div>
                  <div>
                    <p className="text-text-muted text-xs">Teléfono</p>
                    <a href={`tel:${phone}`} className="text-text font-medium hover:underline">
                      {phone}
                    </a>
                  </div>
                </div>
              )}

              {email && (
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg">
                    ✉️
                  </div>
                  <div>
                    <p className="text-text-muted text-xs">Email</p>
                    <a href={`mailto:${email}`} className="text-text font-medium hover:underline">
                      {email}
                    </a>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <div className="bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg">
                  📍
                </div>
                <div>
                  <p className="text-text-muted text-xs">Ubicación</p>
                  <p className="text-text font-medium">{address}</p>
                </div>
              </div>
            </div>

            {/* Business hours */}
            <div className="border-border bg-surface rounded-2xl border p-5">
              <h3 className="text-primary mb-3 font-semibold">⏰ Horario de atención</h3>
              <div className="text-text-secondary space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Lunes – Viernes</span>
                  <span className="font-medium">8:00 – 18:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Sábados</span>
                  <span className="font-medium">8:00 – 13:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Domingos</span>
                  <span className="text-text-muted">Cerrado</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Contact form */}
          <div className="lg:col-span-3">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
