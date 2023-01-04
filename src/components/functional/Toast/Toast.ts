import { html, LitElement, unsafeCSS } from 'lit'
import { ref, createRef } from 'lit/directives/ref.js'
import { ifDefined } from 'lit/directives/if-defined.js'
import style from './Toast.css'
import { APP_PREFIX } from '@/utils/env'

import 'lit-toast/lit-toast.js'

export class Toast extends LitElement {
  showToast: (message: string, duration: number) => void
  modifier: string = ''

  static styles = unsafeCSS(style)
  private toastRef = createRef()
  static get properties() {
    return {
      modifier: {
        type: String,
      },
    }
  }

  constructor() {
    super()
    this.showToast = (message, duration) => {
      const target = this.shadowRoot?.querySelector('lit-toast')
      if (!target) {
        return
      }
      ;(target as any).show(message, duration)
    }
  }

  render() {
    return html`<lit-toast
      class="${APP_PREFIX}-toast"
      ${ref(this.toastRef)}
      modifier="${ifDefined(this.modifier)}"
    ></lit-toast>`
  }
}

customElements.define('ir-toast', Toast)

declare global {
  interface HTMLElementTagNameMap {
    'ir-toast': Toast
  }
}
