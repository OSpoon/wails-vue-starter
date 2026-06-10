<script setup lang="ts">
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

import { ref, onMounted } from 'vue'
import { Events } from '@wailsio/runtime'
import { GreetService } from '../../bindings/github.com/OSpoon/wails-vue-starter'
import { Input } from '@/components/ui/input'



const name = ref('')
const result = ref('Please enter your name below 👇')
const time = ref('Listening for Time event...')

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
              alt="Wails logo"
            />
          </a>
          <a data-wml-openURL="https://vuejs.org/">
            <img
              src="/vue.svg"
              class="h-20 p-4 [will-change:filter] [box-sizing:content-box] hover:drop-shadow-[0_0_2em_#42b883aa]"
              alt="Vue logo"
            />
          </a>
        </div>
        <div class="flex flex-col items-center gap-2 text-center">
          <Badge variant="outline" class="rounded-full px-3 py-0.5 text-xs font-normal">
            Wails3 + Vue 3 + TypeScript
          </Badge>
          <h1 class="text-3xl font-bold tracking-tight md:text-4xl">Welcome to Wails Vue Starter</h1>
          <p class="text-muted-foreground max-w-md text-sm">
            A modern desktop application built with Wails3, Vue 3, TypeScript, and shadcn-vue
            components.
          </p>
        </div>
      </div>

      <Card class="mx-4 lg:mx-6">
        <CardContent>
          <div aria-label="result" class="h-5 leading-5 my-6 mx-auto text-center">{{ result }}</div>
          <div class="card">
            <div class="flex items-center gap-3">
              <Input aria-label="input" v-model="name" type="text" autocomplete="off" />
              <Button aria-label="greet-btn" @click="doGreet">Greet</Button>
            </div>
          </div>

          <div class="mt-4 content-center text-center">
            <div><p>Click on the Wails logo to learn more</p></div>
            <div>
              <p>{{ time }}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
