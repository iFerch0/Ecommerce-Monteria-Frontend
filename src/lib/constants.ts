export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'E-commerce Montería';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';
export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '';
export const WOMPI_PUBLIC_KEY = process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY || '';

export const ROUTES = {
  HOME: '/',
  PRODUCTS: '/productos',
  CATEGORIES: '/categorias',
  CART: '/carrito',
  CHECKOUT: '/checkout',
  CONFIRMATION: '/confirmacion',
  LOGIN: '/login',
  REGISTER: '/registro',
  ACCOUNT: '/mi-cuenta',
  ORDERS: '/mis-pedidos',
  ABOUT: '/nosotros',
  CONTACT: '/contacto',
  POLICIES: '/politicas',
} as const;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 100,
} as const;
