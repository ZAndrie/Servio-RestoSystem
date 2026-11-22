import { createApp } from 'vue'

// Self-hosted warm hospitality fonts (zero CDN — all verified native U+20B1 Peso glyph)
import '@fontsource/merriweather/400.css'
import '@fontsource/merriweather/700.css'
import '@fontsource/nunito/400.css'
import '@fontsource/nunito/500.css'
import '@fontsource/nunito/600.css'
import '@fontsource/nunito/700.css'
import '@fontsource/geist-mono/400.css'
import '@fontsource/geist-mono/500.css'
import '@fontsource/geist-mono/600.css'

import { registerPlugins } from '@/plugins'
import App from './App.vue'
import './tailwind.css'

const app = createApp(App)

registerPlugins(app)

app.mount('#app')
