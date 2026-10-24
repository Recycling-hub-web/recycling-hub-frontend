const PLATFORM_BASE_URLS: Record<string, string> = {
  facebook: 'https://facebook.com/',
  instagram: 'https://instagram.com/',
  linkedin: 'https://linkedin.com/in/',
  tiktok: 'https://tiktok.com/@',
};

/** Turns a platform + handle (or a pasted full URL) into a usable profile URL. */
const buildSocialMediaUrl = (
  platform: string,
  usernameOrUrl: string,
): string => {
  const value = usernameOrUrl.trim();
  if (!value) return '';
  if (/^https?:\/\//i.test(value)) return value;

  if (platform === 'website') return `https://${value}`;

  const base = PLATFORM_BASE_URLS[platform];
  return base ? `${base}${value.replace(/^@/, '')}` : value;
};

export { buildSocialMediaUrl };
