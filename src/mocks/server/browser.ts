import { setupWorker } from 'msw'
import { handlers } from '../handlers'
import { REPORTER_MOCKING_DEBUG } from '@/utils/env'

export const worker = setupWorker(...handlers)
worker.start({
  // https://mswjs.io/docs/api/setup-worker/start#onunhandledrequest
  onUnhandledRequest(req) {
    if (REPORTER_MOCKING_DEBUG === 'true') {
      console.error('[MSW] Found an unhandled %s request to %s', req.method, req.url.href)
    }
  },
})
