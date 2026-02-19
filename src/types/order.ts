export interface Order {
  id: number;
  documentId: string;
  orderNumber: string;
  status: OrderStatus;
  subtotal: number;
  shippingCost: number;
  total: number;
  shippingAddress: ShippingAddress;
  notes: string | null;
  items: OrderItem[];
  payment: Payment | null;
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface OrderItem {
  id: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  size: string | null;
  color: string | null;
  product: {
    id: number;
    name: string;
    slug: string;
  };
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  department: string;
  notes?: string;
}

export interface Payment {
  id: number;
  wompiTransactionId: string;
  status: 'pending' | 'approved' | 'declined' | 'voided';
  paymentMethod: string;
  amount: number;
  createdAt: string;
}
