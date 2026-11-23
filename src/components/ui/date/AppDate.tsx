'use client';

import { useMemo } from 'react';

import type { AppDateProps } from './types';
import { formatDate, parseDate, toISOString } from './utils';

/**
 * AppDate — universal date display component.
 *
 * Renders a semantically correct `<time>` element with a machine-readable
 * `datetime` attribute for accessibility and SEO, while displaying the date
 * in any of the five supported human-readable formats.
 *
 * @example
 * <AppDate value={user.created_at} format="short" />
 * <AppDate value={application.submitted_at} format="relative" />
 * <AppDate value={null} fallback="Not set" />
 */
const AppDate = ({
  value,
  format = 'short',
  locale = 'en-GB',
  timeZone,
  fallback = '—',
  className,
}: AppDateProps) => {
  const parsed = useMemo(() => parseDate(value), [value]);
  const formatted = useMemo(
    () => (parsed ? formatDate(parsed, format, locale, timeZone) : null),
    [parsed, format, locale, timeZone],
  );

  if (!parsed) {
    return <span className={className}>{fallback}</span>;
  }

  return (
    <time
      dateTime={toISOString(parsed)}
      className={className}
      title={new Intl.DateTimeFormat(locale, {
        timeZone,
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }).format(parsed)}
    >
      {formatted}
    </time>
  );
};

export { AppDate };
