import { html, LitElement, unsafeCSS } from 'lit'
import { ref, createRef } from 'lit/directives/ref.js'
import { registerTranslateConfig, use } from 'lit-translate'
import { StoreController } from 'exome/lit'
import { createApolloClient } from '@/utils/apollo-client'
import { appContext, ReporterConfig } from '@/contexts/app'
import { modalContext } from '@/contexts/modal'
import { APP_PREFIX } from '@/utils/env'
import style from './app.css'

import '@/components/functional/Draggable/Draggable'
import '@/components/atoms/CircleButton/CircleButton'
import '@/components/layouts/ReportLayout/ReportLayout'

export function App(config: ReporterConfig) {
  const { token, stringsLoader, lang, tokenType } = config

  registerTranslateConfig({
    loader: stringsLoader ? stringsLoader : (lang) => import(`./locales/${lang}.json`),
  })

  class RootElement extends LitElement {
    static styles = unsafeCSS(style)
    private appRef = createRef<HTMLElement>()
    private app = new StoreController(this, appContext)
    private modal = new StoreController(this, modalContext)

    constructor() {
      super()
      use(lang || this.app.store.config.lang)
    }

    private handleModalToggle(e: Event) {
      const target = e.target as HTMLElement
      const isDragging = target.closest('[data-dragging="true"]')
      if (isDragging) {
        return
      }
      this.modal.store.setVisible(!this.modal.store.visible)
      this.requestUpdate()
    }

    firstUpdated() {
      const client = createApolloClient(token)

      this.app.store.setContext(this.renderRoot)
      this.app.store.setRoot(this.appRef.value || null)
      this.app.store.setApolloClient(client)

      this.app.store.setConfig({
        ...config,
        tokenType: tokenType || 'auto',
      })
    }

    render() {
      return html`<div ${ref(this.appRef)} class="${APP_PREFIX}-app">
        <ir-report-layout></ir-report-layout>
        <ir-draggable .styles="${{ width: '30px', height: '30px' }}">
          <ir-report-button class="${APP_PREFIX}-app-report-button" @click=${this.handleModalToggle}></ir-report-button>
        </ir-draggable>
      </div>`
    }

    createRenderRoot() {
      return this
    }
  }

  customElements.define('issue-reporter', RootElement)
}
