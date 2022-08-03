import { html, unsafeCSS, LitElement } from 'lit'
import { StoreController } from 'exome/lit'
import { modalContext } from '@/contexts/modal'
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
      class="modal${this.modal.store.visible ? ' -open' : ''}"
      tabindex="-1"
      aria-modal="true"
      aria-labelledby="Modal display of issue-reporter"
    >
      <div class="modal-overlay" @click=${this.close}></div>
      <div class="modal-content">
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
