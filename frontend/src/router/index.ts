import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw, RouteMeta } from 'vue-router'
import { IconDashboard, IconHome2, IconStack2 } from '@tabler/icons-vue'
import type { Component } from 'vue'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    titleKey?: string
    icon?: Component
    nav?: string
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'welcome',
    meta: {
      title: 'Welcome',
      titleKey: 'nav.welcome',
      icon: IconHome2,
      nav: 'main',
    } satisfies RouteMeta,
    component: () => import('@/pages/WelcomePage.vue'),
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    meta: {
      title: 'Dashboard',
      titleKey: 'nav.dashboard',
      icon: IconDashboard,
      nav: 'main',
    } satisfies RouteMeta,
    component: () => import('@/pages/DashboardPage.vue'),
  },
  {
    path: '/foundation',
    name: 'foundation',
    meta: {
      title: 'Foundation',
      titleKey: 'nav.foundation',
      icon: IconStack2,
      nav: 'main',
    } satisfies RouteMeta,
    component: () => import('@/pages/FoundationPage.vue'),
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
