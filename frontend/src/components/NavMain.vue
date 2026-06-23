<script setup lang="ts">
import type { Component } from 'vue'
import { useRoute } from 'vue-router'

interface NavItem {
  title: string
  url: string
  icon?: Component
}

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

const route = useRoute()

defineProps<{
  items: NavItem[]
}>()
</script>

<template>
  <SidebarGroup>
    <SidebarGroupContent class="flex flex-col gap-1">
      <SidebarMenu>
        <SidebarMenuItem v-for="item in items" :key="item.title">
          <SidebarMenuButton :tooltip="item.title" as-child :is-active="route.path === item.url">
            <router-link :to="item.url" class="flex items-center gap-3">
              <component :is="item.icon" v-if="item.icon" class="size-4.5" />
              <span class="text-sm">{{ item.title }}</span>
            </router-link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroupContent>
  </SidebarGroup>
</template>
