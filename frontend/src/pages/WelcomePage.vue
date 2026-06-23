<script setup lang="ts">
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

import { ref, onMounted } from 'vue'
import { Events } from '@wailsio/runtime'
import { useI18n } from 'vue-i18n'
import { GreetService } from '../../bindings/github.com/OSpoon/wails-vue-starter'
import { Input } from '@/components/ui/input'

const { t } = useI18n()

const name = ref('')
const result = ref(t('welcome.emptyName'))
const time = ref(t('welcome.listeningTime'))

const doGreet = () => {
  const localName = name.value || 'anonymous'
  GreetService.Greet(localName)
    .then((resultValue: string) => {
      result.value = resultValue
    })
    .catch((err: Error) => {
      console.log(err)
    })
}

onMounted(() => {
  Events.On('time', (timeValue: { data: string }) => {
    time.value = timeValue.data
  })
})
</script>

<template>
  <div class="@container/main flex flex-1 flex-col">
    <div class="flex flex-col items-center justify-center gap-8 px-6 py-12 md:py-16 lg:px-8">
      <div class="flex justify-center gap-8">
        <a data-wml-openURL="https://wails.io" class="transition-all duration-300 hover:scale-105">
          <img
            src="/wails.png"
            class="h-16 md:h-20 opacity-80 hover:opacity-100"
            :alt="t('welcome.wailsLogo')"
          />
        </a>
        <a
          data-wml-openURL="https://vuejs.org/"
          class="transition-all duration-300 hover:scale-105"
        >
          <img
            src="/vue.svg"
            class="h-16 md:h-20 opacity-80 hover:opacity-100"
            :alt="t('welcome.vueLogo')"
          />
        </a>
      </div>

      <div class="flex flex-col items-center gap-3 text-center max-w-lg">
        <Badge
          variant="outline"
          class="rounded-full px-3 py-0.5 text-xs font-normal text-muted-foreground border-border"
        >
          <span class="tracking-wider uppercase text-[10px]">{{ t('welcome.stack') }}</span>
        </Badge>
        <h1 class="text-3xl font-semibold tracking-tight md:text-4xl lg:text-5xl leading-tight">
          {{ t('welcome.title') }}
        </h1>
        <p class="text-muted-foreground text-sm leading-relaxed max-w-md">
          {{ t('welcome.description') }}
        </p>
      </div>

      <div class="w-full max-w-md mx-auto px-0">
        <div class="rounded-xl border border-border/60 bg-card overflow-hidden">
          <div class="p-5">
            <div class="text-center mb-4 min-h-6">
              <p class="text-sm font-medium text-foreground/80">{{ result }}</p>
            </div>
            <div class="flex items-center gap-2.5">
              <Input
                aria-label="input"
                v-model="name"
                type="text"
                autocomplete="off"
                placeholder="Enter your name"
                class="h-9 text-sm"
              />
              <Button
                aria-label="greet-btn"
                @click="doGreet"
                class="h-9 px-4 text-sm font-medium shrink-0"
              >
                {{ t('welcome.greet') }}
              </Button>
            </div>
          </div>
          <div class="border-t border-border/40 px-5 py-3 flex items-center justify-between">
            <p class="text-xs text-muted-foreground/70">{{ t('welcome.learnMore') }}</p>
            <p class="text-xs font-mono text-muted-foreground/60 tabular-nums">{{ time }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
