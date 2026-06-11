import { useRouter } from 'vue-router'
import type { Component } from 'vue'
import { IconCamera, IconDatabase, IconSettings } from '@tabler/icons-vue'
import { useI18n } from 'vue-i18n'

interface NavItem {
  title: string
  url: string
  icon?: Component
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

  const navMain = router
    .getRoutes()
    .filter((r) => r.meta?.nav === 'main')
    .map((r) => ({
      title: r.meta?.titleKey ? t(r.meta.titleKey) : ((r.meta?.title as string) ?? ''),
      url: r.path,
      icon: r.meta?.icon as Component | undefined,
    }))

  return {
    user: {
      name: 'OSpoon',
      email: 'ospoon@example.com',
      avatar: '/avatars/shadcn.jpg',
    } satisfies User,
    navMain,
    navClouds: [
      {
        title: 'Capture',
        icon: IconCamera,
        isActive: true,
        url: '#',
        items: [
          { title: 'Active Proposals', url: '#' },
          { title: 'Archived', url: '#' },
        ],
      },
    ] satisfies NavGroup[],
    navSecondary: [{ title: t('nav.settings'), url: '#', icon: IconSettings }] satisfies NavItem[],
    documents: [{ name: t('nav.dataLibrary'), url: '#', icon: IconDatabase }],
  }
}
