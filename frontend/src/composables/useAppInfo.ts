import { readonly, ref } from 'vue'
import { AppService } from '../../bindings/github.com/OSpoon/wails-vue-starter'
import type {
  AppInfo,
  RuntimeEnvironment,
} from '../../bindings/github.com/OSpoon/wails-vue-starter/models'

const appInfo = ref<AppInfo | null>(null)
const environment = ref<RuntimeEnvironment | null>(null)
const loading = ref(false)
const error = ref<unknown>(null)

export function useAppInfo() {
  async function refresh() {
    loading.value = true
    error.value = null

    try {
      const [info, env] = await Promise.all([AppService.Info(), AppService.Environment()])
      appInfo.value = info
      environment.value = env
    } catch (err) {
      error.value = err
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    appInfo: readonly(appInfo),
    environment: readonly(environment),
    loading: readonly(loading),
    error: readonly(error),
    refresh,
  }
}
