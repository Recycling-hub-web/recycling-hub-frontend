// Mirrors apps.categories.models.Category (CategoryListSerializer /
// CategoryDetailSerializer) on the backend, scoped to this feature's one
// concern: the `materials` module. `module` itself is deliberately not
// part of this type — every request this feature makes hardcodes it (see
// services/categoryService.ts), no component ever reads or writes it.
// `name_ar`/`description_ar` are auto-translated and read-only on the
// backend (model fields are `editable=False`, which DRF's ModelSerializer
// turns into a read-only serializer field automatically) — kept here only
// for display, never sent back on create/update. `slug`/`hex_color`/
// `text_color` are backend-generated too; the form never touches them.
type CategoryListItem = {
  id: string;
  name: string;
  name_ar: string;
  slug: string;
  description: string;
  description_ar: string;
  parent: string | null;
  hex_color: string;
  text_color: string;
  is_active: boolean;
};

// Detail adds nested children — only present on the retrieve endpoint.
type Category = CategoryListItem & {
  children: CategoryListItem[];
};

export type { Category, CategoryListItem };
