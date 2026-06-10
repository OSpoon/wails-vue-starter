<script setup lang="ts">
import AppSidebar from '@/components/AppSidebar.vue'
import SiteHeader from '@/components/SiteHeader.vue'
import { usePersistedWindowState } from '@/composables/usePersistedWindowState'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { Toaster } from '@/components/ui/sonner'

usePersistedWindowState()
</script>

<template>
  <SidebarProvider
    class="min-h-[calc(100svh-var(--wails-titlebar-height))]! pt-(--wails-titlebar-height)"
    :style="{
      '--sidebar-width': 'calc(var(--spacing) * 72)',
      '--header-height': 'calc(var(--spacing) * 12)',
    }"
  >
    <SiteHeader />
    <AppSidebar variant="inset" />
    <SidebarInset>
      <div class="flex flex-1 flex-col">
        <router-view />
      </div>
    </SidebarInset>
    <Toaster rich-colors close-button />
  </SidebarProvider>
</template>
