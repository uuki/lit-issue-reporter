import type { ReporterConfig } from '@/contexts/app'
import '@ungap/custom-elements'
import '@webcomponents/webcomponentsjs/webcomponents-bundle.js'
import { App } from './app'
import { initMocks } from '@/mocks/server'
import '@/styles/index.css'

export async function createReporter(config: ReporterConfig) {
  if (import.meta.env.DEV) {
    await import('@/utils/polyfills')
    await initMocks()
  }
  App(config)
}
