type DialCode = { code: string; label: string };

// Malaysia first — this is a Malaysian platform (see src/constants/content.ts
// BRAND.phone). The rest cover neighbouring/common countries; extend as needed.
const DIAL_CODES: DialCode[] = [
  { code: '+60', label: '+60 (MY)' },
  { code: '+65', label: '+65 (SG)' },
  { code: '+62', label: '+62 (ID)' },
  { code: '+66', label: '+66 (TH)' },
  { code: '+63', label: '+63 (PH)' },
  { code: '+84', label: '+84 (VN)' },
  { code: '+86', label: '+86 (CN)' },
  { code: '+91', label: '+91 (IN)' },
  { code: '+44', label: '+44 (UK)' },
  { code: '+1', label: '+1 (US/CA)' },
];

export { DIAL_CODES };
export type { DialCode };
