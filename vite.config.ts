import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'

const isGitHubActions = process.env.GITHUB_ACTIONS === 'true'
const hasCustomDomain = existsSync(resolve(process.cwd(), 'public/CNAME'))

export default defineConfig({
  base: isGitHubActions && !hasCustomDomain
    ? '/samfem-cleaning-agency/'
    : '/',
  plugins: [react(), tailwindcss()],
})
