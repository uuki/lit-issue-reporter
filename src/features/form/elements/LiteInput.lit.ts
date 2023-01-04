import { LitElement, html } from 'lit-element'
import { ifDefined } from 'lit-html/directives/if-defined'
import { withField } from 'lite-form'

import '@/components/atoms/Input/Input'

export default class LiteInput extends LitElement {
  type: string = 'text'
  name: string = ''
  value: string = ''
  placeholder: string = ''
  error: string = ''

  static get properties() {
    return {
      type: { type: String },
      name: { type: String },
      // from withField
      value: { type: String, reflect: true },
      placeholder: {
        type: String,
      },
      error: { type: String },
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
      <ir-input
        type=${this.type}
        name=${ifDefined(this.name)}
        .value=${this.value}
        placeholder=${ifDefined(this.placeholder)}
        modifier=${ifDefined(this.error ? 'error' : '')}
      >
      </ir-input>
    `
  }
}

// customElements.define('lite-input', withField({ captureBlur: true, listenChange: true })(LiteInput), {
//   extends: 'input',
// })

customElements.define('lite-input', LiteInput, {
  extends: 'input',
})
