import { onMounted, onUnmounted } from 'vue'

/**
 * Lightweight IntersectionObserver scroll-reveal hook for .site-reveal elements.
 * Automatically respects prefers-reduced-motion and cleans up on unmount.
 */
export function useScrollReveal() {
  let observer: IntersectionObserver | null = null

  onMounted(() => {
    if (typeof window === 'undefined') return
    const nodes = Array.from(document.querySelectorAll<HTMLElement>('.site-reveal'))
    if (nodes.length === 0) return

    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduced || typeof IntersectionObserver === 'undefined') {
      nodes.forEach((el) => el.classList.add('is-visible'))
      return
    }

    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer?.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -30px 0px' },
    )

    nodes.forEach((el) => observer?.observe(el))
  })

  onUnmounted(() => {
    observer?.disconnect()
    observer = null
  })
}
