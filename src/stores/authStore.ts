'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: number;
  username: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export interface RegisterData {
  email: string;
  password: string;
  username: string;
  firstName: string;
  lastName: string;
  phone: string;
  city: string;
  department: string;
  address: string;
  businessName?: string;
  nit?: string;
  customerType: 'wholesale' | 'retail';
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (identifier, password) => {
        set({ isLoading: true });
        try {
          const res = await fetch(`${API_URL}/api/auth/local`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ identifier, password }),
          });

          if (!res.ok) {
            const error = await res.json();
            throw new Error(error?.error?.message || 'Error al iniciar sesión');
          }

          const data = await res.json();
          set({
            user: data.user,
            token: data.jwt,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (data) => {
        set({ isLoading: true });
        try {
          // Step 1: Register user with Strapi Users-Permissions
          const res = await fetch(`${API_URL}/api/auth/local/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              username: data.email,
              email: data.email,
              password: data.password,
            }),
          });

          if (!res.ok) {
            const error = await res.json();
            throw new Error(error?.error?.message || 'Error al registrarse');
          }

          const authData = await res.json();

          // Step 2: Create customer profile
          await fetch(`${API_URL}/api/customer-profiles`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${authData.jwt}`,
            },
            body: JSON.stringify({
              data: {
                user: authData.user.id,
                firstName: data.firstName,
                lastName: data.lastName,
                phone: data.phone,
                city: data.city,
                department: data.department,
                address: data.address,
                businessName: data.businessName || null,
                nit: data.nit || null,
                customerType: data.customerType,
                isApproved: data.customerType === 'retail',
              },
            }),
          });

          set({
            user: authData.user,
            token: authData.jwt,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },

      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'ecommerce-monteria-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
