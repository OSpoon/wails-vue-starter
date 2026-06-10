import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw, RouteMeta } from 'vue-router'
import { IconDashboard, IconHome2 } from '@tabler/icons-vue'
import type { Component } from 'vue'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    icon?: Component
    nav?: string
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'welcome',
    meta: { title: 'Welcome', icon: IconHome2, nav: 'main' } satisfies RouteMeta,
    component: () => import('@/pages/WelcomePage.vue'),
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    meta: { title: 'Dashboard', icon: IconDashboard, nav: 'main' } satisfies RouteMeta,
    component: () => import('@/pages/DashboardPage.vue'),
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
