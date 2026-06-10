<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { toast } from 'vue-sonner'
import {
  IconAlertTriangle,
  IconBell,
  IconBrandGithub,
  IconClipboard,
  IconRefresh,
  IconSend,
  IconWindow,
} from '@tabler/icons-vue'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldTitle,
} from '@/components/ui/field'
import { useAppInfo } from '@/composables/useAppInfo'
import { normalizeError, useAsyncAction } from '@/composables/useAsyncAction'
import { usePreferences } from '@/composables/usePreferences'
import { useWailsEvent } from '@/composables/useWailsEvent'
import { nativeClipboard, nativeDialog, nativeWindow } from '@/lib/native'
import { AppService, PreferenceService } from '../../bindings/github.com/OSpoon/wails-vue-starter'

interface WindowSnapshot {
  width: number
  height: number
  x: number
  y: number
  maximised: boolean
}

interface NotificationInteraction {
  id: string
  actionIdentifier: string
  categoryId: string
  title: string
  subtitle: string
  body: string
  userText: string
  userInfo: Record<string, unknown>
  error?: string
}

interface NotificationAuthorization {
  allowed: boolean
  platform: string
  message: string
}

const { appInfo, environment, refresh: refreshAppInfo } = useAppInfo()
const {
  preferences,
  refresh: refreshPreferences,
  setPreference,
  resetPreferences,
} = usePreferences()
const action = useAsyncAction()
const clipboardText = ref('Wails Vue Starter')
const clipboardReadback = ref('')
const eventLog = ref<string[]>([])
const windowSnapshot = ref<WindowSnapshot | null>(null)
const notificationAuthorization = ref<NotificationAuthorization | null>(null)
const notificationTitle = ref('Wails Vue Starter')
const notificationSubtitle = ref('Foundation check')
const notificationBody = ref('System notifications are wired through the Wails runtime.')
const notificationResult = ref<NotificationInteraction | null>(null)

const preferenceValues = computed(() => preferences.value?.values ?? {})
const themePreference = computed({
  get: () => String(preferenceValues.value.theme ?? 'system'),
  set: (value: string) => {
    setPreference('theme', value).catch(console.error)
  },
})
const sidebarPreference = computed({
  get: () => Boolean(preferenceValues.value.sidebar ?? true),
  set: (value: boolean) => {
    setPreference('sidebar', value).catch(console.error)
  },
})
const windowPreference = computed(() => preferenceValues.value['window.main'])

useWailsEvent<string>('time', (event) => {
  eventLog.value = [`time ${event.data}`, ...eventLog.value].slice(0, 5)
})

useWailsEvent('app:ready', () => {
  eventLog.value = ['app:ready', ...eventLog.value].slice(0, 5)
})

useWailsEvent<NotificationInteraction>('notification:result', (event) => {
  notificationResult.value = event.data
  eventLog.value = [
    `notification ${event.data.actionIdentifier || 'result'}`,
    ...eventLog.value,
  ].slice(0, 5)
})

async function refreshAll() {
  await Promise.all([
    refreshAppInfo(),
    refreshPreferences(),
    refreshWindowSnapshot(),
    refreshNotificationAuthorization(),
  ])
}

async function refreshWindowSnapshot() {
  const [size, position, maximised] = await Promise.all([
    nativeWindow.Size(),
    nativeWindow.Position(),
    nativeWindow.IsMaximised(),
  ])
  windowSnapshot.value = {
    width: size.width,
    height: size.height,
    x: position.x,
    y: position.y,
    maximised,
  }
}

async function refreshNotificationAuthorization() {
  notificationAuthorization.value = await AppService.CheckNotificationAuthorization()
}

function openRepository() {
  action.run(() => AppService.OpenURL('https://github.com/OSpoon/wails-vue-starter'))
}

function writeClipboard() {
  action.run(async () => {
    await nativeClipboard.writeText(clipboardText.value)
  })
}

function readClipboard() {
  action.run(async () => {
    clipboardReadback.value = await nativeClipboard.readText()
  })
}

function showDialog() {
  action.run(() =>
    nativeDialog.info({
      Title: 'Native Dialog',
      Message: 'The Wails dialog runtime is available.',
      Buttons: [{ Label: 'OK', IsDefault: true }],
    }),
  )
}

