<script setup lang="ts">
import ChartAreaInteractive from '@/components/ChartAreaInteractive.vue'
import DataTable from '@/components/DataTable.vue'
import SectionCards from '@/components/SectionCards.vue'

const data = [
  {
    id: 1,
    header: 'Go service binding',
    type: 'Backend bridge',
    status: 'In Process',
    target: '18',
    limit: '5',
    reviewer: 'GreetService',
  },
  {
    id: 2,
    header: 'Generated TypeScript bindings',
    type: 'Tooling',
    status: 'Done',
    target: '29',
    limit: '24',
    reviewer: 'wails3 generate bindings',
  },
  {
    id: 3,
    header: 'Window state persistence',
    type: 'Native runtime',
    status: 'Done',
    target: '10',
    limit: '13',
    reviewer: 'Window runtime',
  },
  {
    id: 4,
    header: 'Clipboard read and write',
    type: 'Native runtime',
    status: 'Done',
    target: '27',
    limit: '23',
    reviewer: 'Clipboard runtime',
  },
  {
    id: 5,
    header: 'Native open and save dialogs',
    type: 'Native runtime',
    status: 'In Process',
    target: '2',
    limit: '16',
    reviewer: 'Dialog runtime',
  },
  {
    id: 6,
    header: 'System notifications',
    type: 'Desktop integration',
    status: 'In Process',
    target: '20',
    limit: '8',
    reviewer: 'AppService',
  },
  {
    id: 7,
    header: 'System theme detection',
    type: 'Desktop integration',
    status: 'In Process',
    target: '19',
    limit: '21',
    reviewer: 'System runtime',
  },
  {
    id: 8,
    header: 'Live runtime events',
    type: 'Event bridge',
    status: 'Done',
    target: '25',
    limit: '26',
    reviewer: 'Events.On',
  },
  {
    id: 9,
    header: 'Preference service',
    type: 'Local persistence',
    status: 'Done',
    target: '7',
    limit: '23',
    reviewer: 'PreferenceService',
  },
  {
    id: 10,
    header: 'Internationalized navigation',
    type: 'Frontend shell',
    status: 'Done',
    target: '30',
    limit: '28',
    reviewer: 'vue-i18n',
  },
  {
    id: 11,
    header: 'Responsive sidebar shell',
    type: 'Frontend shell',
    status: 'Done',
    target: '9',
    limit: '31',
    reviewer: 'shadcn-vue',
  },
  {
    id: 12,
    header: 'Production build pipeline',
    type: 'Build system',
    status: 'Done',
    target: '12',
    limit: '0',
    reviewer: 'wails3 build',
  },
]
</script>

<template>
  <div class="@container/main flex flex-1 flex-col gap-2">
    <div class="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div class="grid gap-1 px-4 lg:px-6">
        <h1 class="text-2xl font-semibold tracking-tight">Data UI</h1>
        <p class="text-muted-foreground text-sm">
          Charts, cards, and tables using Wails-flavoured sample data.
        </p>
      </div>
      <SectionCards />
      <div class="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>
      <DataTable :data="data" />
    </div>
  </div>
</template>
