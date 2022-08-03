import { REPORTER_MOCKING } from '@/utils/env'

export const initMocks = () => {
  if (!REPORTER_MOCKING) {
    return
  }
  if (typeof window === 'undefined') {
    const server = () => import('./server')
    server()
  } else {
    const worker = () => import('./browser')
    worker()
  }
}
