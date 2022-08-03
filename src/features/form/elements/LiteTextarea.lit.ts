import { LitElement, html } from 'lit-element'
import { ifDefined } from 'lit-html/directives/if-defined'
import { withField } from 'lite-form'

import '@/components/atoms/Textarea/Textarea'

export default class LiteTextarea extends LitElement {
  name: string = ''
  value: string = ''
  placeholder: string = ''

  static get properties() {
    return {
      name: { type: String },
      // from withField
      value: { type: String, reflect: true },
      placeholder: {
        type: String,
      },
    }
  }

  constructor() {
    super()
  }

  createRenderRoot() {
    return this
  }

  render() {
    return html`
      <ir-textarea name=${ifDefined(this.name)} .value=${this.value} placeholder=${ifDefined(this.placeholder)}>
      </ir-textarea>
    `
  }
}

customElements.define('lite-textarea', withField({ captureBlur: true, listenChange: true })(LiteTextarea))
