'use client';

import { useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { StarRating } from './StarRating';
import Link from 'next/link';
import { ROUTES } from '@/lib/constants';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';

interface ReviewFormProps {
  productDocumentId: string;
  onSubmitted?: () => void;
}

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

export function ReviewForm({ productDocumentId, onSubmitted }: ReviewFormProps) {
  const { isAuthenticated, token } = useAuthStore();
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isAuthenticated) {
    return (
      <div className="border-border bg-surface-alt mt-8 rounded-xl border p-6 text-center">
        <p className="text-text-secondary mb-3 text-sm">Inicia sesión para dejar tu reseña</p>
        <Link
          href={ROUTES.LOGIN}
          className="bg-accent hover:bg-accent/90 inline-block rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-colors"
        >
          Iniciar sesión
        </Link>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) {
      setErrorMsg('Por favor selecciona una calificación');
      return;
    }
    if (comment.trim().length < 10) {
      setErrorMsg('El comentario debe tener al menos 10 caracteres');
      return;
    }

    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch(`${API_URL}/api/reviews/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: productDocumentId,
          rating,
          title: title.trim() || undefined,
          comment: comment.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || data?.error?.message || 'Error al enviar la reseña');
      }

      setStatus('success');
      setRating(0);
      setTitle('');
      setComment('');
      onSubmitted?.();
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Error inesperado');
    }
  }

  if (status === 'success') {
    return (
      <div className="border-border bg-surface-alt mt-8 rounded-xl border p-6 text-center">
        <span className="text-4xl">🎉</span>
        <p className="text-text mt-3 font-semibold">¡Reseña enviada!</p>
        <p className="text-text-secondary mt-1 text-sm">
          Será publicada tras la moderación. ¡Gracias por tu opinión!
        </p>
      </div>
    );
  }

  return (
    <div className="border-border bg-surface mt-8 rounded-xl border p-6">
      <h3 className="text-text mb-4 font-semibold">Escribe tu reseña</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating */}
        <div>
          <label className="text-text-secondary mb-2 block text-sm">
            Calificación <span className="text-accent">*</span>
          </label>
          <StarRating value={rating} interactive onChange={setRating} size="lg" />
        </div>

        {/* Title (optional) */}
        <div>
          <label className="text-text-secondary mb-1 block text-sm" htmlFor="review-title">
            Título (opcional)
          </label>
          <input
            id="review-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={150}
            placeholder="Resumen de tu experiencia"
            className="border-border bg-surface-alt text-text placeholder:text-text-muted focus:border-accent w-full rounded-lg border px-3 py-2.5 text-sm transition-colors outline-none"
          />
        </div>

        {/* Comment */}
        <div>
          <label className="text-text-secondary mb-1 block text-sm" htmlFor="review-comment">
            Comentario <span className="text-accent">*</span>
          </label>
          <textarea
            id="review-comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength={1000}
            rows={4}
            placeholder="Describe tu experiencia con este producto..."
            required
            className="border-border bg-surface-alt text-text placeholder:text-text-muted focus:border-accent w-full resize-none rounded-lg border px-3 py-2.5 text-sm transition-colors outline-none"
          />
          <p className="text-text-muted mt-1 text-right text-xs">{comment.length}/1000</p>
        </div>

        {/* Error */}
        {errorMsg && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{errorMsg}</p>
        )}

        <button
          type="submit"
          disabled={status === 'loading'}
          className="bg-accent hover:bg-accent/90 w-full rounded-lg py-2.5 text-sm font-semibold text-white transition-colors disabled:opacity-60"
        >
          {status === 'loading' ? 'Enviando...' : 'Enviar reseña'}
        </button>
      </form>
    </div>
  );
}
