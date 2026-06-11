<script setup lang="ts">
import AppSidebar from '@/components/AppSidebar.vue'
import SiteHeader from '@/components/SiteHeader.vue'
import { useLocalePreference } from '@/composables/useLocalePreference'
import { usePersistedWindowState } from '@/composables/usePersistedWindowState'
import { useSystemTheme } from '@/composables/useSystemTheme'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { Toaster } from '@/components/ui/sonner'

useLocalePreference()
useSystemTheme()
usePersistedWindowState()
</script>

<template>
  <SidebarProvider
    class="min-h-svh"
    :style="{
      '--sidebar-width': 'calc(var(--spacing) * 72)',
      '--header-height': 'calc(var(--spacing) * 12)',
    }"
  >
    <AppSidebar variant="inset" />
    <SidebarInset>
      <SiteHeader />
      <div class="flex flex-1 flex-col">
        <router-view />
      </div>
    </SidebarInset>
    <Toaster rich-colors close-button />
  </SidebarProvider>
</template>
