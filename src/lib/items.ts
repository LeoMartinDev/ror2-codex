import data from '#/data/items.json'
import { itemSlug } from './slug'
import type { Item } from './types'

export { itemSlug }

export const ITEMS = data as Item[]
export const BY_ID = new Map(ITEMS.map((it) => [it.id, it]))
export const BY_WIKI_NAME = new Map(ITEMS.map((it) => [it.wikiName, it]))
export const BY_SLUG = new Map(ITEMS.map((it) => [itemSlug(it), it]))

/** Absolute link to an item page, without the current filters. */
export const itemUrl = (it: Item) => `${window.location.origin}/items/${itemSlug(it)}`
