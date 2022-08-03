import { LitElement, html, unsafeCSS } from 'lit'
// import { unsafeSVG } from 'lit-html/directives/unsafe-svg'
import { ifDefined } from 'lit/directives/if-defined.js'
import { emit } from '@/utils/event'
import IconShevronBottom from '@/images/icons/shevron-bottom.svg?raw'
import resetStyle from '@/styles/utils/reset.css'
import style from './Select.css'

export type SelectEvent = {
  detail: {
    selected: string
  }
} & Event

export type SelectItemProps = {
  name?: string
} & SelectProps

export type SelectProps = {
  label: string | number
  value: string | number
  checked?: boolean
}

export class Select extends LitElement {
  title: string
  defaultTitle: string
  name?: string
  options?: SelectProps[]

  static styles = [unsafeCSS(resetStyle), unsafeCSS(style)]

  static get properties() {
    return {
      title: {
        type: String,
      },
      name: {
        type: String,
      },
      options: {
        type: Array,
      },
    }
  }

  constructor() {
    super()
    this.title = ''
    this.defaultTitle = ''
    this.name = ''
    this.options = []
  }

  firstUpdated() {
    this.defaultTitle = this.title
  }

  handleChange(event: Event) {
    const target = event.target as HTMLInputElement

    this.title = target.value || this.defaultTitle

    emit(this, 'change', {
      ...event,
      detail: {
        selected: target.value,
      },
    })
  }

  getItem({ name, value, label, checked }: SelectItemProps) {
    return html`<li>
      <label class="select-item"
        ><div class="select-check">
          <input
            name="${ifDefined(name)}"
            type="radio"
            value="${value}"
            checked="${ifDefined(checked)}"
            @change="${this.handleChange}"
          /><span></span>
        </div>
        ${label}</label
      >
    </li>`
  }

  getIcon() {
    // TODO unsafeSVG(IconShevronBottom)
    const el = document.createElement('span')
    el.innerHTML = IconShevronBottom
    el.classList.add('select-icon')
    return html`${el}`
  }

  render() {
    return html`
      <details class="select">
        <summary class="select-header"><span class="select-heading">${this.title}</span>${this.getIcon()}</summary>
        <div class="select-container">
          <div class="select-content">
            <ul class="select-list">
              ${this.options?.map((opt) =>
                this.getItem({ name: this.name, value: opt.value, label: opt.label, checked: opt.checked })
              )}
            </ul>
          </div>
        </div>
      </details>
    `
  }
}

customElements.define('ir-select', Select)

declare global {
  interface HTMLElementTagNameMap {
    'ir-select': Select
  }
}
