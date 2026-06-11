<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { IconDotsVertical, IconLanguage, IconLogout } from '@tabler/icons-vue'
import { useI18n } from 'vue-i18n'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import {
  getLocalePreference,
  isLocalePreference,
  setLocalePreference,
  type LocalePreference,
} from '@/i18n'
import { PreferenceService } from '../../bindings/github.com/OSpoon/wails-vue-starter'

interface User {
  name: string
  email: string
  avatar: string
}

defineProps<{
  user: User
}>()

const { isMobile } = useSidebar()
const { t } = useI18n()
const localePreference = ref<LocalePreference>(getLocalePreference())

function updateLocalePreference(value: unknown) {
  if (!isLocalePreference(value)) {
    return
  }

  localePreference.value = value
  setLocalePreference(value)
  PreferenceService.Set('locale', value).catch(console.error)
}

onMounted(() => {
  PreferenceService.Get('locale')
    .then(([value, ok]) => {
      if (ok && isLocalePreference(value)) {
        localePreference.value = value
        setLocalePreference(value)
      }
    })
    .catch(console.error)
})
</script>

<template>
  <SidebarMenu>
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <SidebarMenuButton
            size="lg"
            class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <Avatar class="size-8 shrink-0 rounded-lg grayscale">
              <AvatarImage :src="user.avatar" :alt="user.name" />
              <AvatarFallback class="rounded-lg"> CN </AvatarFallback>
            </Avatar>
            <div class="grid min-w-0 flex-1 text-left text-sm leading-tight">
              <span class="truncate font-medium">{{ user.name }}</span>
              <span class="text-muted-foreground truncate text-xs">
                {{ user.email }}
              </span>
            </div>
            <IconDotsVertical class="ml-auto size-4" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          class="w-(--reka-dropdown-menu-trigger-width) min-w-56 rounded-lg"
          :side="isMobile ? 'bottom' : 'right'"
          :side-offset="4"
          align="end"
        >
          <DropdownMenuLabel class="p-0 font-normal">
            <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <Avatar class="size-8 shrink-0 rounded-lg">
                <AvatarImage :src="user.avatar" :alt="user.name" />
                <AvatarFallback class="rounded-lg"> CN </AvatarFallback>
              </Avatar>
              <div class="grid min-w-0 flex-1 text-left text-sm leading-tight">
                <span class="truncate font-medium">{{ user.name }}</span>
                <span class="text-muted-foreground truncate text-xs">
                  {{ user.email }}
                </span>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuLabel class="flex items-center gap-2">
            <IconLanguage />
            {{ t('locale.label') }}
          </DropdownMenuLabel>
          <DropdownMenuRadioGroup
            :model-value="localePreference"
            @update:model-value="updateLocalePreference"
          >
            <DropdownMenuRadioItem value="system">
              {{ t('locale.system') }}
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="en">
              {{ t('locale.en') }}
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="zh">
              {{ t('locale.zh') }}
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <IconLogout />
            {{ t('nav.logout') }}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  </SidebarMenu>
</template>