function requestNotificationAuthorization() {
  action.run(async () => {
    notificationAuthorization.value = await AppService.RequestNotificationAuthorization()
  })
}

function sendNotification() {
  action.run(async () => {
    await AppService.SendSystemNotification({
      id: '',
      title: notificationTitle.value,
      subtitle: notificationSubtitle.value,
      body: notificationBody.value,
    })
    toast.success('Notification sent')
    await refreshNotificationAuthorization()
  })
}

function triggerError() {
  action.run(() => PreferenceService.Set('', 'invalid'), { toastError: true }).catch(() => {})
}

onMounted(() => {
  refreshAll().catch((err: unknown) => {
    action.error.value = normalizeError(err)
  })
})
</script>

<template>
  <div class="@container/main flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div class="min-w-0 grid gap-1">
        <h1 class="truncate text-2xl font-semibold">Foundation</h1>
        <p class="text-muted-foreground text-sm">
          Runtime services and native desktop capabilities exposed by the starter.
        </p>
      </div>
      <Button variant="outline" size="sm" @click="refreshAll">
        <IconRefresh data-icon="inline-start" />
        Refresh
      </Button>
    </div>

    <div class="grid gap-4 @4xl/main:grid-cols-[repeat(auto-fit,minmax(20rem,1fr))]">
      <Card class="min-w-0">
        <CardHeader>
          <CardTitle>Application Runtime</CardTitle>
          <CardDescription>Bound Go service metadata and environment.</CardDescription>
          <CardAction>
            <Badge variant="outline">{{ environment?.debug ? 'debug' : 'release' }}</Badge>
          </CardAction>
        </CardHeader>
        <CardContent>
          <div class="grid gap-3 text-sm sm:grid-cols-2">
            <div class="grid gap-1">
              <span class="text-muted-foreground">Name</span>
              <span class="font-medium">{{ appInfo?.displayName ?? '-' }}</span>
            </div>
            <div class="grid gap-1">
              <span class="text-muted-foreground">Version</span>
              <span class="font-medium">{{ appInfo?.version ?? '-' }}</span>
            </div>
            <div class="grid gap-1">
              <span class="text-muted-foreground">Platform</span>
              <span class="truncate font-medium">
                {{ environment?.os ?? '-' }}/{{ environment?.arch ?? '-' }}
              </span>
            </div>
            <div class="grid gap-1">
              <span class="text-muted-foreground">Accent</span>
              <span class="font-medium">{{ environment?.accentColor ?? '-' }}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card class="min-w-0">
        <CardHeader>
          <CardTitle>Native Actions</CardTitle>
          <CardDescription>Runtime facades for browser, clipboard, and dialogs.</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel>Clipboard</FieldLabel>
              <div class="flex gap-2">
                <Input v-model="clipboardText" />
                <Button variant="outline" size="icon" @click="writeClipboard">
                  <IconClipboard />
                  <span class="sr-only">Write clipboard</span>
                </Button>
              </div>
              <FieldDescription v-if="clipboardReadback">
                Readback: {{ clipboardReadback }}
              </FieldDescription>
            </Field>
            <div class="flex flex-wrap gap-2">
              <Button variant="outline" @click="readClipboard">Read Clipboard</Button>
              <Button variant="outline" @click="showDialog">Show Dialog</Button>
              <Button variant="outline" @click="openRepository">
                <IconBrandGithub data-icon="inline-start" />
                Repository
              </Button>
            </div>
          </FieldGroup>
        </CardContent>
      </Card>

      <Card class="min-w-0">
        <CardHeader>
          <CardTitle>System Notifications</CardTitle>
          <CardDescription
            >Authorization, delivery, and interaction callback wiring.</CardDescription
          >
          <CardAction>
            <Badge :variant="notificationAuthorization?.allowed ? 'default' : 'secondary'">
              {{
                notificationAuthorization === null
                  ? 'unknown'
                  : notificationAuthorization.allowed
                    ? 'allowed'
                    : 'blocked'
              }}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Alert>
              <IconBell />
              <AlertTitle>{{ notificationAuthorization?.platform ?? 'desktop' }}</AlertTitle>
              <AlertDescription>
                {{
                  notificationAuthorization?.message ??
                  'macOS may require a bundled, signed app before system notifications can be delivered.'
                }}
              </AlertDescription>
            </Alert>
            <Field>
              <FieldLabel>Title</FieldLabel>
              <Input v-model="notificationTitle" />
            </Field>
            <Field>
              <FieldLabel>Subtitle</FieldLabel>
              <Input v-model="notificationSubtitle" />
            </Field>
            <Field>
              <FieldLabel>Body</FieldLabel>
              <Textarea v-model="notificationBody" class="min-h-20" />
            </Field>
            <div class="flex flex-wrap gap-2">
              <Button variant="outline" @click="requestNotificationAuthorization">
                <IconBell data-icon="inline-start" />
                Request Permission
              </Button>
              <Button
                :disabled="notificationAuthorization?.allowed === false"
                @click="sendNotification"
              >
                <IconSend data-icon="inline-start" />
                Send Notification
              </Button>
            </div>
            <Field v-if="notificationResult">
              <FieldLabel>Last Interaction</FieldLabel>
              <Textarea
                :model-value="JSON.stringify(notificationResult, null, 2)"
                readonly
                class="min-h-24 font-mono text-xs"
              />
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>
    </div>

    <div class="grid gap-4 @4xl/main:grid-cols-[repeat(auto-fit,minmax(20rem,1fr))]">
      <Card class="min-w-0">
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
          <CardDescription>JSON-backed settings from `PreferenceService`.</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel>Theme</FieldLabel>
              <Input v-model="themePreference" />
            </Field>
            <Field orientation="responsive">
              <Switch v-model:checked="sidebarPreference" />
              <FieldContent>
                <FieldTitle>Sidebar Open</FieldTitle>
                <FieldDescription>Persists through the shared preference service.</FieldDescription>
              </FieldContent>
            </Field>
            <Button variant="outline" class="w-fit max-w-full" @click="resetPreferences">
              Reset Preferences
            </Button>
          </FieldGroup>
        </CardContent>
      </Card>

      <Card class="min-w-0">
        <CardHeader>
          <CardTitle>Window State</CardTitle>
          <CardDescription>Current window plus persisted snapshot.</CardDescription>
          <CardAction>
            <Button variant="ghost" size="icon" @click="refreshWindowSnapshot">
              <IconWindow />
              <span class="sr-only">Refresh window state</span>
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <div class="grid gap-3 text-sm">
            <div class="flex justify-between gap-3">
              <span class="text-muted-foreground">Current</span>
              <span class="shrink-0 font-medium">
                {{ windowSnapshot?.width ?? '-' }} x {{ windowSnapshot?.height ?? '-' }}
              </span>
            </div>
            <div class="flex justify-between gap-3">
              <span class="text-muted-foreground">Position</span>
              <span class="shrink-0 font-medium">
                {{ windowSnapshot?.x ?? '-' }}, {{ windowSnapshot?.y ?? '-' }}
              </span>
            </div>
            <div class="flex justify-between gap-3">
              <span class="text-muted-foreground">Maximised</span>
              <Badge variant="secondary">{{ windowSnapshot?.maximised ? 'yes' : 'no' }}</Badge>
            </div>
            <Textarea
              :model-value="JSON.stringify(windowPreference ?? {}, null, 2)"
              readonly
              class="min-h-24 font-mono text-xs"
            />
          </div>
        </CardContent>
      </Card>

      <Card class="min-w-0">
        <CardHeader>
          <CardTitle>Events & Errors</CardTitle>
          <CardDescription>Typed events and normalized service errors.</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <FieldSet>
              <FieldLegend>Recent Events</FieldLegend>
              <div class="grid gap-2">
                <Badge
                  v-for="entry in eventLog"
                  :key="entry"
                  variant="outline"
                  class="max-w-full justify-start truncate"
                >
                  {{ entry }}
                </Badge>
                <span v-if="eventLog.length === 0" class="text-muted-foreground text-sm"
                  >No events yet.</span
                >
              </div>
            </FieldSet>
            <Button variant="outline" @click="triggerError">
              <IconAlertTriangle data-icon="inline-start" />
              Trigger Error
            </Button>
            <div v-if="action.error.value" class="text-destructive text-sm">
              {{ action.error.value.code }}: {{ action.error.value.message }}
            </div>
          </FieldGroup>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
