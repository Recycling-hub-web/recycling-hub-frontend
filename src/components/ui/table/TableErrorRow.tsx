import { LuRefreshCw, LuTriangleAlert } from 'react-icons/lu';

import { usePortalLocale } from '../../../contexts/PortalLocaleContext';

type TableErrorRowProps = {
  colSpan: number;
  message?: string;
  onRetry?: () => void;
};

const TableErrorRow = ({
  colSpan,
  message = 'Something went wrong while loading this data.',
  onRetry,
}: TableErrorRowProps) => {
  const { t } = usePortalLocale();
  return (
    <tr>
      <td colSpan={colSpan} className="px-6 py-10 text-center">
        <div className="flex flex-col items-center gap-2">
          <div className="flex size-12 items-center justify-center rounded-xl bg-red-50">
            <LuTriangleAlert className="size-6 text-red-500" />
          </div>
          <p className="text-sm font-medium text-slate-900">
            {t('Something went wrong')}
          </p>
          <p className="text-xs text-slate-500">{t(message)}</p>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <LuRefreshCw className="size-3.5" />
              {t('Retry')}
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};

export { TableErrorRow };
export type { TableErrorRowProps };
