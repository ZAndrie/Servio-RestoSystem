import { ref } from 'vue'

const now = ref(Date.now())
let timer: number | null = null
let listenerCount = 0

export function useTicker() {
  const start = () => {
    listenerCount++
    if (listenerCount === 1 && typeof window !== 'undefined') {
      timer = window.setInterval(() => {
        now.value = Date.now()
      }, 1000)
    }
  }

  const stop = () => {
    listenerCount = Math.max(0, listenerCount - 1)
    if (listenerCount === 0 && timer !== null) {
      clearInterval(timer)
      timer = null
    }
  }

  return {
    now,
    start,
    stop,
  }
}
