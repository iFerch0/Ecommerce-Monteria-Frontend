'use client';

interface StarRatingProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onChange?: (rating: number) => void;
}

const sizeMap = { sm: 'text-sm', md: 'text-xl', lg: 'text-2xl' };

export function StarRating({
  value,
  max = 5,
  size = 'md',
  interactive = false,
  onChange,
}: StarRatingProps) {
  return (
    <div className="flex items-center gap-0.5" role={interactive ? 'group' : undefined}>
      {Array.from({ length: max }, (_, i) => {
        const starValue = i + 1;
        const filled = starValue <= value;
        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onChange?.(starValue)}
            className={[
              sizeMap[size],
              'transition-transform',
              interactive ? 'cursor-pointer hover:scale-110 focus:outline-none' : 'cursor-default',
              filled ? 'text-yellow-400' : 'text-gray-300',
            ].join(' ')}
            aria-label={`${starValue} de ${max} estrellas`}
          >
            ★
          </button>
        );
      })}
    </div>
  );
}
