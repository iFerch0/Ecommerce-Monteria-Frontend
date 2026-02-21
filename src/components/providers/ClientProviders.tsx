'use client';

import { CartDrawer } from '@/components/cart/CartDrawer';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';
import { WHATSAPP_NUMBER } from '@/lib/constants';

interface ClientProvidersProps {
  children: React.ReactNode;
  whatsappNumber?: string;
  whatsappMessage?: string;
}

export function ClientProviders({
  children,
  whatsappNumber,
  whatsappMessage,
}: ClientProvidersProps) {
  const phone = whatsappNumber || WHATSAPP_NUMBER;

  return (
    <>
      {children}
      <CartDrawer />
      {phone && <WhatsAppButton phoneNumber={phone} message={whatsappMessage} />}
    </>
  );
}
