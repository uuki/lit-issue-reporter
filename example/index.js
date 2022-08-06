import { REPORTER_GITHUB_TOKEN } from '@/utils/env'

if (!import.meta.env.PROD) {
  import('../src').then(({ createReporter }) => {
    console.log(createReporter)
    const lang = ['ja', 'en'].find((it) => new RegExp(`^${it}`).test(window.navigator.language)) || 'en'

    createReporter({
      token: REPORTER_GITHUB_TOKEN,
      owner: 'uuki',
      repository: 'lit-issue-reporter',
      lang,
      noticeDuration: 5000,
    })
  })
}
