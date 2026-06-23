<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Browser } from '@wailsio/runtime'
import { useI18n } from 'vue-i18n'

import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'

const route = useRoute()
const { t } = useI18n()

const pageTitle = computed(() => {
  if (route.meta?.titleKey) {
    return t(route.meta.titleKey)
  }

  return (
    route.meta?.title ??
    (() => {
      const name = route.name
      if (typeof name === 'string') {
        return name.charAt(0).toUpperCase() + name.slice(1)
      }
      return t('nav.home')
    })()
  )
})
</script>

<template>
  <header
    class="sticky top-0 z-30 flex h-(--app-header-height) shrink-0 cursor-default items-center gap-2 border-b border-border/60 bg-background/80 text-foreground select-none backdrop-blur-xl transition-colors"
  >
    <div class="flex min-w-0 w-full items-center gap-1 pr-4 pl-3 lg:gap-2 lg:pr-6">
      <SidebarTrigger class="size-7 text-muted-foreground hover:text-foreground" />
      <Separator
        orientation="vertical"
        class="mx-2 h-4 data-[orientation=vertical]:h-4 bg-border/60"
      />
      <h1 class="min-w-0 truncate cursor-default text-sm font-medium tracking-apple">
        {{ pageTitle }}
      </h1>
      <div class="ml-auto flex items-center gap-2">
        <button
          @click="Browser.OpenURL('https://github.com/OSpoon/wails-vue-starter')"
          class="inline-flex h-7 items-center justify-center gap-1.5 whitespace-nowrap rounded-md px-2.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground hidden sm:flex"
        >
          {{ t('nav.github') }}
        </button>
      </div>
    </div>
  </header>
</template>
