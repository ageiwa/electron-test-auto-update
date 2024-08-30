import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { WagmiPlugin } from '@wagmi/vue'
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
// @ts-ignore
import VueAwesomePaginate from 'vue-awesome-paginate'
import 'vue-awesome-paginate/dist/style.css'
import { clientConfig } from '@/shared/utils/clientConfig'
import App from './App.vue'
import router from './router'
import { setupI18n } from './i18n'
import './style.scss'

const pinia = createPinia()
const queryClient = new QueryClient()

const i18n = setupI18n({
    legacy: false,
    locale: 'en',
    fallbackLocale: 'en'
})

const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(i18n)
app.use(WagmiPlugin, { config: clientConfig })
app.use(VueQueryPlugin, { queryClient })
app.use(VueAwesomePaginate)
app.mount('#app')