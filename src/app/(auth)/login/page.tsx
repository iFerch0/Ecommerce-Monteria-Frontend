'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormData } from '@/lib/validations';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ROUTES, SITE_NAME } from '@/lib/constants';

export default function LoginPage() {
  const { login, isLoading } = useAuthStore();
  const router = useRouter();
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setError('');
    try {
      await login(data.email, data.password);
      router.push(ROUTES.ACCOUNT);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <Link href={ROUTES.HOME} className="mb-4 inline-block">
            <div className="bg-accent mx-auto flex h-12 w-12 items-center justify-center rounded-xl text-xl font-bold text-white">
              M
            </div>
          </Link>
          <h1 className="text-text text-2xl font-bold">{SITE_NAME}</h1>
          <p className="text-text-secondary mt-1">Inicia sesión en tu cuenta</p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="border-border bg-surface space-y-4 rounded-2xl border p-6 shadow-sm"
        >
          {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">❌ {error}</div>}

          <div>
            <label htmlFor="email" className="text-text mb-1 block text-sm font-medium">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              {...register('email')}
              className="border-border bg-surface-alt focus:border-accent focus:ring-accent/20 w-full rounded-lg border px-4 py-2.5 text-sm transition-all focus:ring-2 focus:outline-none"
              placeholder="tu@email.com"
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="password" className="text-text mb-1 block text-sm font-medium">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              {...register('password')}
              className="border-border bg-surface-alt focus:border-accent focus:ring-accent/20 w-full rounded-lg border px-4 py-2.5 text-sm transition-all focus:ring-2 focus:outline-none"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="bg-accent hover:bg-accent-light w-full rounded-full py-3 text-sm font-bold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? 'Ingresando...' : 'Iniciar sesión'}
          </button>

          <p className="text-text-secondary text-center text-sm">
            ¿No tienes cuenta?{' '}
            <Link
              href={ROUTES.REGISTER}
              className="text-accent hover:text-accent-light font-medium"
            >
              Regístrate aquí
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
