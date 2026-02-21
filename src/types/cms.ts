import type { StrapiImage } from './api';

export interface Banner {
  id: number;
  documentId: string;
  title: string;
  subtitle: string | null;
  image: StrapiImage;
  imageMobile: StrapiImage | null;
  linkUrl: string | null;
  linkText: string | null;
  isActive: boolean;
  sortOrder: number;
}

export interface PageContent {
  id: number;
  documentId: string;
  pageSlug: string;
  sectionKey: string;
  title: string | null;
  content: string | null;
  metadata: Record<string, unknown> | null;
  sortOrder: number;
  isActive: boolean;
}

export interface GlobalSetting {
  storeName: string;
  tagline: string | null;
  logo: StrapiImage | null;
  phone: string | null;
  whatsappNumber: string | null;
  whatsappMessage: string | null;
  email: string | null;
  address: string | null;
  city: string | null;
  department: string | null;
  facebookUrl: string | null;
  instagramUrl: string | null;
  tiktokUrl: string | null;
  youtubeUrl: string | null;
  metaDescription: string | null;
  metaKeywords: string | null;
}
