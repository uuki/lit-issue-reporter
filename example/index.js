import { createReporter } from '../src'
import { REPORTER_GITHUB_TOKEN, REPORTER_REPO_NAME, REPORTER_REPO_OWNER } from '@/utils/env'

createReporter({
  token: REPORTER_GITHUB_TOKEN,
  repository: REPORTER_REPO_NAME,
  owner: REPORTER_REPO_OWNER,
  lang: ['ja', 'en'].find((it) => new RegExp(`^${it}`).test(window.navigator.language)) || 'en',
})
