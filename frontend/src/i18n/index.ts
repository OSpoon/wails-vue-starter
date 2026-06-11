import { createI18n } from 'vue-i18n'
import { messages, type MessageSchema, type SupportedLocale } from './messages'

const fallbackLocale: SupportedLocale = 'en'
export const supportedLocales = Object.keys(messages) as SupportedLocale[]
const localeStorageKey = 'wails-vue-starter:locale'

export type LocalePreference = SupportedLocale | 'system'

export function isSupportedLocale(locale: string | null): locale is SupportedLocale {
  return supportedLocales.includes(locale as SupportedLocale)
}

function resolveBrowserLocale(): SupportedLocale {
  const language = navigator.language.toLowerCase()

  if (language.startsWith('zh')) {
    return 'zh'
  }

  const locale = supportedLocales.find((candidate) => language.startsWith(candidate))
  return locale ?? fallbackLocale
}

export function isLocalePreference(value: unknown): value is LocalePreference {
  return value === 'system' || (typeof value === 'string' && isSupportedLocale(value))
}

export function getLocalePreference(): LocalePreference {
  const storedLocale = localStorage.getItem(localeStorageKey)
  return isLocalePreference(storedLocale) ? storedLocale : 'system'
}

function resolveLocalePreference(preference: LocalePreference): SupportedLocale {
  return preference === 'system' ? resolveBrowserLocale() : preference
}

function resolveInitialLocale(): SupportedLocale {
  return resolveLocalePreference(getLocalePreference())
}

export const i18n = createI18n<[MessageSchema], SupportedLocale>({
  legacy: false,
  globalInjection: true,
  locale: resolveInitialLocale(),
  fallbackLocale,
  messages,
})

function applyLocale(locale: SupportedLocale) {
  const globalScope = i18n.global as unknown as {
    locale: SupportedLocale | { value: SupportedLocale }
  }

  if (
    typeof globalScope.locale === 'object' &&
    globalScope.locale &&
    'value' in globalScope.locale
  ) {
    globalScope.locale.value = locale
  } else {
    globalScope.locale = locale
  }

  document.documentElement.lang = locale
}

export function setLocale(locale: SupportedLocale) {
  applyLocale(locale)
  localStorage.setItem(localeStorageKey, locale)
}

export function setLocalePreference(preference: LocalePreference) {
  const locale = resolveLocalePreference(preference)
  applyLocale(locale)
  localStorage.setItem(localeStorageKey, preference)
}

document.documentElement.lang =
  typeof (i18n.global as unknown as { locale: unknown }).locale === 'string'
    ? (i18n.global as unknown as { locale: SupportedLocale }).locale
    : resolveInitialLocale()
