<script setup lang="ts">
import type { Component } from 'vue'
import { useRoute } from 'vue-router'
import { Browser } from '@wailsio/runtime'
import { useI18n } from 'vue-i18n'

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

interface Document {
  name: string
  url: string
  icon?: Component
  external?: boolean
}

defineProps<{
  items: Document[]
}>()

const route = useRoute()
const { t } = useI18n()
</script>

<template>
  <SidebarGroup class="group-data-[collapsible=icon]:hidden">
    <SidebarGroupLabel>{{ t('nav.resources') }}</SidebarGroupLabel>
    <SidebarMenu>
      <SidebarMenuItem v-for="item in items" :key="item.name">
        <SidebarMenuButton v-if="item.external" as-child>
          <a href="#" @click.prevent="Browser.OpenURL(item.url)">
            <component :is="item.icon" />
            <span>{{ item.name }}</span>
          </a>
        </SidebarMenuButton>
        <SidebarMenuButton v-else as-child :is-active="route.path === item.url">
          <router-link :to="item.url">
            <component :is="item.icon" />
            <span>{{ item.name }}</span>
          </router-link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  </SidebarGroup>
</template>
