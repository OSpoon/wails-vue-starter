import { ref } from 'vue'
import { toast } from 'vue-sonner'

export interface AppErrorPayload {
  code: string
  message: string
  details?: unknown
}

export function normalizeError(error: unknown): AppErrorPayload {
  if (typeof error === 'object' && error !== null) {
    const cause = 'cause' in error ? (error as { cause?: unknown }).cause : undefined
    if (isAppErrorPayload(cause)) {
      return cause
    }

    if ('message' in error && typeof (error as { message?: unknown }).message === 'string') {
      return {
        code: 'APP_ERROR',
        message: (error as { message: string }).message,
        details: cause,
      }
    }
  }

  return {
    code: 'APP_ERROR',
    message: String(error),
  }
}

export function useAsyncAction() {
  const pending = ref(false)
  const error = ref<AppErrorPayload | null>(null)

  async function run<T>(action: () => Promise<T>, options: { toastError?: boolean } = {}) {
    pending.value = true
    error.value = null

    try {
      return await action()
    } catch (err) {
      const normalized = normalizeError(err)
      error.value = normalized
      if (options.toastError ?? true) {
        toast.error(normalized.message)
      }
      throw err
    } finally {
      pending.value = false
    }
  }

  return {
    pending,
    error,
    run,
  }
}

function isAppErrorPayload(value: unknown): value is AppErrorPayload {
  return (
    typeof value === 'object' &&
    value !== null &&
    'code' in value &&
    'message' in value &&
    typeof (value as AppErrorPayload).code === 'string' &&
    typeof (value as AppErrorPayload).message === 'string'
  )
}
