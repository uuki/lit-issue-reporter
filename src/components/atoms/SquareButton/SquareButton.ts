import { LitElement, html, unsafeCSS } from 'lit'
import style from './SquareButton.css'

export class SquareButton extends LitElement {
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
    return html`<button type="button" class="squareButton${this.modifier ? ` ${this.modifier}` : ''}">
      <slot></slot>
    </button>`
  }
}

customElements.define('ir-square-button', SquareButton)

declare global {
  interface HTMLElementTagNameMap {
    'ir-square-button': SquareButton
  }
}
