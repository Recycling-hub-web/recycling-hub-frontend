/** wa.me wants the full international number as digits only — the stored
 * E.164 "+60123456789" becomes https://wa.me/60123456789. */
const whatsAppUrl = (phoneNumber: string) =>
  `https://wa.me/${phoneNumber.replace(/\D/g, '')}`;

type WhatsAppLinkProps = {
  phoneNumber: string | null | undefined;
  className?: string;
};

/** A phone number that opens a WhatsApp chat with it, in a new tab. Safe
 * inside a clickable table row — the click doesn't bubble to the row.
 * Renders "—" when there's no number. */
const WhatsAppLink = ({ phoneNumber, className = '' }: WhatsAppLinkProps) => {
  if (!phoneNumber) return <span className="text-slate-400">—</span>;
  return (
    <a
      href={whatsAppUrl(phoneNumber)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      aria-label={`Message ${phoneNumber} on WhatsApp`}
      className={`whitespace-nowrap text-slate-700 transition hover:text-brand-600 hover:underline ${className}`}
    >
      {phoneNumber}
    </a>
  );
};

export { WhatsAppLink, whatsAppUrl };
