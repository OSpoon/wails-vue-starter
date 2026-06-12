<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { toast } from 'vue-sonner'
import {
  IconAlertTriangle,
  IconBell,
  IconBolt,
  IconBrandGithub,
  IconBrowser,
  IconClipboard,
  IconCode,
  IconDeviceDesktop,
  IconDownload,
  IconDragDrop,
  IconFileExport,
  IconFolderOpen,
  IconKeyboard,
  IconMenu2,
  IconPin,
  IconRefresh,
  IconRocket,
  IconSend,
  IconSettingsAutomation,
  IconWindow,
} from '@tabler/icons-vue'
import type { Component } from 'vue'
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
  FieldLegend,
  FieldSet,
  FieldTitle,
} from '@/components/ui/field'
import { useAppInfo } from '@/composables/useAppInfo'
import { normalizeError, useAsyncAction } from '@/composables/useAsyncAction'
import { usePreferences } from '@/composables/usePreferences'
import { useWailsEvent } from '@/composables/useWailsEvent'
import {
  nativeClipboard,
  nativeDialog,
  nativeScreens,
  nativeSystem,
  nativeWindow,
} from '@/lib/native'
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

interface ScreenSummary {
  name: string
  width: number
  height: number
  scaleFactor: number
}

interface CapabilityItem {
  title: string
  description: string
  status: 'live' | 'planned'
  icon: Component
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
const selectedPath = ref('')
const savePath = ref('')
const dialogAnswer = ref('')
const eventLog = ref<string[]>([])
const windowSnapshot = ref<WindowSnapshot | null>(null)
const notificationPermission = ref<boolean | null>(null)
const notificationTitle = ref('Wails Vue Starter')
const notificationSubtitle = ref('Runtime check')
const notificationBody = ref('System notifications are wired through the Wails runtime.')
const notificationResult = ref<NotificationInteraction | null>(null)
const alwaysOnTop = ref(false)
const systemDarkMode = ref<boolean | null>(null)
const screenCount = ref<number | null>(null)
const primaryScreen = ref<ScreenSummary | null>(null)
const systemCapabilities = ref<Record<string, unknown> | null>(null)

const capabilityItems: CapabilityItem[] = [
  {
    title: 'Window Management',
    description: 'Size, position, maximise, restore, zoom, always-on-top.',
    status: 'live',
    icon: IconWindow,
  },
  {
    title: 'Go Services & Bindings',
    description: 'Type-safe Go methods exposed to Vue through generated bindings.',
    status: 'live',
    icon: IconCode,
  },
  {
    title: 'Events',
    description:
      'Go-to-frontend runtime events for time ticks, readiness, and notification results.',
    status: 'live',
    icon: IconBolt,
  },
  {
    title: 'Dialogs',
    description: 'Native message, question, open-file, and save-file dialogs.',
    status: 'live',
    icon: IconFolderOpen,
  },
  {
    title: 'Clipboard',
    description: 'Read and write text with the platform clipboard.',
    status: 'live',
    icon: IconClipboard,
  },
  {
    title: 'Browser Integration',
    description: 'Open external URLs using the operating system default browser.',
    status: 'live',
    icon: IconBrowser,
  },
  {
    title: 'Notifications',
    description:
      'Request permission, send system notifications, and receive interaction callbacks.',
    status: 'live',
    icon: IconBell,
  },
  {
    title: 'In-App Updater',
    description: 'Check GitHub Releases, verify SHA256SUMS, stage updates, and restart safely.',
    status: 'live',
    icon: IconDownload,
  },
  {
    title: 'Screens & Environment',
    description: 'Inspect displays, scale factor, dark mode, accent colour, OS, and architecture.',
    status: 'live',
    icon: IconDeviceDesktop,
  },
  {
    title: 'Menus & System Tray',
    description: 'Application menus, context menus, and tray menus provided by Wails3.',
    status: 'planned',
    icon: IconMenu2,
  },
  {
    title: 'Keyboard Shortcuts',
    description: 'Register global and app-level shortcuts for desktop workflows.',
    status: 'planned',
    icon: IconKeyboard,
  },
  {
    title: 'Drag & Drop',
    description: 'Handle file drops and HTML drag-and-drop interactions.',
    status: 'planned',
    icon: IconDragDrop,
  },
  {
    title: 'Autostart & Dock/Taskbar',
    description: 'Startup behaviour plus platform-specific Dock and taskbar integration.',
    status: 'planned',
    icon: IconSettingsAutomation,
  },
  {
    title: 'Packaging & Distribution',
    description: 'Cross-platform builds, signing, packaging, file associations, and update flows.',
    status: 'planned',
    icon: IconRocket,
  },
]

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
    refreshSystemSnapshot(),
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
  notificationPermission.value = await AppService.CheckNotificationAuthorization()
}

