import { LitElement, html, unsafeCSS } from 'lit'
import { live } from 'lit/directives/live.js'
import { ref, createRef } from 'lit/directives/ref.js'
import { ifDefined } from 'lit/directives/if-defined.js'
import { emit } from '@/utils/event'
import { APP_PREFIX } from '@/utils/env'
import style from './Input.css'

export class Input extends LitElement {
  type: HTMLInputElement['type']
  name: HTMLInputElement['name']
  value: string
  placeholder?: string
  modifier?: string
  internals_: ElementInternals

  static styles = unsafeCSS(style)
  static formAssociated = true
  private inputRef = createRef<HTMLInputElement>()
  static get properties() {
    return {
      type: {
        type: String,
      },
      name: {
        type: String,
      },
      value: {
        type: String,
      },
      placeholder: {
        type: String,
      },
      modifier: {
        type: String,
      },
    }
  }

  constructor() {
    super()

    this.type = 'text' as HTMLInputElement['type']
    this.name = ''
    this.value = ''
    this.internals_ = this.attachInternals()
  }

  onChange() {
    this.value = this.inputRef.value?.value || ''
    this.internals_.setFormValue(this.value)
    emit(this, 'change', {
      detail: {
        value: this.value,
      },
    })
  }

  onInput() {
    this.value = this.inputRef.value?.value || ''
    this.internals_.setFormValue(this.value)
    emit(this, 'input', {
      detail: {
        value: this.value,
      },
    })
  }

  onBlur() {
    this.value = this.inputRef.value?.value || ''
    this.internals_.setFormValue(this.value)
    emit(this, 'blur', {
      detail: {
        value: this.value,
      },
    })
  }

  render() {
    return html`
      <input
        ${ref(this.inputRef)}
        type=${this.type as any}
        name=${ifDefined(this.name)}
        .value=${live(this.value)}
        placeholder=${ifDefined(this.placeholder)}
        class="${APP_PREFIX}-input${this.modifier && ` ${this.modifier}`}"
        @change=${this.onChange}
        @input=${this.onInput}
        @blur=${this.onBlur}
      />
    `
  }
}

customElements.define('ir-input', Input, {
  extends: 'input',
})

declare global {
  interface HTMLElementTagNameMap {
    'ir-input': Input
  }
}
