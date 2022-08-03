import { withForm } from 'lite-form'

class Form extends HTMLFormElement {
  connectedCallback() {
    this.addEventListener('submit', this.handleSubmit)
    this.addEventListener('reset', this.handleReset)
  }

  disconnectedCallback() {
    this.removeEventListener('submit', this.handleSubmit)
    this.removeEventListener('reset', this.handleReset)
  }
}

export const LiteForm = withForm(Form)

customElements.define('lite-form', LiteForm, { extends: 'form' })
