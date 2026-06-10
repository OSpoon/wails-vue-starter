import { onBeforeUnmount, onMounted } from 'vue'
import { Events } from '@wailsio/runtime'
import { PreferenceService } from '../../bindings/github.com/OSpoon/wails-vue-starter'
import { nativeWindow } from '@/lib/native'

interface WindowState {
  width: number
  height: number
  x: number
  y: number
  maximised: boolean
}

const preferenceKey = 'window.main'
const minWidth = 400
const minHeight = 300
let installed = false

export function usePersistedWindowState() {
  if (installed) {
    return
  }
  installed = true

  let saveTimer: ReturnType<typeof window.setTimeout> | undefined
  const offCallbacks: Array<() => void> = []

  async function restore() {
    const [value, ok] = await PreferenceService.Get(preferenceKey)
    if (!ok || !isWindowState(value)) {
      return
    }

    if (value.width >= minWidth && value.height >= minHeight) {
      await nativeWindow.SetSize(value.width, value.height)
    }
    await nativeWindow.SetPosition(value.x, value.y)
    if (value.maximised) {
      await nativeWindow.Maximise()
    }
  }

  async function save() {
    const [size, position, maximised] = await Promise.all([
      nativeWindow.Size(),
      nativeWindow.Position(),
      nativeWindow.IsMaximised(),
    ])

    const state: WindowState = {
      width: size.width,
      height: size.height,
      x: position.x,
      y: position.y,
      maximised,
    }

    await PreferenceService.Set(preferenceKey, state)
  }

  function scheduleSave() {
    if (saveTimer !== undefined) {
      window.clearTimeout(saveTimer)
    }
    saveTimer = window.setTimeout(() => {
      save().catch(console.error)
    }, 250)
  }

  onMounted(() => {
    restore().catch(console.error)

    offCallbacks.push(
      Events.On(Events.Types.Common.WindowDidResize, scheduleSave),
      Events.On(Events.Types.Common.WindowDidMove, scheduleSave),
      Events.On(Events.Types.Common.WindowMaximise, scheduleSave),
      Events.On(Events.Types.Common.WindowUnMaximise, scheduleSave),
      Events.On(Events.Types.Common.WindowRestore, scheduleSave),
    )
  })

  onBeforeUnmount(() => {
    if (saveTimer !== undefined) {
      window.clearTimeout(saveTimer)
    }
    save().catch(console.error)
    while (offCallbacks.length > 0) {
      offCallbacks.pop()?.()
    }
    installed = false
  })
}

function isWindowState(value: unknown): value is WindowState {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const state = value as Partial<WindowState>
  return (
    typeof state.width === 'number' &&
    typeof state.height === 'number' &&
    typeof state.x === 'number' &&
    typeof state.y === 'number' &&
    typeof state.maximised === 'boolean'
  )
}
