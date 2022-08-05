import { html, unsafeCSS, LitElement } from 'lit'
import { StoreController } from 'exome/lit'
import { modalContext } from '@/contexts/modal'
import { APP_PREFIX } from '@/utils/env'
import style from './Modal.css?inline'

export class Modal extends LitElement {
  private modal = new StoreController(this, modalContext)
  static styles = unsafeCSS(style)

  constructor() {
    super()
  }

  private close() {
    this.modal.store.setVisible(false)
    this.requestUpdate()
  }

  render() {
    return html` <div
      class="${APP_PREFIX}-modal${this.modal.store.visible ? ' -open' : ''}"
      tabindex="-1"
      aria-modal="true"
      aria-labelledby="Modal display of issue-reporter"
    >
      <div class="${APP_PREFIX}-modal-overlay" @click=${this.close}></div>
      <div class="${APP_PREFIX}-modal-content">
        <slot></slot>
      </div>
    </div>`
  }
}

customElements.define('ir-modal', Modal)

declare global {
  interface HTMLElementTagNameMap {
    'ir-modal': Modal
  }
}
