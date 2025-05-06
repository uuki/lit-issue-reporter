import { html, LitElement, unsafeCSS } from 'lit'
import { ref, createRef } from 'lit/directives/ref.js'
import { ifDefined } from 'lit/directives/if-defined.js'
import style from './Toast.css'

import 'lit-toast/lit-toast.js'

export class Toast extends LitElement {
  showToast: (message: string, duration: number, type?: string) => void
  modifier: string = ''
  type: string = 'info' // 'info', 'error', 'warning', 'success'

  static styles = unsafeCSS(style)
  private toastRef = createRef()
  static get properties() {
    return {
      modifier: {
        type: String,
      },
      type: {
        type: String,
      },
    }
  }

  constructor() {
    super()
    this.showToast = (message, duration, type = 'info') => {
      const target = this.shadowRoot?.querySelector('lit-toast')
      if (!target) {
        return
      }

      // タイプを設定
      this.type = type

      // トーストのスタイルをタイプに応じて変更
      if (target.hasAttribute('modifier')) {
        target.setAttribute('modifier', `${this.modifier} ${type}`)
      } else {
        target.setAttribute('modifier', type)
      }

      ;(target as any).show(message, duration)
    }
  }

  render() {
    const modifierClass = this.modifier ? `${this.modifier} ${this.type}` : this.type
    return html`<lit-toast ${ref(this.toastRef)} modifier="${ifDefined(modifierClass)}"></lit-toast>`
  }
}

customElements.define('ir-toast', Toast)

declare global {
  interface HTMLElementTagNameMap {
    'ir-toast': Toast
  }
}
