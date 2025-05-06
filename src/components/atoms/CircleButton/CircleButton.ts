import { LitElement, html, unsafeCSS } from 'lit'
import style from './CircleButton.css'
import IconGithub from '@/images/icons/github.svg?url'
import { APP_PREFIX } from '@/utils/env'

export class CircleButton extends LitElement {
  static styles = unsafeCSS(style)

  render() {
    return html`<button type="button" class="${APP_PREFIX}-circleButton" data-draggable-handle>
      <img src="${IconGithub}" alt="" class="${APP_PREFIX}-circleButton-icon" />
    </button>`
  }
}

customElements.define('ir-report-button', CircleButton)

declare global {
  interface HTMLElementTagNameMap {
    'ir-report-button': CircleButton
  }
}
