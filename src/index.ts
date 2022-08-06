import type { ReporterConfig } from '@/contexts/app'
import { App } from './app'
import { initMocks } from '@/mocks/server'
import '@/styles/index.css'

export async function createReporter(config: ReporterConfig) {
  if (import.meta.env.DEV) {
    await initMocks()
  }
  App(config)
}
