import { createI18n } from 'vue-i18n'
import { messages, type MessageSchema, type SupportedLocale } from './messages'

const fallbackLocale: SupportedLocale = 'en'
const supportedLocales = Object.keys(messages) as SupportedLocale[]
const localeStorageKey = 'wails-vue-starter:locale'

function isSupportedLocale(locale: string | null): locale is SupportedLocale {
  return supportedLocales.includes(locale as SupportedLocale)
}

function resolveInitialLocale(): SupportedLocale {
  const storedLocale = localStorage.getItem(localeStorageKey)
  if (isSupportedLocale(storedLocale)) {
    return storedLocale
  }

  const language = navigator.language.toLowerCase()

  if (language.startsWith('zh')) {
    return 'zh'
  }

  const locale = supportedLocales.find((candidate) => language.startsWith(candidate))
  return locale ?? fallbackLocale
}

export const i18n = createI18n<[MessageSchema], SupportedLocale>({
  legacy: false,
  globalInjection: true,
  locale: resolveInitialLocale(),
  fallbackLocale,
  messages,
})

export function setLocale(locale: SupportedLocale) {
  i18n.global.locale = locale
  localStorage.setItem(localeStorageKey, locale)
  document.documentElement.lang = locale
}

document.documentElement.lang = i18n.global.locale
