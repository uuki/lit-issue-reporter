import type { Options } from '@/contexts/app'
import platform from 'platform'

export const APP_OPTIONS: Readonly<Options> = {
  noticeDuration: 4000,
  lang: 'ja',
  stringsLoader: null,
  insertFrom: true,
}

export const APP_PROVIDERS = {
  github: {
    domain: 'https://github.com',
    endpoint: 'https://api.github.com/graphql',
  },
} as const

export const REPORT_BODY_TEMPLATE = `---
## More Information
| Name | Value |
|:--|:--|
| Location | ${location.href} |
| Browser | ${platform.name} ${platform.version} |
| Window size | ${window.innerWidth}x${window.innerHeight} |
| Screen size | ${window.screen.width}x${window.screen.height} |
| DPR | ${window.devicePixelRatio || 1} |
| Device | ${platform.product || 'unknown'} |
| OS | ${platform.os} (${platform.description}) |
` as const

export const REPORT_BODY_COPY = `---
**Sent by [lit-issue-reporter](https://github.com/uuki/lit-issue-reporter)**
` as const
