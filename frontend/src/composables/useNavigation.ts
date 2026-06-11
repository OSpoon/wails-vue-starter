import { useRouter } from 'vue-router'
import { computed } from 'vue'
import type { Component } from 'vue'
import {
  IconBellRinging,
  IconBook,
  IconBrandGithub,
  IconComponents,
  IconFileCode,
} from '@tabler/icons-vue'
import { useI18n } from 'vue-i18n'

interface NavItem {
  title: string
  url: string
  icon?: Component
  external?: boolean
}

interface ResourceItem {
  name: string
  url: string
  icon?: Component
  external?: boolean
}

interface NavGroup {
  title: string
  icon: Component
  isActive?: boolean
  url: string
  items: { title: string; url: string }[]
}

interface User {
  name: string
  email: string
  avatar: string
}

export function useNavigation() {
  const router = useRouter()
  const { t } = useI18n()

  const navMain = computed(() =>
    router
      .getRoutes()
      .filter((r) => r.meta?.nav === 'main')
      .map((r) => ({
        title: r.meta?.titleKey ? t(r.meta.titleKey) : ((r.meta?.title as string) ?? ''),
        url: r.path,
        icon: r.meta?.icon as Component | undefined,
      })),
  )

  const resources = computed(
    () =>
      [
        {
          name: t('nav.wailsDocs'),
          url: 'https://v3.wails.io/',
          icon: IconBook,
          external: true,
        },
        {
          name: t('nav.runtimeDocs'),
          url: 'https://v3.wails.io/reference/frontend-runtime/',
          icon: IconFileCode,
          external: true,
        },
        {
          name: t('nav.componentDocs'),
          url: 'https://www.shadcn-vue.com/',
          icon: IconComponents,
          external: true,
        },
        {
          name: t('nav.sourceCode'),
          url: 'https://github.com/OSpoon/wails-vue-starter',
          icon: IconBrandGithub,
          external: true,
        },
      ] satisfies ResourceItem[],
  )

  return {
    user: {
      name: 'OSpoon',
      email: 'ospoon@example.com',
      avatar: '/avatars/shadcn.jpg',
    } satisfies User,
    navMain,
    navClouds: [
      {
        title: t('nav.inbox'),
        icon: IconBellRinging,
        isActive: true,
        url: '#',
        items: [
          { title: 'time', url: '#' },
          { title: 'app:ready', url: '#' },
          { title: 'notification:result', url: '#' },
        ],
      },
    ] satisfies NavGroup[],
    resources,
  }
}
