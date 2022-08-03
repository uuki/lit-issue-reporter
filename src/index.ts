import { createReporter } from './app'
import { initMocks } from '@/mocks/server'
import '@/styles/variables/font.css'
import '@/styles/variables/text.css'
import '@/styles/variables/color.css'
import '@/styles/variables/radius.css'

if (import.meta.env.DEV) {
  initMocks()
}

export { createReporter }
