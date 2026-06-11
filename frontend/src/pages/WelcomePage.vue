<script setup lang="ts">
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

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
  <div class="@container/main flex flex-1 flex-col gap-2">
    <div class="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div class="flex flex-col items-center gap-6 px-4 lg:px-6">
        <div class="flex justify-center gap-6">
          <a data-wml-openURL="https://wails.io">
            <img
              src="/wails.png"
              class="h-20 p-4 [will-change:filter] [box-sizing:content-box] hover:drop-shadow-[0_0_2em_#e80000aa]"
              :alt="t('welcome.wailsLogo')"
            />
          </a>
          <a data-wml-openURL="https://vuejs.org/">
            <img
              src="/vue.svg"
              class="h-20 p-4 [will-change:filter] [box-sizing:content-box] hover:drop-shadow-[0_0_2em_#42b883aa]"
              :alt="t('welcome.vueLogo')"
            />
          </a>
        </div>
        <div class="flex flex-col items-center gap-2 text-center">
          <Badge variant="outline" class="rounded-full px-3 py-0.5 text-xs font-normal">
            {{ t('welcome.stack') }}
          </Badge>
          <h1 class="text-3xl font-bold tracking-tight md:text-4xl">{{ t('welcome.title') }}</h1>
          <p class="text-muted-foreground max-w-md text-sm">
            {{ t('welcome.description') }}
          </p>
        </div>
      </div>

      <Card class="mx-4 lg:mx-6">
        <CardContent>
          <div aria-label="result" class="h-5 leading-5 my-6 mx-auto text-center">{{ result }}</div>
          <div class="card">
            <div class="flex items-center gap-3">
              <Input aria-label="input" v-model="name" type="text" autocomplete="off" />
              <Button aria-label="greet-btn" @click="doGreet">{{ t('welcome.greet') }}</Button>
            </div>
          </div>

          <div class="mt-4 content-center text-center">
            <div>
              <p>{{ t('welcome.learnMore') }}</p>
            </div>
            <div>
              <p>{{ time }}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