async function refreshSystemSnapshot() {
  const [darkMode, screens, primary, capabilities] = await Promise.all([
    nativeSystem.IsDarkMode(),
    nativeScreens.GetAll(),
    nativeScreens.GetPrimary(),
    nativeSystem.Capabilities(),
  ])
  systemDarkMode.value = darkMode
  screenCount.value = screens.length
  primaryScreen.value = {
    name: primary.Name,
    width: primary.Size.Width,
    height: primary.Size.Height,
    scaleFactor: primary.ScaleFactor,
  }
  systemCapabilities.value = capabilities
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

function askQuestion() {
  action.run(async () => {
    dialogAnswer.value = await nativeDialog.question({
      Title: 'Question Dialog',
      Message: 'This is a native question dialog example.',
      Buttons: [
        { Label: 'Continue', IsDefault: true },
        { Label: 'Cancel', IsCancel: true },
      ],
    })
  })
}

function openFile() {
  action.run(async () => {
    const result = await nativeDialog.openFile({
      Title: 'Open File',
      Message: 'Pick a file to test the native file picker.',
      ButtonText: 'Open',
      CanChooseFiles: true,
      AllowsMultipleSelection: false,
    })
    selectedPath.value = result
  })
}

function chooseSavePath() {
  action.run(async () => {
    savePath.value = await nativeDialog.saveFile({
      Title: 'Save File',
      Message: 'Choose a destination path.',
      ButtonText: 'Choose',
      Filename: 'wails-vue-starter.txt',
    })
  })
}

function requestNotificationAuthorization() {
  action.run(async () => {
    notificationPermission.value = await AppService.RequestNotificationAuthorization()
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

function checkForUpdates() {
  action.run(() => AppService.CheckForUpdates(), { toastError: true })
}

function centerWindow() {
  action.run(async () => {
    await nativeWindow.Center()
    await refreshWindowSnapshot()
  })
}

function toggleMaximiseWindow() {
  action.run(async () => {
    await nativeWindow.ToggleMaximise()
    await refreshWindowSnapshot()
  })
}

function restoreWindow() {
  action.run(async () => {
    await nativeWindow.Restore()
    await refreshWindowSnapshot()
  })
}

function toggleAlwaysOnTop() {
  action.run(async () => {
    alwaysOnTop.value = !alwaysOnTop.value
    await nativeWindow.SetAlwaysOnTop(alwaysOnTop.value)
  })
}

function zoomIn() {
  action.run(() => nativeWindow.ZoomIn())
}

function zoomReset() {
  action.run(() => nativeWindow.ZoomReset())
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
        <h1 class="truncate text-2xl font-semibold">Native Runtime</h1>
        <p class="text-muted-foreground text-sm">
          Wails3 runtime services and native desktop capabilities exposed by the starter.
        </p>
      </div>
      <Button variant="outline" size="sm" @click="refreshAll">
        <IconRefresh data-icon="inline-start" />
        Refresh
      </Button>
    </div>

    <div class="grid gap-4 @3xl/main:grid-cols-2 @6xl/main:grid-cols-3">
      <Card v-for="capability in capabilityItems" :key="capability.title" class="min-w-0">
        <CardHeader>
          <CardTitle class="flex min-w-0 items-center gap-2 text-base">
            <component :is="capability.icon" />
            <span class="truncate">{{ capability.title }}</span>
          </CardTitle>
          <CardAction>
            <Badge :variant="capability.status === 'live' ? 'default' : 'secondary'">
              {{ capability.status === 'live' ? 'Live' : 'Planned' }}
            </Badge>
          </CardAction>
          <CardDescription>{{ capability.description }}</CardDescription>
        </CardHeader>
      </Card>
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
            <div class="grid gap-1">
              <span class="text-muted-foreground">Dark Mode</span>
              <span class="font-medium">
                {{ systemDarkMode === null ? '-' : systemDarkMode ? 'yes' : 'no' }}
              </span>
            </div>
            <div class="grid gap-1">
              <span class="text-muted-foreground">Screens</span>
              <span class="font-medium">{{ screenCount ?? '-' }}</span>
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
              <Button variant="outline" @click="askQuestion">Ask Question</Button>
              <Button variant="outline" @click="openRepository">
                <IconBrandGithub data-icon="inline-start" />
                Repository
              </Button>
            </div>
            <FieldDescription v-if="dialogAnswer"
              >Dialog answer: {{ dialogAnswer }}</FieldDescription
            >
          </FieldGroup>
        </CardContent>
      </Card>

      <Card class="min-w-0">
        <CardHeader>
          <CardTitle>File Dialogs</CardTitle>
          <CardDescription
            >Open and save path pickers from the native dialog runtime.</CardDescription
          >
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <div class="flex flex-wrap gap-2">
              <Button variant="outline" @click="openFile">
                <IconFolderOpen data-icon="inline-start" />
                Open File
              </Button>
              <Button variant="outline" @click="chooseSavePath">
                <IconFileExport data-icon="inline-start" />
                Save Path
              </Button>
            </div>
            <Field v-if="selectedPath">
              <FieldLabel>Selected File</FieldLabel>
              <Textarea :model-value="selectedPath" readonly class="min-h-16 font-mono text-xs" />
            </Field>
            <Field v-if="savePath">
              <FieldLabel>Save Path</FieldLabel>
              <Textarea :model-value="savePath" readonly class="min-h-16 font-mono text-xs" />
            </Field>
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
            <Badge :variant="notificationPermission ? 'default' : 'secondary'">
              {{
                notificationPermission === null
                  ? 'unknown'
                  : notificationPermission
                    ? 'allowed'
                    : 'blocked'
              }}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardContent>
          <FieldGroup>
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
              <Button @click="sendNotification">
                <IconSend data-icon="inline-start" />
                Send Notification
              </Button>
            </div>
            <FieldDescription>
              On macOS, delivery may require running a bundled app and allowing notifications in
              System Settings.
            </FieldDescription>
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

      <Card class="min-w-0">
        <CardHeader>
          <CardTitle>In-App Updater</CardTitle>
          <CardDescription>
            GitHub Releases provider with SHA256SUMS verification for released artifacts.
          </CardDescription>
          <CardAction>
            <Badge variant="outline">GitHub</Badge>
          </CardAction>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel>Current Version</FieldLabel>
              <Input :model-value="appInfo?.version ?? '-'" readonly />
              <FieldDescription>
                Release artifacts are selected by platform and architecture from GitHub Releases.
              </FieldDescription>
            </Field>
            <Button class="w-fit max-w-full" @click="checkForUpdates">
              <IconDownload data-icon="inline-start" />
              Check for Updates
            </Button>
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
            <div class="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" @click="centerWindow">Center</Button>
              <Button variant="outline" size="sm" @click="toggleMaximiseWindow">Maximise</Button>
              <Button variant="outline" size="sm" @click="restoreWindow">Restore</Button>
              <Button variant="outline" size="sm" @click="toggleAlwaysOnTop">
                <IconPin data-icon="inline-start" />
                {{ alwaysOnTop ? 'Unpin' : 'Pin' }}
              </Button>
            </div>
            <div class="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" @click="zoomIn">Zoom In</Button>
              <Button variant="outline" size="sm" @click="zoomReset">Reset Zoom</Button>
            </div>
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
          <CardTitle>System Surface</CardTitle>
          <CardDescription>Runtime system, screen, and capability snapshots.</CardDescription>
          <CardAction>
            <Button variant="ghost" size="icon" @click="refreshSystemSnapshot">
              <IconDeviceDesktop />
              <span class="sr-only">Refresh system snapshot</span>
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <div class="grid gap-3 text-sm">
            <div class="flex justify-between gap-3">
              <span class="text-muted-foreground">Primary Screen</span>
              <span class="min-w-0 truncate font-medium">{{ primaryScreen?.name ?? '-' }}</span>
            </div>
            <div class="flex justify-between gap-3">
              <span class="text-muted-foreground">Resolution</span>
              <span class="shrink-0 font-medium">
                {{ primaryScreen?.width ?? '-' }} x {{ primaryScreen?.height ?? '-' }}
              </span>
            </div>
            <div class="flex justify-between gap-3">
              <span class="text-muted-foreground">Scale</span>
              <Badge variant="secondary">{{ primaryScreen?.scaleFactor ?? '-' }}</Badge>
            </div>
            <Textarea
              :model-value="JSON.stringify(systemCapabilities ?? {}, null, 2)"
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
