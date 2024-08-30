import { createI18n } from 'vue-i18n'

import type {
    I18n,
    I18nOptions,
} from 'vue-i18n'

export function setupI18n(options: I18nOptions = { locale: 'en' }): I18n {
    const i18n = createI18n(options)
    return i18n
}