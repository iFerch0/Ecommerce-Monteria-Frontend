'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  name: z.string().min(3, 'Nombre muy corto'),
  email: z.string().email('Email inválido'),
  phone: z.string().optional(),
  subject: z.string().min(3, 'Asunto requerido'),
  message: z.string().min(10, 'Mensaje muy corto (mínimo 10 caracteres)'),
});

type FormData = z.infer<typeof schema>;

type Status = 'idle' | 'sending' | 'success' | 'error';

export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setStatus('sending');
    // Simulated send — replace with real email API (Resend) when configured
    await new Promise((r) => setTimeout(r, 1200));
    console.log('Contact form submission:', data);
    setStatus('success');
    reset();
    setTimeout(() => setStatus('idle'), 5000);
  };

  const inputClass =
    'w-full rounded-xl border border-border bg-surface-alt px-4 py-3 text-sm transition-all focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-none';

  return (
    <div className="border-border bg-surface rounded-2xl border p-6 sm:p-8">
      <h2 className="text-primary mb-1 text-xl font-bold">Envíanos un mensaje</h2>
      <p className="text-text-muted mb-6 text-sm">Te responderemos en menos de 24 horas.</p>

      {status === 'success' ? (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <div className="text-5xl">✅</div>
          <h3 className="text-primary text-lg font-bold">¡Mensaje enviado!</h3>
          <p className="text-text-secondary text-sm">Nos pondremos en contacto pronto.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-text mb-1 block text-sm font-medium">Nombre *</label>
              <input {...register('name')} className={inputClass} placeholder="Tu nombre" />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
            </div>
            <div>
              <label className="text-text mb-1 block text-sm font-medium">Email *</label>
              <input
                {...register('email')}
                type="email"
                className={inputClass}
                placeholder="tu@email.com"
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-text mb-1 block text-sm font-medium">Teléfono</label>
              <input
                {...register('phone')}
                type="tel"
                className={inputClass}
                placeholder="+57 300 000 0000"
              />
            </div>
            <div>
              <label className="text-text mb-1 block text-sm font-medium">Asunto *</label>
              <input
                {...register('subject')}
                className={inputClass}
                placeholder="¿En qué te podemos ayudar?"
              />
              {errors.subject && (
                <p className="mt-1 text-xs text-red-500">{errors.subject.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="text-text mb-1 block text-sm font-medium">Mensaje *</label>
            <textarea
              {...register('message')}
              rows={5}
              className={inputClass}
              placeholder="Cuéntanos sobre tu pedido o consulta..."
            />
            {errors.message && (
              <p className="mt-1 text-xs text-red-500">{errors.message.message}</p>
            )}
          </div>

          {status === 'error' && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              ❌ Error al enviar. Intenta de nuevo o escríbenos por WhatsApp.
            </p>
          )}

          <button
            type="submit"
            disabled={status === 'sending'}
            className="bg-accent hover:bg-accent-light w-full rounded-full py-3 text-sm font-bold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === 'sending' ? 'Enviando...' : 'Enviar mensaje →'}
          </button>
        </form>
      )}
    </div>
  );
}
