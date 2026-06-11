<script setup lang="ts">
import type { Component } from 'vue'
import { useRoute } from 'vue-router'
import { IconCirclePlusFilled, IconMail } from '@tabler/icons-vue'
import { useI18n } from 'vue-i18n'

import { Button } from '@/components/ui/button'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

interface NavItem {
  title: string
  url: string
  icon?: Component
}

const route = useRoute()
const { t } = useI18n()

defineProps<{
  items: NavItem[]
}>()
</script>

<template>
  <SidebarGroup>
    <SidebarGroupContent class="flex flex-col gap-2">
      <SidebarMenu>
        <SidebarMenuItem class="flex min-w-0 items-center gap-2">
          <SidebarMenuButton
            :tooltip="t('nav.quickCreate')"
            class="bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 hover:text-sidebar-primary-foreground active:bg-sidebar-primary/90 active:text-sidebar-primary-foreground min-w-0 flex-1 duration-200 ease-linear"
          >
            <IconCirclePlusFilled />
            <span>{{ t('nav.quickCreate') }}</span>
          </SidebarMenuButton>
          <Button
            size="icon"
            class="size-8 shrink-0 group-data-[collapsible=icon]:opacity-0"
            variant="outline"
          >
            <IconMail />
            <span class="sr-only">{{ t('nav.inbox') }}</span>
          </Button>
        </SidebarMenuItem>
      </SidebarMenu>
      <SidebarMenu>
        <SidebarMenuItem v-for="item in items" :key="item.title">
          <SidebarMenuButton :tooltip="item.title" as-child :is-active="route.path === item.url">
            <router-link :to="item.url">
              <component :is="item.icon" v-if="item.icon" />
              <span>{{ item.title }}</span>
            </router-link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroupContent>
  </SidebarGroup>
</template>
