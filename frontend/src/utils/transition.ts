import { nextTick } from 'vue'

/**
 * Term 20: Shared Element Transition helper using the View Transitions API.
 * Feature-detects support, respects prefers-reduced-motion, and falls back to
 * an immediate update cleanly.
 */
export function executeViewTransition(callback: () => void | Promise<void>) {
  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

  const doc = typeof document !== 'undefined'
    ? (document as Document & {
        startViewTransition?: (cb: () => void | Promise<void>) => { finished: Promise<void> }
      })
    : null

  if (doc?.startViewTransition && !prefersReduced) {
    try {
      return doc.startViewTransition(async () => {
        await callback()
        await nextTick()
      })
    } catch {
      return callback()
    }
  }

  return callback()
}
