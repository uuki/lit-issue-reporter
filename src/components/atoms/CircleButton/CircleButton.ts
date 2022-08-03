import { LitElement, html, unsafeCSS } from 'lit'
import style from './CircleButton.css'
import IconGithub from '@/images/icons/github.svg?url'

export class CircleButton extends LitElement {
  static styles = unsafeCSS(style)

  render() {
    return html`<button type="button" class="circleButton">
      <img src="${IconGithub}" alt="" class="circleButton-icon" />
    </button>`
  }
}

customElements.define('ir-report-button', CircleButton)

declare global {
  interface HTMLElementTagNameMap {
    'ir-report-button': CircleButton
  }
}
