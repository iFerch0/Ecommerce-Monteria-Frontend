'use client';

import { useState, useEffect } from 'react';
import { ReviewList } from './ReviewList';
import { ReviewForm } from './ReviewForm';
import { useAuthStore } from '@/stores/authStore';
import type { Review } from '@/types/product';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';

interface ReviewSectionProps {
  productDocumentId: string;
}

interface Eligibility {
  canReview: boolean;
  alreadyReviewed: boolean;
  myReview: Review | null;
}

async function fetchEligibility(productId: string, token: string): Promise<Eligibility> {
  const res = await fetch(`${API_URL}/api/reviews/mine/${productId}`, {
    cache: 'no-store',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return { canReview: false, alreadyReviewed: false, myReview: null };
  const json = await res.json();
  return json.data;
}

export function ReviewSection({ productDocumentId }: ReviewSectionProps) {
  const [refreshKey, setRefreshKey] = useState(0);
  const { isAuthenticated, token } = useAuthStore();
  const [eligibility, setEligibility] = useState<Eligibility>({
    canReview: false,
    alreadyReviewed: false,
    myReview: null,
  });

  useEffect(() => {
    const promise =
      !isAuthenticated || !token
        ? Promise.resolve<Eligibility>({ canReview: false, alreadyReviewed: false, myReview: null })
        : fetchEligibility(productDocumentId, token);

    promise.then(setEligibility);
  }, [productDocumentId, isAuthenticated, token, refreshKey]);

  return (
    <div className="border-border mt-12 border-t pt-10">
      <ReviewList
        productDocumentId={productDocumentId}
        refreshKey={refreshKey}
        myReview={eligibility.myReview}
      />
      <ReviewForm
        productDocumentId={productDocumentId}
        onSubmitted={() => setRefreshKey((k) => k + 1)}
        canReview={eligibility.canReview}
        alreadyReviewed={eligibility.alreadyReviewed}
      />
    </div>
  );
}
