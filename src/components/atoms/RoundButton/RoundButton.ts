import { LitElement, html, unsafeCSS } from 'lit'
import { APP_PREFIX } from '@/utils/env'
import style from './RoundButton.css'

export class RoundButton extends LitElement {
  static styles = unsafeCSS(style)
  modifier: string

  static get properties() {
    return {
      modifier: {
        type: String,
      },
    }
  }

  constructor() {
    super()
    this.modifier = ''
  }

  render() {
    return html`<button type="button" class="${APP_PREFIX}-roundButton${this.modifier ? ` ${this.modifier}` : ''}">
      <slot></slot>
    </button>`
  }
}

customElements.define('ir-round-button', RoundButton)

declare global {
  interface HTMLElementTagNameMap {
    'ir-round-button': RoundButton
  }
}
