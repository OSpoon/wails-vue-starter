import { readonly, ref } from 'vue'
import { PreferenceService } from '../../bindings/github.com/OSpoon/wails-vue-starter'
import type { PreferencesSnapshot } from '../../bindings/github.com/OSpoon/wails-vue-starter/models'

const preferences = ref<PreferencesSnapshot | null>(null)
const loading = ref(false)
const error = ref<unknown>(null)

export function usePreferences() {
  async function refresh() {
    loading.value = true
    error.value = null

    try {
      preferences.value = await PreferenceService.All()
      return preferences.value
    } catch (err) {
      error.value = err
      throw err
    } finally {
      loading.value = false
    }
  }

  async function setPreference(key: string, value: unknown) {
    await PreferenceService.Set(key, value)
    return refresh()
  }

  async function deletePreference(key: string) {
    await PreferenceService.Delete(key)
    return refresh()
  }

  async function resetPreferences() {
    await PreferenceService.Reset()
    return refresh()
  }

  return {
    preferences: readonly(preferences),
    loading: readonly(loading),
    error: readonly(error),
    refresh,
    setPreference,
    deletePreference,
    resetPreferences,
  }
}
