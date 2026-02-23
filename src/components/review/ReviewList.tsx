'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Review, ReviewSummary } from '@/types/product';
import { StarRating } from './StarRating';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';

interface ReviewListProps {
  productDocumentId: string;
}

interface ReviewsResponse {
  data: Review[];
  meta: { pagination: { total: number; pageCount: number } };
}

async function fetchReviews(productId: string, page: number): Promise<ReviewsResponse> {
  const res = await fetch(`${API_URL}/api/reviews/product/${productId}?page=${page}&pageSize=5`, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Error al cargar reseñas');
  return res.json();
}

async function fetchSummary(productId: string): Promise<ReviewSummary> {
  const res = await fetch(`${API_URL}/api/reviews/summary/${productId}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Error al cargar resumen');
  const json = await res.json();
  return json.data;
}

export function ReviewList({ productDocumentId }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [summary, setSummary] = useState<ReviewSummary | null>(null);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [loading, setLoading] = useState(true);

  const load = useCallback(
    async (p: number) => {
      setLoading(true);
      try {
        const [rev, sum] = await Promise.all([
          fetchReviews(productDocumentId, p),
          p === 1 ? fetchSummary(productDocumentId) : Promise.resolve(null),
        ]);
        setReviews(rev.data);
        setPageCount(rev.meta.pagination.pageCount);
        if (sum) setSummary(sum);
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    },
    [productDocumentId]
  );

  useEffect(() => {
    load(page);
  }, [load, page]);

  if (loading && page === 1) {
    return (
      <div className="mt-10">
        <h2 className="text-text mb-4 text-xl font-bold">Reseñas</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-surface-alt skeleton-shimmer h-24 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className="mt-10">
      <h2 className="text-text mb-4 text-xl font-bold">Reseñas de clientes</h2>

      {/* Summary */}
      {summary && summary.count > 0 && (
        <div className="border-border bg-surface-alt mb-6 flex flex-col gap-4 rounded-xl border p-4 sm:flex-row sm:items-center">
          <div className="sm:border-border text-center sm:border-r sm:pr-8">
            <p className="text-accent text-5xl font-bold">{summary.average}</p>
            <StarRating value={Math.round(summary.average)} size="md" />
            <p className="text-text-secondary mt-1 text-sm">{summary.count} reseñas</p>
          </div>
          <div className="flex-1 space-y-1.5">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = summary.distribution[star] || 0;
              const pct = summary.count > 0 ? Math.round((count / summary.count) * 100) : 0;
              return (
                <div key={star} className="flex items-center gap-2">
                  <span className="text-text-secondary w-4 text-right text-xs">{star}</span>
                  <span className="text-sm text-yellow-400">★</span>
                  <div className="bg-border h-2 flex-1 overflow-hidden rounded-full">
                    <div
                      className="h-full rounded-full bg-yellow-400 transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-text-muted w-8 text-right text-xs">{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Review cards */}
      {reviews.length === 0 ? (
        <p className="text-text-muted py-8 text-center text-sm">
          No hay reseñas aprobadas todavía. ¡Sé el primero!
        </p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <article key={review.id} className="border-border bg-surface rounded-xl border p-4">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <StarRating value={review.rating} size="sm" />
                  {review.verifiedPurchase && (
                    <span className="bg-success/10 text-success rounded-full px-2 py-0.5 text-xs font-medium">
                      ✓ Compra verificada
                    </span>
                  )}
                </div>
                <span className="text-text-muted text-xs">
                  {new Date(review.createdAt).toLocaleDateString('es-CO', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
              {review.title && <p className="text-text mb-1 font-semibold">{review.title}</p>}
              <p className="text-text-secondary text-sm">{review.comment}</p>
              {review.user?.username && (
                <p className="text-text-muted mt-2 text-xs">— {review.user.username}</p>
              )}
            </article>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pageCount > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1 || loading}
            className="border-border text-text-secondary hover:border-accent rounded-lg border px-4 py-2 text-sm transition-colors disabled:opacity-40"
          >
            ← Anterior
          </button>
          <span className="text-text-secondary flex items-center px-4 text-sm">
            {page} / {pageCount}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
            disabled={page === pageCount || loading}
            className="border-border text-text-secondary hover:border-accent rounded-lg border px-4 py-2 text-sm transition-colors disabled:opacity-40"
          >
            Siguiente →
          </button>
        </div>
      )}
    </section>
  );
}
