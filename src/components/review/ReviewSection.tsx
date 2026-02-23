'use client';

import { useState } from 'react';
import { ReviewList } from './ReviewList';
import { ReviewForm } from './ReviewForm';

interface ReviewSectionProps {
  productDocumentId: string;
}

export function ReviewSection({ productDocumentId }: ReviewSectionProps) {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="border-border mt-12 border-t pt-10">
      <ReviewList productDocumentId={productDocumentId} refreshKey={refreshKey} />
      <ReviewForm
        productDocumentId={productDocumentId}
        onSubmitted={() => setRefreshKey((k) => k + 1)}
      />
    </div>
  );
}
