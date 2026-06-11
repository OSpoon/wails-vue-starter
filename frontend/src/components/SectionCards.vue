<script setup lang="ts">
import { IconTrendingUp } from '@tabler/icons-vue'

import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
</script>

<template>
  <div
    class="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4"
  >
    <Card class="@container/card">
      <CardHeader>
        <CardDescription>Go Services</CardDescription>
        <CardTitle class="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          3
        </CardTitle>
        <CardAction>
          <Badge variant="outline">
            <IconTrendingUp />
            typed
          </Badge>
        </CardAction>
      </CardHeader>
      <CardFooter class="flex-col items-start gap-1.5 text-sm">
        <div class="line-clamp-1 flex gap-2 font-medium">
          Bound into Vue <IconTrendingUp class="size-4" />
        </div>
        <div class="text-muted-foreground">Generated TypeScript bindings</div>
      </CardFooter>
    </Card>
    <Card class="@container/card">
      <CardHeader>
        <CardDescription>Runtime APIs</CardDescription>
        <CardTitle class="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          8+
        </CardTitle>
        <CardAction>
          <Badge variant="outline">
            <IconTrendingUp />
            native
          </Badge>
        </CardAction>
      </CardHeader>
      <CardFooter class="flex-col items-start gap-1.5 text-sm">
        <div class="line-clamp-1 flex gap-2 font-medium">
          Desktop surface covered <IconTrendingUp class="size-4" />
        </div>
        <div class="text-muted-foreground">Window, dialogs, clipboard, system</div>
      </CardFooter>
    </Card>
    <Card class="@container/card">
      <CardHeader>
        <CardDescription>Theme Sync</CardDescription>
        <CardTitle class="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          Auto
        </CardTitle>
        <CardAction>
          <Badge variant="outline">
            <IconTrendingUp />
            live
          </Badge>
        </CardAction>
      </CardHeader>
      <CardFooter class="flex-col items-start gap-1.5 text-sm">
        <div class="line-clamp-1 flex gap-2 font-medium">
          Follows system changes <IconTrendingUp class="size-4" />
        </div>
        <div class="text-muted-foreground">Light, dark, and preference state</div>
      </CardFooter>
    </Card>
    <Card class="@container/card">
      <CardHeader>
        <CardDescription>Internationalization</CardDescription>
        <CardTitle class="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          EN / 中文
        </CardTitle>
        <CardAction>
          <Badge variant="outline">
            <IconTrendingUp />
            i18n
          </Badge>
        </CardAction>
      </CardHeader>
      <CardFooter class="flex-col items-start gap-1.5 text-sm">
        <div class="line-clamp-1 flex gap-2 font-medium">
          Switches without reload <IconTrendingUp class="size-4" />
        </div>
        <div class="text-muted-foreground">Persisted locale preference</div>
      </CardFooter>
    </Card>
  </div>
</template>
