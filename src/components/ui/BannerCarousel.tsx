'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Banner } from '@/types/cms';

interface BannerCarouselProps {
  banners: Banner[];
}

export function BannerCarousel({ banners }: BannerCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % banners.length);
  }, [banners.length]);

  const prev = () => setCurrent((c) => (c - 1 + banners.length) % banners.length);

  useEffect(() => {
    if (isPaused || banners.length <= 1) return;
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [isPaused, next, banners.length]);

  if (banners.length === 0) return null;

  const banner = banners[current];

  return (
    <div
      className="relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slide */}
      <div className="relative h-[420px] w-full sm:h-[520px] lg:h-[580px]">
        <Image
          key={banner.id}
          src={
            banner.image.url.startsWith('http')
              ? banner.image.url
              : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337'}${banner.image.url}`
          }
          alt={banner.image.alternativeText || banner.title}
          fill
          className="object-cover transition-opacity duration-700"
          priority={current === 0}
          sizes="100vw"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

        {/* Content */}
        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto w-full max-w-7xl px-4">
            <div className="max-w-xl">
              <p className="mb-3 text-sm font-medium tracking-widest text-white/70 uppercase">
                El Mejor Precio
              </p>
              <h2 className="mb-4 text-4xl leading-tight font-extrabold text-white sm:text-5xl lg:text-6xl">
                {banner.title}
              </h2>
              {banner.subtitle && (
                <p className="mb-6 text-lg leading-relaxed text-white/80">{banner.subtitle}</p>
              )}
              {banner.linkUrl && (
                <Link
                  href={banner.linkUrl}
                  className="bg-accent hover:bg-accent-light inline-block rounded-full px-8 py-3 text-sm font-bold text-white shadow-lg transition-all hover:shadow-xl"
                >
                  {banner.linkText || 'Ver más'} →
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Arrows */}
      {banners.length > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Anterior"
            className="absolute top-1/2 left-4 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white backdrop-blur-sm transition-all hover:bg-black/60"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={next}
            aria-label="Siguiente"
            className="absolute top-1/2 right-4 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white backdrop-blur-sm transition-all hover:bg-black/60"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Dots */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Ir al banner ${i + 1}`}
              className={`h-2 rounded-full transition-all ${
                i === current ? 'w-6 bg-white' : 'w-2 bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
