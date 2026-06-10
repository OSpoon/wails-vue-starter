import { onBeforeUnmount, onMounted } from 'vue'
import { Events } from '@wailsio/runtime'

export interface WailsEventPayload<T = unknown> {
  name: string
  data: T
  sender?: string
}

export function useWailsEvent<T = unknown>(
  name: string,
  handler: (event: WailsEventPayload<T>) => void,
) {
  let off: (() => void) | undefined

  onMounted(() => {
    off = Events.On(name, handler as Parameters<typeof Events.On>[1])
  })

  onBeforeUnmount(() => {
    off?.()
    off = undefined
  })

  return () => {
    off?.()
    off = undefined
  }
}
