import { REPORTER_GITHUB_TOKEN, REPORTER_REPO_OWNER, REPORTER_REPO_NAME } from '@/utils/env'

if (!import.meta.env.PROD) {
  import('../src').then(({ createReporter }) => {
    console.log(createReporter)
    const lang = ['ja', 'en'].find((it) => new RegExp(`^${it}`).test(window.navigator.language)) || 'en'

    createReporter({
      token: REPORTER_GITHUB_TOKEN,
      owner: REPORTER_REPO_OWNER,
      repository: REPORTER_REPO_NAME,
      lang,
      noticeDuration: 5000,
    })
  })
}
