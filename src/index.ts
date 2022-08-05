import { App, ReporterConfig } from './app'
import { initMocks } from '@/mocks/server'
import '@/styles/index.css'

export async function createReporter({ ...args }: ReporterConfig) {
  if (import.meta.env.DEV) {
    await initMocks()
  }
  App({ ...args })
}
