import { LuStar } from 'react-icons/lu';

type StarRatingProps = {
  /** Current rating (1–5). */
  value?: number;
  /** Omit to render read-only. */
  onChange?: (value: number) => void;
  /** Tailwind size class for each star icon. */
  size?: string;
};

const StarRating = ({
  value = 0,
  onChange,
  size = 'h-5 w-5',
}: StarRatingProps) => {
  const readOnly = !onChange;

  return (
    <div
      className={`inline-flex items-center gap-0.5 ${readOnly ? '' : 'cursor-pointer'}`}
    >
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = n <= value;
        return (
          <button
            key={n}
            type="button"
            disabled={readOnly}
            onClick={() => onChange?.(n)}
            aria-label={`${n} star${n === 1 ? '' : 's'}`}
            aria-pressed={filled}
            className={`${size} text-amber-400 flex items-center justify-center disabled:cursor-default ${
              readOnly
                ? ''
                : 'transition-transform duration-150 ease-in-out hover:scale-110'
            }`}
          >
            <LuStar
              className="size-full"
              fill={filled ? 'currentColor' : 'none'}
            />
          </button>
        );
      })}
    </div>
  );
};

export { StarRating };
export type { StarRatingProps };
