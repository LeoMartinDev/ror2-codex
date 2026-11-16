import { useCallback, useEffect, useState } from 'react'

/**
 * Share a link: the system share sheet on touch devices, the clipboard elsewhere.
 * `copied` stays true for a moment after a copy so the button can say so.
 */
export function useShareLink() {
  const [copied, setCopied] = useState(false)
  useEffect(() => {
    if (!copied) return
    const id = setTimeout(() => setCopied(false), 1800)
    return () => clearTimeout(id)
  }, [copied])

  const share = useCallback(async (url: string, title?: string) => {
    if (navigator.share && window.matchMedia('(pointer: coarse)').matches) {
      try {
        await navigator.share({ url, title })
        return
      } catch (e) {
        if ((e as Error).name === 'AbortError') return // the user closed the sheet
      }
    }
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
    } catch {
      if (copyWithSelection(url)) setCopied(true) // no async clipboard (http, unfocused page)
    }
  }, [])

  return { share, copied }
}

/** Old-style copy through a hidden text field, for when navigator.clipboard is unavailable. */
function copyWithSelection(text: string): boolean {
  const el = document.createElement('textarea')
  el.value = text
  el.setAttribute('readonly', '')
  el.style.cssText = 'position:fixed;opacity:0;pointer-events:none'
  document.body.appendChild(el)
  el.select()
  try {
    return document.execCommand('copy')
  } catch {
    return false
  } finally {
    el.remove()
  }
}
