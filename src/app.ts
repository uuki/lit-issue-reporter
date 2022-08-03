import { html, LitElement, unsafeCSS } from 'lit'
import { ref, createRef } from 'lit/directives/ref.js'
import { registerTranslateConfig, use } from 'lit-translate'
import { StoreController } from 'exome/lit'
import { createApolloClient } from '@/utils/apollo-client'
import { appContext, Config } from '@/contexts/app'
import { modalContext } from '@/contexts/modal'
import style from './app.css'
import '@/components/functional/Movable/Movable'
import '@/components/atoms/CircleButton/CircleButton'
import '@/components/layouts/ReportLayout/ReportLayout'

export type ReporterConfig = Config

export function createReporter({
  token,
  repository,
  owner,
  localesLoader,
  lang = 'ja',
  insertFrom = true,
}: ReporterConfig) {
  registerTranslateConfig({
    loader: (lang) => localesLoader || import(`./locales/${lang}.json`),
  })

  class RootElement extends LitElement {
    static styles = unsafeCSS(style)
    private appRef = createRef<HTMLElement>()
    private app = new StoreController(this, appContext)
    private modal = new StoreController(this, modalContext)

    constructor() {
      super()
      use(lang)
    }

    private handleModalToggle() {
      this.modal.store.setVisible(!this.modal.store.visible)
      this.requestUpdate()
    }

    firstUpdated() {
      const client = createApolloClient(token)

      this.app.store.setContext(this.renderRoot)
      this.app.store.setRoot(this.appRef.value || null)
      this.app.store.setApolloClient(client)
      this.app.store.setConfig({
        token,
        repository,
        owner,
        lang,
        localesLoader,
        insertFrom,
      })
    }

    render() {
      return html`<div ${ref(this.appRef)} class="app">
        <ir-report-layout></ir-report-layout>
        <ir-movable .styles="${{ width: '30px', height: '30px' }}">
          <ir-report-button class="app-report-button" @click=${this.handleModalToggle}></ir-report-button>
        </ir-movable>
      </div>`
    }

    createRenderRoot() {
      return this
    }
  }

  customElements.define('issue-reporter', RootElement)
}
