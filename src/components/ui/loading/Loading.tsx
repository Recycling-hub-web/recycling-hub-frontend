type LoadingSize = 'sm' | 'md' | 'lg';

type LoadingProps = {
  size?: LoadingSize;
  text?: string;
  fullPage?: boolean;
};

const SIZE_CLASSES: Record<LoadingSize, string> = {
  sm: 'h-6 w-6 border-2',
  md: 'h-10 w-10 border-4',
  lg: 'h-14 w-14 border-[5px]',
};

const TEXT_SIZE_CLASSES: Record<LoadingSize, string> = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

const Loading = ({
  size = 'md',
  text = 'Loading...',
  fullPage = false,
}: LoadingProps) => {
  const wrapperClassName = fullPage
    ? 'fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm'
    : 'flex flex-col items-center justify-center py-10';

  return (
    <div className={wrapperClassName}>
      <div
        className={`animate-spin rounded-full border-slate-200 border-t-brand-600 ${SIZE_CLASSES[size]}`}
      />
      {text && (
        <p
          className={`mt-3 font-medium text-slate-400 ${TEXT_SIZE_CLASSES[size]}`}
        >
          {text}
        </p>
      )}
    </div>
  );
};

export { Loading };
export type { LoadingProps };
