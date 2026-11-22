import { defineStore } from 'pinia'

export interface ToastItem {
  id: string
  title: string
  message?: string
  type: 'info' | 'success' | 'error'
  duration?: number
  actionLabel?: string
  onAction?: () => void
}

export const useToastStore = defineStore('toast', {
  state: () => ({
    toasts: [] as ToastItem[],
  }),

  actions: {
    add(toast: Omit<ToastItem, 'id'>): string {
      const id = Math.random().toString(36).slice(2, 9)
      const item: ToastItem = { ...toast, id }
      this.toasts.push(item)

      const duration = toast.duration ?? (toast.onAction ? 6000 : 4000)
      if (duration > 0) {
        window.setTimeout(() => {
          this.remove(id)
        }, duration)
      }
      return id
    },

    success(title: string, message?: string) {
      return this.add({ title, message, type: 'success' })
    },

    error(title: string, message?: string) {
      return this.add({ title, message, type: 'error', duration: 5500 })
    },

    info(title: string, message?: string) {
      return this.add({ title, message, type: 'info' })
    },

    undo(title: string, message: string, onUndo: () => void) {
      return this.add({
        title,
        message,
        type: 'info',
        duration: 6000,
        actionLabel: 'Undo',
        onAction: onUndo,
      })
    },

    triggerAction(id: string) {
      const target = this.toasts.find((t) => t.id === id)
      if (target?.onAction) {
        target.onAction()
      }
      this.remove(id)
    },

    remove(id: string) {
      this.toasts = this.toasts.filter((t) => t.id !== id)
    },
  },
})
