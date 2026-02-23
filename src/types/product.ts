import type { StrapiImage } from './api';

export interface Product {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string | null;
  sku: string;
  basePrice: number;
  compareAtPrice: number | null;
  minWholesaleQty: number;
  isActive: boolean;
  isFeatured: boolean;
  brand: string | null;
  sizes: string[];
  colors: string[];
  tags: string[] | null;
  weight: number | null;
  material: string | null;
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
  sortOrder: number;
  isActive: boolean;
}

export interface PriceTier {
  id: number;
  minQuantity: number;
  maxQuantity: number | null;
  pricePerUnit: number;
  label: string | null;
}

export interface Review {
  id: number;
  documentId: string;
  rating: number;
  title: string | null;
  comment: string;
  isApproved: boolean;
  verifiedPurchase: boolean;
  user: { username: string } | null;
  createdAt: string;
}

export interface ReviewSummary {
  average: number;
  count: number;
  distribution: Record<string, number>;
}
