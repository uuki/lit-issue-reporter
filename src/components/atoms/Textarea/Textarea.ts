import { LitElement, html, unsafeCSS } from 'lit'
import { live } from 'lit/directives/live.js'
import { ref, createRef } from 'lit/directives/ref.js'
import { ifDefined } from 'lit/directives/if-defined.js'
import { emit } from '@/utils/event'
import style from './Textarea.css'

export class Textarea extends LitElement {
  name: HTMLTextAreaElement['name']
  value: string
  placeholder?: string
  internals_: ElementInternals

  static styles = unsafeCSS(style)
  static formAssociated = true
  private textAreaRef = createRef<HTMLTextAreaElement>()
  static get properties() {
    return {
      name: {
        type: String,
      },
      value: {
        type: String,
      },
      placeholder: {
        type: String,
      },
    }
  }

  constructor() {
    super()

    this.name = ''
    this.value = ''
    this.internals_ = this.attachInternals()
  }

  onChange() {
    this.value = this.textAreaRef.value?.value || ''
    this.internals_.setFormValue(this.value)
    emit(this, 'change', {
      detail: {
        value: this.value,
      },
    })
  }

  onInput() {
    this.value = this.textAreaRef.value?.value || ''
    this.internals_.setFormValue(this.value)
    emit(this, 'input', {
      detail: {
        value: this.value,
      },
    })
  }

  onBlur() {
    this.value = this.textAreaRef.value?.value || ''
    this.internals_.setFormValue(this.value)
    emit(this, 'blur', {
      detail: {
        value: this.value,
      },
    })
  }

  render() {
    return html`
      <textarea
        ${ref(this.textAreaRef)}
        name=${ifDefined(this.name)}
        .value=${live(this.value)}
        placeholder=${ifDefined(this.placeholder)}
        class="textarea"
        @change=${this.onChange}
        @input=${this.onInput}
        @blur=${this.onBlur}
      >
${this.value}</textarea
      >
    `
  }
}

customElements.define('ir-textarea', Textarea)

declare global {
  interface HTMLElementTagNameMap {
    'ir-textarea': Textarea
  }
}
