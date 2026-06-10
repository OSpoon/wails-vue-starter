<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useEventListener } from '@vueuse/core'
import { useRoute } from 'vue-router'
import { Browser, Events, Window } from '@wailsio/runtime'

import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'

const route = useRoute()

const pageTitle = computed(() => {
  return (
    route.meta?.title ??
    (() => {
      const name = route.name
      if (typeof name === 'string') {
        return name.charAt(0).toUpperCase() + name.slice(1)
      }
      return 'Home'
    })()
  )
})

const isWindowFocused = ref(true)
const isWindowFullscreen = ref(false)
let offFocus: (() => void) | undefined
let offLostFocus: (() => void) | undefined
let offFullscreen: (() => void) | undefined
let offUnFullscreen: (() => void) | undefined
let offWillEnterFullscreen: (() => void) | undefined
let offWillExitFullscreen: (() => void) | undefined

function setFocused() {
  isWindowFocused.value = true
}

function setUnfocused() {
  isWindowFocused.value = false
}

function setFullscreen() {
  isWindowFullscreen.value = true
}

function setUnFullscreen() {
  isWindowFullscreen.value = false
}

useEventListener(window, 'focus', setFocused)
useEventListener(window, 'blur', setUnfocused)

onMounted(() => {
  Window.IsFocused()
    .then((focused) => {
      isWindowFocused.value = focused
    })
    .catch(() => {
      isWindowFocused.value = document.hasFocus()
    })

  Window.IsFullscreen()
    .then((fullscreen) => {
      isWindowFullscreen.value = fullscreen
    })
    .catch(() => {
      isWindowFullscreen.value = false
    })

  offFocus = Events.On(Events.Types.Common.WindowFocus, setFocused)
  offLostFocus = Events.On(Events.Types.Common.WindowLostFocus, setUnfocused)
  offFullscreen = Events.On(Events.Types.Common.WindowFullscreen, setFullscreen)
  offUnFullscreen = Events.On(Events.Types.Common.WindowUnFullscreen, setUnFullscreen)
  offWillEnterFullscreen = Events.On(Events.Types.Mac.WindowWillEnterFullScreen, setFullscreen)
  offWillExitFullscreen = Events.On(Events.Types.Mac.WindowWillExitFullScreen, setUnFullscreen)
})

onBeforeUnmount(() => {
  offFocus?.()
  offLostFocus?.()
  offFullscreen?.()
  offUnFullscreen?.()
  offWillEnterFullscreen?.()
  offWillExitFullscreen?.()
})
</script>

<template>
  <header
    class="fixed inset-x-0 top-0 z-30 flex h-(--wails-titlebar-height) shrink-0 cursor-default items-center gap-2 border-b select-none backdrop-blur transition-colors [--wails-draggable:drag]"
    :class="isWindowFocused ? 'bg-background/95' : 'bg-[#f4f4f4]'"
  >
    <div
      :class="
        cn(
          'flex min-w-0 w-full items-center gap-1 pr-4 lg:gap-2 lg:pr-6',
          isWindowFullscreen ? 'pl-4' : 'pl-(--wails-titlebar-drag-width) translate-y-0.5',
        )
      "
    >
      <SidebarTrigger class="-ml-1 [--wails-draggable:no-drag]" />
      <Separator orientation="vertical" class="mx-2 data-[orientation=vertical]:h-4" />
      <h1 class="min-w-0 truncate cursor-default text-base font-medium">{{ pageTitle }}</h1>
      <div class="ml-auto flex items-center gap-2 [--wails-draggable:no-drag]">
        <button
          @click="Browser.OpenURL('https://github.com/OSpoon/wails-vue-starter')"
          class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md px-3 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground h-8 hidden sm:flex dark:text-foreground [--wails-draggable:no-drag]"
        >
          GitHub
        </button>
      </div>
    </div>
  </header>
</template>
