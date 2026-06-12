import { execFileSync } from 'node:child_process'
import { defineConfig } from 'bumpp'

export default defineConfig({
  files: ['package.json', '../appconfig.go', '../build/config.yml'],
  execute: () => {
    execFileSync('wails3', ['task', 'common:update:build-assets'], {
      cwd: '..',
      stdio: 'inherit',
    })
  },
  commit: 'chore(release): v%s',
  tag: 'v%s',
  push: true,
  install: false,
})
