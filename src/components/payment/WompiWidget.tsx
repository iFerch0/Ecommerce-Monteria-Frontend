'use client';

import { useEffect, useRef, useCallback } from 'react';
import { WOMPI_PUBLIC_KEY } from '@/lib/constants';

declare global {
  interface Window {
    WidgetCheckout: new (config: WompiConfig) => WompiCheckoutInstance;
  }
}

interface WompiConfig {
  currency: string;
  amountInCents: number;
  reference: string;
  publicKey: string;
  signature: { integrity: string };
  redirectUrl?: string;
  customerData?: {
    email?: string;
    fullName?: string;
    phoneNumber?: string;
    phoneNumberPrefix?: string;
  };
  shippingAddress?: {
    addressLine1: string;
    city: string;
    phoneNumber: string;
    region: string;
    country: string;
  };
}

interface WompiTransaction {
  id: string;
  status: string;
  reference: string;
}

interface WompiCheckoutInstance {
  open: (callback: (result: { transaction: WompiTransaction }) => void) => void;
}

interface WompiWidgetProps {
  amountInCents: number;
  reference: string;
  signature: string;
  customerEmail?: string;
  customerName?: string;
  customerPhone?: string;
  shippingAddress?: {
    address: string;
    city: string;
    phone: string;
    department: string;
  };
  onSuccess: (transaction: WompiTransaction) => void;
  onClose: () => void;
}

export function WompiWidget({
  amountInCents,
  reference,
  signature,
  customerEmail,
  customerName,
  customerPhone,
  shippingAddress,
  onSuccess,
  onClose,
}: WompiWidgetProps) {
  const scriptLoaded = useRef(false);
  const widgetOpened = useRef(false);

  const openWidget = useCallback(() => {
    if (widgetOpened.current) return;
    widgetOpened.current = true;

    if (!WOMPI_PUBLIC_KEY) {
      console.error('NEXT_PUBLIC_WOMPI_PUBLIC_KEY not set');
      onClose();
      return;
    }

    const config: WompiConfig = {
      currency: 'COP',
      amountInCents,
      reference,
      publicKey: WOMPI_PUBLIC_KEY,
      signature: { integrity: signature },
    };

    if (customerEmail || customerName || customerPhone) {
      config.customerData = {
        email: customerEmail,
        fullName: customerName,
        phoneNumber: customerPhone,
        phoneNumberPrefix: '+57',
      };
    }

    if (shippingAddress) {
      config.shippingAddress = {
        addressLine1: shippingAddress.address,
        city: shippingAddress.city,
        phoneNumber: shippingAddress.phone,
        region: shippingAddress.department,
        country: 'CO',
      };
    }

    const checkout = new window.WidgetCheckout(config);

    checkout.open((result) => {
      const transaction = result.transaction;
      if (transaction.status === 'APPROVED') {
        onSuccess(transaction);
      } else {
        onClose();
      }
    });
  }, [
    amountInCents,
    reference,
    signature,
    customerEmail,
    customerName,
    customerPhone,
    shippingAddress,
    onSuccess,
    onClose,
  ]);

  useEffect(() => {
    if (scriptLoaded.current) {
      if (window.WidgetCheckout) {
        openWidget();
      }
      return;
    }

    scriptLoaded.current = true;

    // Check if script already loaded
    if (window.WidgetCheckout) {
      openWidget();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.wompi.co/widget.js';
    script.async = true;
    script.onload = () => {
      openWidget();
    };
    script.onerror = () => {
      console.error('Failed to load Wompi widget');
      onClose();
    };
    document.head.appendChild(script);
  }, [openWidget, onClose]);

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4 animate-pulse text-4xl">💳</div>
      <p className="text-text text-sm font-medium">Abriendo pasarela de pago...</p>
      <p className="text-text-muted mt-1 text-xs">Wompi Checkout se abrirá en un momento</p>
    </div>
  );
}
