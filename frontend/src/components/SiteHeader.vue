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
    class="sticky top-0 z-30 flex h-(--app-header-height) shrink-0 cursor-default items-center gap-2 border-b bg-background/95 text-foreground select-none backdrop-blur transition-colors"
  >
    <div class="flex min-w-0 w-full items-center gap-1 pr-4 pl-4 lg:gap-2 lg:pr-6">
      <SidebarTrigger class="-ml-1" />
      <Separator orientation="vertical" class="mx-2 data-[orientation=vertical]:h-4" />
      <h1 class="min-w-0 truncate cursor-default text-base font-medium">{{ pageTitle }}</h1>
      <div class="ml-auto flex items-center gap-2">
        <button
          @click="Browser.OpenURL('https://github.com/OSpoon/wails-vue-starter')"
          class="inline-flex h-8 items-center justify-center gap-2 whitespace-nowrap rounded-md px-3 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground hidden sm:flex dark:text-foreground"
        >
          {{ t('nav.github') }}
        </button>
      </div>
    </div>
  </header>
</template>
