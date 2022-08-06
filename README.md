# lit-issue-reporter

[![Version](https://img.shields.io/badge/version-0.1.0-blue.svg?cacheSeconds=86400)](https://www.npmjs.com/package/lit-issue-reporter)
<a href="https://github.com/nodejs/node/blob/main/doc/changelogs/CHANGELOG_V14.md#14.20.0" target="_blank"><img src="https://img.shields.io/badge/node-%3E%3D14.20.0-blue.svg?cacheSeconds=86400" /></a>
[![Vercel deployment](https://img.shields.io/github/deployments/uuki/lit-issue-reporter/production?label=vercel&logo=vercel&logoColor=white)](https://lit-issue-reporter.vercel.app/)


This library allows anyone to submit issues directly from a web application.  
It is made of web-component ([lit](https://github.com/lit/lit)), provided as an ES module, and can be used in various FWs and designs.

> Vanilla JS, React, Vue, Svelte ...

[DEMO](https://lit-issue-reporter.vercel.app/)

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

You must first issue a [personal access token (PAT)](https://docs.github.com/ja/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) with access permission to any repository from [settings/tokens](https://github.com/settings/tokens).

- Please be careful when handling it, as it requires a `repo` scope!
- It is recommended that **PAT** not be pushed to the remote side. for example, manage it in the **.env** variable and then ignore the build file.  
Also, be sure to use it in a **restricted environment**, as it will be embedded in your application.
- In some cases, it may be safer to create a new account for the service, give it permissions as appropriate, and then create a **PAT**.

<img src="https://user-images.githubusercontent.com/3760515/182954290-58238034-30e7-46d5-b9d7-65c7d5860e2e.png" />

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
| localesLoader | `Promise<Strings>` | `import(./locales/${lang}.json)` | Can be replaced by specifying any loader |
| insertFrom | `boolean` | `true` | The following text will be inserted at the end of the body. `Sent by lit-issue-repoter` |

