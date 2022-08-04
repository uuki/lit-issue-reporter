import { REPORTER_MOCKING } from '@/utils/env'

export const initMocks = async () => {
  if (REPORTER_MOCKING === 'false') {
    return
  }
  if (typeof window === 'undefined') {
    const server = () => import('./server')
    await server()
  } else {
    const worker = () => import('./browser')
    await worker()
  }
}
