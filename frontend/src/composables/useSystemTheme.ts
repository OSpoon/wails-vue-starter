import { onBeforeUnmount, onMounted } from 'vue'
import { Events, System } from '@wailsio/runtime'

const darkModeQuery = '(prefers-color-scheme: dark)'
const themeEvents = [
  Events.Types.Common.ThemeChanged,
  Events.Types.Mac.ApplicationDidChangeEffectiveAppearance,
  Events.Types.Mac.ApplicationDidChangeTheme,
  Events.Types.Mac.WindowDidChangeEffectiveAppearance,
  Events.Types.Windows.SystemThemeChanged,
  Events.Types.Linux.SystemThemeChanged,
]

function applyTheme(isDark: boolean) {
  document.documentElement.classList.toggle('dark', isDark)
  document.documentElement.style.colorScheme = isDark ? 'dark' : 'light'
}

async function syncSystemTheme(mediaQuery: MediaQueryList) {
  try {
    applyTheme(await System.IsDarkMode())
  } catch {
    applyTheme(mediaQuery.matches)
  }
}

export function useSystemTheme() {
  let mediaQuery: MediaQueryList | undefined
  let syncTheme: (() => void) | undefined
  let offThemeEvents: Array<() => void> = []

  onMounted(() => {
    mediaQuery = window.matchMedia(darkModeQuery)
    syncTheme = () => {
      if (mediaQuery) {
        syncSystemTheme(mediaQuery).catch(() => {})
      }
    }

    syncTheme()
    mediaQuery.addEventListener('change', syncTheme)
    offThemeEvents = themeEvents.map((eventName) => Events.On(eventName, syncTheme as () => void))
  })

  onBeforeUnmount(() => {
    if (syncTheme) {
      mediaQuery?.removeEventListener('change', syncTheme)
    }
    offThemeEvents.forEach((off) => off())
    syncTheme = undefined
    offThemeEvents = []
  })
}
