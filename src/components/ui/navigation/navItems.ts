import type { IconType } from 'react-icons';

/** A link nested under a top-level menu item (no icon of its own). */
type NavSubItem = {
  href: string;
  label: string;
};

type NavItem = {
  /** The item's main page. With `children`, this is still where quick
   * links (OverviewQuickLinks) point, while the sidebar renders the item
   * as an expandable group instead of a link. */
  href: string;
  label: string;
  icon: IconType;
  children?: NavSubItem[];
};

/** The href to highlight for `pathname`, across top-level items and their
 * sub-links. Exact match alone isn't enough — a details/edit page (e.g.
 * /admin/contact/[id]) must still light up its section — so every href
 * that prefixes the path is a candidate and the longest one wins;
 * otherwise "Overview" (/admin) and "Contact" (/admin/contact) would both
 * match /admin/contact/[id], and "All Posts" (/admin/blogs) and "Tags"
 * (/admin/blogs/tags) would both match /admin/blogs/tags. */
const getActiveHref = (
  items: NavItem[],
  pathname: string | null,
): string | undefined =>
  items
    .flatMap((item) => [item.href, ...(item.children ?? []).map((c) => c.href)])
    .filter((href) => pathname === href || pathname?.startsWith(`${href}/`))
    .sort((a, b) => b.length - a.length)[0];

export { getActiveHref };
export type { NavItem, NavSubItem };
