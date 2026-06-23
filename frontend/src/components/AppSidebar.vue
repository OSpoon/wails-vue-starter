<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import NavDocuments from '@/components/NavDocuments.vue'
import NavMain from '@/components/NavMain.vue'
import NavUser from '@/components/NavUser.vue'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { useNavigation } from '@/composables/useNavigation'

const data = useNavigation()
const { t } = useI18n()
</script>

<template>
  <Sidebar collapsible="offcanvas" class="border-r border-sidebar-border">
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton as-child class="min-w-0 data-[slot=sidebar-menu-button]:!p-1.5">
            <a href="#" class="min-w-0 flex items-center gap-2">
              <span
                class="flex size-7 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground text-xs font-bold tracking-tight"
                >W</span
              >
              <span class="truncate text-sm font-semibold tracking-apple">{{ t('app.name') }}</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
    <SidebarContent>
      <NavMain :items="data.navMain.value" />
      <NavDocuments :items="data.resources.value" />
    </SidebarContent>
    <SidebarFooter>
      <NavUser :user="data.user" />
    </SidebarFooter>
  </Sidebar>
</template>
