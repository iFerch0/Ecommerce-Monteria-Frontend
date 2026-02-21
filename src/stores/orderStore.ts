import { create } from 'zustand';
import { API_URL } from '@/lib/constants';

export interface OrderItem {
  id: number;
  productName: string;
  productSlug: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  selectedSize: string | null;
  selectedColor: string | null;
}

export interface Order {
  id: number;
  documentId: string;
  orderNumber: string;
  orderStatus: string;
  subtotal: number;
  shippingCost: number;
  total: number;
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    department: string;
    phone: string;
  };
  notes: string | null;
  orderItems: OrderItem[];
  payment: {
    id: number;
    paymentStatus: string;
    amount: number;
    wompiTransactionId: string | null;
    paymentMethod: string | null;
  } | null;
  createdAt: string;
}

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  createOrder: (
    items: {
      productId: number;
      productName: string;
      productSlug: string;
      quantity: number;
      unitPrice: number;
      selectedSize?: string;
      selectedColor?: string;
    }[],
    shippingAddress: {
      fullName: string;
      address: string;
      city: string;
      department: string;
      phone: string;
    },
    notes: string,
    token: string
  ) => Promise<{ orderNumber: string; total: number; paymentId: string }>;
  confirmPayment: (orderNumber: string, wompiTransactionId: string, token: string) => Promise<void>;
  fetchMyOrders: (token: string) => Promise<void>;
}

export const useOrderStore = create<OrderState>((set) => ({
  orders: [],
  currentOrder: null,
  isLoading: false,

  createOrder: async (items, shippingAddress, notes, token) => {
    set({ isLoading: true });
    try {
      const res = await fetch(`${API_URL}/api/orders/create-from-cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ items, shippingAddress, notes }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error?.error?.message || 'Error al crear el pedido');
      }

      const data = await res.json();
      set({ isLoading: false });

      return {
        orderNumber: data.order.orderNumber,
        total: data.order.total,
        paymentId: data.payment.documentId,
      };
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  confirmPayment: async (orderNumber, wompiTransactionId, token) => {
    const res = await fetch(`${API_URL}/api/orders/confirm-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ orderNumber, wompiTransactionId }),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error?.error?.message || 'Error al confirmar el pago');
    }
  },

  fetchMyOrders: async (token) => {
    set({ isLoading: true });
    try {
      const res = await fetch(`${API_URL}/api/orders/my-orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Error al obtener pedidos');

      const data = await res.json();
      set({ orders: data.data || [], isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },
}));
