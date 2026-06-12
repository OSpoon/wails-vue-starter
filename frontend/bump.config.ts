import { defineConfig } from 'bumpp'

export default defineConfig({
  files: ['package.json', '../appconfig.go', '../build/config.yml'],
  commit: 'chore(release): v%s',
  tag: 'v%s',
  push: true,
  install: false,
})
