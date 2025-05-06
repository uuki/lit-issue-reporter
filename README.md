# lit-issue-reporter

![main branch parameter](https://github.com/uuki/lit-issue-reporter/actions/workflows/ci.yml/badge.svg?branch=main)
<a href="https://github.com/nodejs/node/blob/main/doc/changelogs/CHANGELOG_V14.md#14.20.0" target="_blank"><img src="https://img.shields.io/badge/node-%3E%3D14.20.0-blue.svg?cacheSeconds=86400" /></a>
[![Downloads](https://img.shields.io/npm/dt/lit-issue-reporter.svg)](https://www.npmjs.com/package/lit-issue-reporter)
![Version](https://img.shields.io/npm/v/lit-issue-reporter.svg)
![License](https://img.shields.io/npm/l/lit-issue-reporter.svg)
[![Vercel deployment](https://img.shields.io/github/deployments/uuki/lit-issue-reporter/production?label=vercel&logo=vercel&logoColor=white)](https://lit-issue-reporter.vercel.app/)

This library allows anyone to submit issues directly from a web application.  
It is made of web-component ([lit](https://github.com/lit/lit)), provided as an ES module, and can be used in various FWs and designs.

> Vanilla JS, React, Vue, Svelte ...

[DEMO](https://lit-issue-reporter.vercel.app/)

https://user-images.githubusercontent.com/3760515/183294974-fb73c893-357e-42c2-9b0c-f4e7f24e51b1.mp4

## Browsers support

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Safari |
| --------- | --------- | --------- | --------- |
| Edge| last 2 versions| last 2 versions| last 2 versions

## 🤔 Why is this needed?

During application development, when reporting a problem, it may not be easy for a non-engineer to intuitively imagine the information needed for verification.

This library, in addition to GitHub's Issue Template feature, automatically supplements the user's environment information to aid reproducibility.

## ✨ Features

- 📝 Provide a form for the web application to submit a form (using GitHub API v4)
- 🗂️ [Issue Templates](https://docs.github.com/ja/communities/using-templates-to-encourage-useful-issues-and-pull-requests/configuring-issue-templates-for-your-repository) configured in the repository can be used
- 🔦 Automatically adds information such as location, browser, OS, screen size, and monitor resolution
- 🌏 All text in the form UI can be replaced with arbitrary text
- 📸 Additional screenshot data can be added (available but in development)

## 📦 Install

```shell
yarn add lit-issue-reporter
```

## 🐣 Usage

### Prepare

You must first issue a [personal access token (PAT)](https://docs.github.com/ja/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) with access permission to any repository from [settings/tokens](https://github.com/settings/personal-access-tokens).

From version [**0.7.0**](https://github.com/uuki/lit-issue-reporter/releases/tag/v0.7.0), **Fine-grained personal access tokens** are now supported. This update allows you to apply restrictions to **specific repositories** and **limit the scope to Issue operations only**.

- Personal access tokens (classic) are deprecated as they require the repo scope, which poses security risks by granting overly broad permissions.
- Please manage **tokens** separately for each environment (such as in dedicated .env files) to ensure they are not included in production builds.

<img src="https://github.com/user-attachments/assets/5f70e5ed-3d09-4345-94b4-3aa9c7b229e5" />
<br>
<img src="https://github.com/user-attachments/assets/ef29bc74-2d5b-4c07-84b9-5c5ee76b2ec9" />

### Setup

```js
if (process.env.NODE_ENV !== 'production') {
  import('lit-issue-reporter').then(({ createReporter }) => {
    createReporter({
      token: process.env.GITHUB_TOKEN,
      owner: '<GITHUB_USER_NAME>',
      repository: '<GITHUB_REPOSITORY_NAME>',
    })
  })
}
```

Then add to any position.

```html
...
<issue-reporter></issue-reporter>
</body>
```

Finally, add a style.

```css
@import 'lit-issue-reporter/dist/style.css';
```

### Options

| key | type | default | description |
|:--|:--|:--|:--|
| lang | `'ja' \| 'en'` | `'ja'` | i18n by [lit-translate](https://github.com/andreasbm/lit-translate) |
| stringsLoader | `(lang) => Promise<Strings>` | `(lang) => import(./locales/${lang}.json)` | Can be replaced by specifying any loader |
| noticeDuration | `number` | `4000` | Notification time to open issues |
| insertFrom | `boolean` | `true` | The following text will be inserted at the end of the body. `Sent by lit-issue-repoter` |

## License

lit-issue-reporter is available under the MIT License.