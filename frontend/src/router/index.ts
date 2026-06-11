import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw, RouteMeta } from 'vue-router'
import { IconChartArea, IconHome2, IconPlugConnected } from '@tabler/icons-vue'
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
    name: 'overview',
    meta: {
      title: 'Overview',
      titleKey: 'nav.overview',
      icon: IconHome2,
      nav: 'main',
    } satisfies RouteMeta,
    component: () => import('@/pages/WelcomePage.vue'),
  },
  {
    path: '/data-ui',
    name: 'data-ui',
    meta: {
      title: 'Data UI',
      titleKey: 'nav.dataUi',
      icon: IconChartArea,
      nav: 'main',
    } satisfies RouteMeta,
    component: () => import('@/pages/DashboardPage.vue'),
  },
  {
    path: '/native-runtime',
    name: 'native-runtime',
    meta: {
      title: 'Native Runtime',
      titleKey: 'nav.nativeRuntime',
      icon: IconPlugConnected,
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
