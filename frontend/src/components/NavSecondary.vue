<script setup lang="ts">
import type { Component } from 'vue'
import { useRoute } from 'vue-router'

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

defineProps<{
  items: NavItem[]
}>()
</script>

<template>
  <SidebarGroup>
    <SidebarGroupContent>
      <SidebarMenu>
        <SidebarMenuItem v-for="item in items" :key="item.title">
          <SidebarMenuButton
            as-child
            :is-active="route.path === item.url"
            class="text-sm tracking-apple"
          >
            <router-link :to="item.url">
              <component :is="item.icon" v-if="item.icon" class="size-4" />
              {{ item.title }}
            </router-link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroupContent>
  </SidebarGroup>
</template>
