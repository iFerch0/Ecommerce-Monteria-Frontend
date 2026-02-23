'use client';

import { useReducer, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { fetchAPI } from '@/lib/strapi';
import { formatPrice, getImageUrl } from '@/lib/utils';
import { ROUTES } from '@/lib/constants';
import type { Product } from '@/types/product';

// ----- Debounce hook -----
function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useReducer((_: T, v: T) => v, value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

// ----- Search state machine -----
type SearchState = {
  results: Product[];
  loading: boolean;
  open: boolean;
};

type SearchAction =
  | { type: 'SEARCH_START' }
  | { type: 'SEARCH_SUCCESS'; results: Product[] }
  | { type: 'SEARCH_ERROR' }
  | { type: 'CLEAR' }
  | { type: 'CLOSE' };

function searchReducer(state: SearchState, action: SearchAction): SearchState {
  switch (action.type) {
    case 'SEARCH_START':
      return { ...state, loading: true };
    case 'SEARCH_SUCCESS':
      return { results: action.results, loading: false, open: true };
    case 'SEARCH_ERROR':
      return { results: [], loading: false, open: false };
    case 'CLEAR':
      return { results: [], loading: false, open: false };
    case 'CLOSE':
      return { ...state, open: false };
    default:
      return state;
  }
}

export function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useReducer((_: string, v: string) => v, '');
  const [{ results, loading, open }, dispatch] = useReducer(searchReducer, {
    results: [],
    loading: false,
    open: false,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedQuery = useDebounce(query, 300);

  // Fetch suggestions — setState only called inside async callbacks (satisfies rule)
  useEffect(() => {
    const trimmed = debouncedQuery.trim();
    if (trimmed.length < 2) {
      dispatch({ type: 'CLEAR' });
      return;
    }

    let cancelled = false;
    dispatch({ type: 'SEARCH_START' });

    fetchAPI<{ data: Product[] }>({
      endpoint: '/products',
      query: {
        'filters[name][$containsi]': trimmed,
        'filters[isActive][$eq]': 'true',
        populate: 'coverImage,category',
        'pagination[pageSize]': '6',
      },
    })
      .then((data) => {
        if (!cancelled) dispatch({ type: 'SEARCH_SUCCESS', results: data.data || [] });
      })
      .catch(() => {
        if (!cancelled) dispatch({ type: 'SEARCH_ERROR' });
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        dispatch({ type: 'CLOSE' });
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const q = query.trim();
      if (!q) return;
      dispatch({ type: 'CLOSE' });
      router.push(`${ROUTES.PRODUCTS}?q=${encodeURIComponent(q)}`);
    },
    [query, router]
  );

  const handleSelect = useCallback(() => {
    setQuery('');
    dispatch({ type: 'CLEAR' });
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={handleSubmit} role="search">
        <div className="relative">
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => results.length > 0 && dispatch({ type: 'SEARCH_SUCCESS', results })}
            placeholder="Buscar productos..."
            autoComplete="off"
            className="border-border bg-surface-alt focus:border-accent focus:ring-accent/20 w-full rounded-full border py-2 pr-4 pl-9 text-sm transition-all focus:ring-2 focus:outline-none"
          />
          <div className="text-text-muted pointer-events-none absolute inset-y-0 left-3 flex items-center">
            {loading ? (
              <svg className="text-accent h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            ) : (
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            )}
          </div>
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                dispatch({ type: 'CLEAR' });
                inputRef.current?.focus();
              }}
              className="text-text-muted hover:text-text absolute inset-y-0 right-3 flex items-center transition-colors"
              aria-label="Limpiar búsqueda"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      </form>

      {/* Dropdown suggestions */}
      {open && (
        <div className="border-border bg-surface absolute top-full left-0 z-50 mt-2 w-full min-w-[300px] overflow-hidden rounded-2xl border shadow-xl">
          {results.length === 0 ? (
            <div className="text-text-secondary px-4 py-6 text-center text-sm">
              No se encontraron productos para &quot;{query}&quot;
            </div>
          ) : (
            <>
              <ul role="listbox">
                {results.map((product) => {
                  const imgUrl = product.coverImage?.url || product.images?.[0]?.url;
                  return (
                    <li key={product.id} role="option" aria-selected="false">
                      <Link
                        href={`${ROUTES.PRODUCTS}/${product.slug}`}
                        onClick={handleSelect}
                        className="hover:bg-surface-alt flex items-center gap-3 px-4 py-3 transition-colors"
                      >
                        <div className="bg-surface-alt relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                          {imgUrl ? (
                            <Image
                              src={getImageUrl(imgUrl)}
                              alt={product.name}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          ) : (
                            <span className="flex h-full w-full items-center justify-center text-lg">
                              📦
                            </span>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-text truncate text-sm font-medium">{product.name}</p>
                          {product.category && (
                            <p className="text-text-muted text-xs">{product.category.name}</p>
                          )}
                        </div>
                        <span className="text-accent shrink-0 text-sm font-semibold">
                          {formatPrice(product.basePrice)}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <div className="border-border border-t p-2">
                <Link
                  href={`${ROUTES.PRODUCTS}?q=${encodeURIComponent(query)}`}
                  onClick={handleSelect}
                  className="hover:bg-accent/10 text-accent flex items-center justify-center gap-1 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors"
                >
                  Ver todos los resultados para &quot;{query}&quot; →
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
