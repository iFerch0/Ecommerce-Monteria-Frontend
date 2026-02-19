export interface Customer {
  id: number;
  documentId: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  businessName: string | null;
  nit: string | null;
  city: string;
  department: string;
  address: string;
  isApproved: boolean;
  role: 'wholesale' | 'retail';
}
