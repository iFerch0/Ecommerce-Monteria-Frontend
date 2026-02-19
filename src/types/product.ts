import type { StrapiImage } from './api';

export interface Product {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  description: string;
  sku: string;
  basePrice: number;
  minWholesaleQty: number;
  isActive: boolean;
  brand: string | null;
  sizes: string[];
  colors: string[];
  images: StrapiImage[];
  coverImage: StrapiImage | null;
  category: Category | null;
  priceTiers: PriceTier[];
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  description: string | null;
  image: StrapiImage | null;
  parent: Category | null;
  children: Category[];
}

export interface PriceTier {
  id: number;
  minQuantity: number;
  maxQuantity: number | null;
  pricePerUnit: number;
}
