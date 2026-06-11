import { onMounted } from 'vue'
import { PreferenceService } from '../../bindings/github.com/OSpoon/wails-vue-starter'
import { isLocalePreference, setLocalePreference } from '@/i18n'

export function useLocalePreference() {
  onMounted(() => {
    PreferenceService.Get('locale')
      .then(([value, ok]) => {
        if (ok && isLocalePreference(value)) {
          setLocalePreference(value)
        }
      })
      .catch(console.error)
  })
}
