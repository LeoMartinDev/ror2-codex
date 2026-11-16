/**
 * URL slug of an item, from its English name: "Hiker's Boots" → "hikers-boots".
 * No imports so vite.config.ts can use it to list the pages to prerender.
 */
export function itemSlug(item: { name: { en: string } }): string {
  return item.name.en
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}
