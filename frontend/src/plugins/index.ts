import type { App } from 'vue'
import { createPinia } from 'pinia'
import router from '../router'
import { vuetifyTheme, vuetifyStack } from './vuetify'

const pinia = createPinia()

export function registerPlugins(app: App) {
  app.use(pinia)
  app.use(vuetifyTheme)
  app.use(vuetifyStack)
  app.use(router)
}
