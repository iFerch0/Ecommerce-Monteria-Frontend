'use client';

import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterFormData } from '@/lib/validations';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ROUTES, SITE_NAME } from '@/lib/constants';

const DEPARTMENTS = [
  'Antioquia',
  'Atlántico',
  'Bolívar',
  'Boyacá',
  'Caldas',
  'Caquetá',
  'Casanare',
  'Cauca',
  'Cesar',
  'Córdoba',
  'Cundinamarca',
  'Huila',
  'La Guajira',
  'Magdalena',
  'Meta',
  'Nariño',
  'Norte de Santander',
  'Putumayo',
  'Quindío',
  'Risaralda',
  'Santander',
  'Sucre',
  'Tolima',
  'Valle del Cauca',
];

export default function RegisterPage() {
  const { register: registerUser, isLoading } = useAuthStore();
  const router = useRouter();
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      customerType: 'retail',
      department: 'Córdoba',
      city: 'Montería',
    },
  });

  const customerType = useWatch({ control, name: 'customerType' });

  const onSubmit = async (data: RegisterFormData) => {
    setError('');
    try {
      await registerUser({
        email: data.email,
        password: data.password,
        username: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        city: data.city,
        department: data.department,
        address: data.address,
        businessName: data.businessName,
        nit: data.nit,
        customerType: data.customerType,
      });
      router.push(ROUTES.ACCOUNT);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrarse');
    }
  };

  const inputClass =
    'w-full rounded-lg border border-border bg-surface-alt px-4 py-2.5 text-sm transition-all focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-none';

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="mb-6 text-center">
          <Link href={ROUTES.HOME} className="mb-3 inline-block">
            <div className="bg-accent mx-auto flex h-12 w-12 items-center justify-center rounded-xl text-xl font-bold text-white">
              M
            </div>
          </Link>
          <h1 className="text-text text-2xl font-bold">Crear cuenta en {SITE_NAME}</h1>
          <p className="text-text-secondary mt-1 text-sm">
            Completa tus datos para comprar al por mayor
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="border-border bg-surface space-y-4 rounded-2xl border p-6 shadow-sm"
        >
          {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">❌ {error}</div>}

          {/* Customer Type */}
          <div>
            <label className="text-text mb-2 block text-sm font-medium">Tipo de cliente</label>
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`flex cursor-pointer items-center gap-2 rounded-lg border p-3 transition-all ${
                  customerType === 'retail'
                    ? 'border-accent bg-accent/5'
                    : 'border-border hover:border-accent/30'
                }`}
              >
                <input
                  type="radio"
                  value="retail"
                  {...register('customerType')}
                  className="text-accent"
                />
                <div>
                  <span className="text-text text-sm font-medium">🏠 Detal</span>
                  <p className="text-text-muted text-[11px]">Compras personales</p>
                </div>
              </label>
              <label
                className={`flex cursor-pointer items-center gap-2 rounded-lg border p-3 transition-all ${
                  customerType === 'wholesale'
                    ? 'border-accent bg-accent/5'
                    : 'border-border hover:border-accent/30'
                }`}
              >
                <input
                  type="radio"
                  value="wholesale"
                  {...register('customerType')}
                  className="text-accent"
                />
                <div>
                  <span className="text-text text-sm font-medium">🏢 Mayorista</span>
                  <p className="text-text-muted text-[11px]">Compras al por mayor</p>
                </div>
              </label>
            </div>
          </div>

          {/* Name */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="firstName" className="text-text mb-1 block text-sm font-medium">
                Nombre *
              </label>
              <input
                id="firstName"
                {...register('firstName')}
                className={inputClass}
                placeholder="Juan"
              />
              {errors.firstName && (
                <p className="mt-1 text-xs text-red-500">{errors.firstName.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="lastName" className="text-text mb-1 block text-sm font-medium">
                Apellido *
              </label>
              <input
                id="lastName"
                {...register('lastName')}
                className={inputClass}
                placeholder="Pérez"
              />
              {errors.lastName && (
                <p className="mt-1 text-xs text-red-500">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          {/* Wholesale fields */}
          {customerType === 'wholesale' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="businessName" className="text-text mb-1 block text-sm font-medium">
                  Razón social *
                </label>
                <input
                  id="businessName"
                  {...register('businessName')}
                  className={inputClass}
                  placeholder="Mi Negocio S.A.S."
                />
                {errors.businessName && (
                  <p className="mt-1 text-xs text-red-500">{errors.businessName.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="nit" className="text-text mb-1 block text-sm font-medium">
                  NIT (opcional)
                </label>
                <input
                  id="nit"
                  {...register('nit')}
                  className={inputClass}
                  placeholder="900.123.456-7"
                />
              </div>
            </div>
          )}

          {/* Contact */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="email" className="text-text mb-1 block text-sm font-medium">
                Email *
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                {...register('email')}
                className={inputClass}
                placeholder="tu@email.com"
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
            </div>
            <div>
              <label htmlFor="phone" className="text-text mb-1 block text-sm font-medium">
                Teléfono *
              </label>
              <input
                id="phone"
                type="tel"
                {...register('phone')}
                className={inputClass}
                placeholder="+57 300 123 4567"
              />
              {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>}
            </div>
          </div>

          {/* Password */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="password" className="text-text mb-1 block text-sm font-medium">
                Contraseña *
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                {...register('password')}
                className={inputClass}
                placeholder="Mín. 8 caracteres"
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="confirmPassword" className="text-text mb-1 block text-sm font-medium">
                Confirmar *
              </label>
              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                {...register('confirmPassword')}
                className={inputClass}
                placeholder="Repetir contraseña"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          {/* Location */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="department" className="text-text mb-1 block text-sm font-medium">
                Departamento *
              </label>
              <select id="department" {...register('department')} className={inputClass}>
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
              {errors.department && (
                <p className="mt-1 text-xs text-red-500">{errors.department.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="city" className="text-text mb-1 block text-sm font-medium">
                Ciudad *
              </label>
              <input
                id="city"
                {...register('city')}
                className={inputClass}
                placeholder="Montería"
              />
              {errors.city && <p className="mt-1 text-xs text-red-500">{errors.city.message}</p>}
            </div>
          </div>

          {/* Address */}
          <div>
            <label htmlFor="address" className="text-text mb-1 block text-sm font-medium">
              Dirección *
            </label>
            <input
              id="address"
              {...register('address')}
              className={inputClass}
              placeholder="Cra 1 #2-3, Barrio..."
            />
            {errors.address && (
              <p className="mt-1 text-xs text-red-500">{errors.address.message}</p>
            )}
          </div>

          {/* Wholesale notice */}
          {customerType === 'wholesale' && (
            <div className="rounded-lg bg-purple-50 p-3 text-xs text-purple-700">
              <strong>📋 Nota:</strong> Las cuentas mayoristas requieren aprobación del
              administrador. Recibirás un email cuando tu cuenta sea aprobada.
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="bg-accent hover:bg-accent-light w-full rounded-full py-3 text-sm font-bold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>

          <p className="text-text-secondary text-center text-sm">
            ¿Ya tienes cuenta?{' '}
            <Link href={ROUTES.LOGIN} className="text-accent hover:text-accent-light font-medium">
              Inicia sesión
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
