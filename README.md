# lit-issue-reporter

<a href="https://www.npmjs.com/package/lit-issue-reporter"><img alt="Version" src="https://img.shields.io/badge/version-0.1.0-blue.svg?cacheSeconds=86400" /></a>
<a href="https://github.com/nodejs/node/blob/main/doc/changelogs/CHANGELOG_V14.md#14.20.0" target="_blank"><img src="https://img.shields.io/badge/node-%3E%3D14.20.0-blue.svg" /></a>

This library allows anyone to submit issues directly from a web application.  
It is made of web-component ([lit](https://github.com/lit/lit)), provided as an ES module, and can be used in various FWs and designs.

> Vanilla JS, React, Vue, Svelte ...

## 🤔 Why is this needed?

During application development, when reporting a problem, it may not be easy for a non-engineer to intuitively imagine the information needed for verification.

This library, in addition to GitHub's Issue Template feature, automatically supplements the user's environment information to aid reproducibility.

## ✨ Features

- 📝 Provide a form for the web application to submit a form (using GitHub API v4)
- 🗂️ [Issue Templates](https://docs.github.com/ja/communities/using-templates-to-encourage-useful-issues-and-pull-requests/configuring-issue-templates-for-your-repository) configured in the repository can be used
- 🔦 Automatically adds information such as OS, browser, screen size, and monitor resolution
- 🌏 All text in the form UI can be replaced with arbitrary text
- 📸 Additional screenshot data can be added (available but in development)

## 📦 Install

```shell
yarn add lit-issue-reporter
```

## 🐣 Usage

### Prepare

You must first issue a [personal access token (PAT)](https://docs.github.com/ja/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) with access permission to any repository.

- It is recommended that **PAT** not be pushed to the remote side. for example, manage it in the **.env** variable and then ignore the build file.  
Also, be sure to use it in a **restricted environment**, as it will be embedded in your application.
- In some cases, it may be safer to create a new account for the service, give it permissions as appropriate, and then create a **PAT**.

### Setup

```js
import { createReporter } from 'lit-issue-reporter'

createReporter({
  token: process.env.REPORTER_GITHUB_TOKEN,
  owner: process.env.REPORTER_REPO_OWNER,
  repository: process.env.REPORTER_REPO_NAME,
  ...options,
})
```

### Options

| key | type | default | description |
|:--|:--|:--|:--|
| lang | `'ja' \| 'en'` | `'ja'` | i18n by [lit-translate](https://github.com/andreasbm/lit-translate) |
| localesLoader | `Promise<Strings> \| undefined` | `import(./locales/${lang}.json)` | Can be replaced by specifying any loader |
| insertFrom | `boolean` | `true` | The following text will be inserted at the end of the body. `Sent by lit-issue-repoter` |
