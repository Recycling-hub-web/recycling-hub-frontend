import type { IconType } from 'react-icons';

/** A link nested under a top-level menu item (no icon of its own). */
type NavSubItem = {
  href: string;
  label: string;
  /** Only for a group built from whole pages (see NavItem.isGroup) — lets
   * quick links show each page with its own icon. */
  icon?: IconType;
};

type NavItem = {
  /** The item's main page. With `children`, this is still where quick
   * links (OverviewQuickLinks) point, while the sidebar renders the item
   * as an expandable group instead of a link. */
  href: string;
  label: string;
  icon: IconType;
  children?: NavSubItem[];
  /** Sidebar section heading this item sits under (e.g. "Operations").
   * Items without one render under a single "Menu" heading. */
  section?: string;
  /** True when `children` are separate pages grouped under one menu
   * entry (e.g. "Pickups" → Pickup Requests + Orders) rather than
   * sub-pages of one module — quick links then list each page. */
  isGroup?: boolean;
};

/** The href to highlight for `pathname`, across top-level items and their
 * sub-links. Exact match alone isn't enough — a details/edit page (e.g.
 * /admin/contact/[id]) must still light up its section — so every href
 * that prefixes the path is a candidate and the longest one wins;
 * otherwise "Overview" (/admin) and "Contact" (/admin/contact) would both
 * match /admin/contact/[id]. */
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
