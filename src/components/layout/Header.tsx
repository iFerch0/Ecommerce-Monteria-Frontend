import { fetchAPI } from '@/lib/strapi';
import { getImageUrl } from '@/lib/utils';
import { SITE_NAME } from '@/lib/constants';
import { HeaderClient } from './HeaderClient';

interface GlobalSetting {
  storeName: string;
  tagline: string | null;
  logo: { url: string } | null;
}

async function getGlobalSetting(): Promise<GlobalSetting | null> {
  try {
    const data = await fetchAPI<{ data: GlobalSetting }>({
      endpoint: '/global-setting',
      query: { populate: 'logo' },
      revalidate: 300,
      tags: ['global-setting'],
    });
    return data.data ?? null;
  } catch {
    return null;
  }
}

export async function Header() {
  const settings = await getGlobalSetting();

  return (
    <HeaderClient
      storeName={settings?.storeName ?? SITE_NAME}
      tagline={settings?.tagline ?? 'Venta al por Mayor'}
      logoUrl={settings?.logo ? getImageUrl(settings.logo.url) : null}
    />
  );
}
