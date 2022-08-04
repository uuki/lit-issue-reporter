import { App, ReporterConfig } from './app'
import { initMocks } from '@/mocks/server'
import '@/styles/variables/font.css'
import '@/styles/variables/text.css'
import '@/styles/variables/color.css'
import '@/styles/variables/radius.css'

export async function createReporter({ ...args }: ReporterConfig) {
  if (import.meta.env.DEV) {
    await initMocks()
  }
  App({ ...args })
}
