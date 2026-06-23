<script setup lang="ts">
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
  <div class="grid grid-cols-1 gap-3 px-5 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
    <Card class="@container/card border border-border/50 shadow-none">
      <CardHeader class="pb-2">
        <CardDescription
          class="text-xs font-medium uppercase tracking-wider text-muted-foreground/70"
          >Go Services</CardDescription
        >
        <div class="flex items-end justify-between gap-2">
          <CardTitle class="text-3xl font-semibold tabular-nums tracking-tight">3</CardTitle>
          <CardAction>
            <Badge
              variant="outline"
              class="rounded-full px-2 py-0 text-[10px] font-normal border-border/60 text-muted-foreground/70"
              >typed</Badge
            >
          </CardAction>
        </div>
      </CardHeader>
      <CardFooter class="pt-2 pb-3">
        <div class="text-xs text-muted-foreground/70 leading-relaxed">
          Generated TypeScript bindings
        </div>
      </CardFooter>
    </Card>
    <Card class="@container/card border border-border/50 shadow-none">
      <CardHeader class="pb-2">
        <CardDescription
          class="text-xs font-medium uppercase tracking-wider text-muted-foreground/70"
          >Runtime APIs</CardDescription
        >
        <div class="flex items-end justify-between gap-2">
          <CardTitle class="text-3xl font-semibold tabular-nums tracking-tight">8+</CardTitle>
          <CardAction>
            <Badge
              variant="outline"
              class="rounded-full px-2 py-0 text-[10px] font-normal border-border/60 text-muted-foreground/70"
              >native</Badge
            >
          </CardAction>
        </div>
      </CardHeader>
      <CardFooter class="pt-2 pb-3">
        <div class="text-xs text-muted-foreground/70 leading-relaxed">
          Window, dialogs, clipboard, system
        </div>
      </CardFooter>
    </Card>
    <Card class="@container/card border border-border/50 shadow-none">
      <CardHeader class="pb-2">
        <CardDescription
          class="text-xs font-medium uppercase tracking-wider text-muted-foreground/70"
          >Theme Sync</CardDescription
        >
        <div class="flex items-end justify-between gap-2">
          <CardTitle class="text-3xl font-semibold tabular-nums tracking-tight">Auto</CardTitle>
          <CardAction>
            <Badge
              variant="outline"
              class="rounded-full px-2 py-0 text-[10px] font-normal border-border/60 text-muted-foreground/70"
              >live</Badge
            >
          </CardAction>
        </div>
      </CardHeader>
      <CardFooter class="pt-2 pb-3">
        <div class="text-xs text-muted-foreground/70 leading-relaxed">
          Light, dark, and preference state
        </div>
      </CardFooter>
    </Card>
    <Card class="@container/card border border-border/50 shadow-none">
      <CardHeader class="pb-2">
        <CardDescription
          class="text-xs font-medium uppercase tracking-wider text-muted-foreground/70"
          >i18n</CardDescription
        >
        <div class="flex items-end justify-between gap-2">
          <CardTitle class="text-3xl font-semibold tabular-nums tracking-tight"
            >EN / 中文</CardTitle
          >
          <CardAction>
            <Badge
              variant="outline"
              class="rounded-full px-2 py-0 text-[10px] font-normal border-border/60 text-muted-foreground/70"
              >i18n</Badge
            >
          </CardAction>
        </div>
      </CardHeader>
      <CardFooter class="pt-2 pb-3">
        <div class="text-xs text-muted-foreground/70 leading-relaxed">
          Persisted locale preference
        </div>
      </CardFooter>
    </Card>
  </div>
</template>
