import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { App } from './app'
import './app/styles'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.mount('#app')
