import type { IssueTemplate } from '@/types/generated/graphql'
import type { SelectProps } from '@/components/atoms/Select/Select'
import { LitElement, html, unsafeCSS } from 'lit'
import { ref, createRef } from 'lit/directives/ref.js'
import { translate as t } from 'lit-translate'
import { StoreController } from 'exome/lit'
import { appContext } from '@/contexts/app'
import { modalContext } from '@/contexts/modal'
import { REPORT_BODY_TEMPLATE, REPORT_BODY_COPY } from '@/constants'
import { ReportValidate, ReportFields } from '@/features/form'
import { toLiteFormValidationSchema } from '@/utils/zod'
import IconScreenShot from '@/images/icons/screenshot.svg?url'
import resetStyle from '@/styles/utils/reset.css'
import style from './ReportForm.css?inline'

import '@/features/form/elements'
import '@/components/functional/ScreenShot/ScreenShot'
import '@/components/atoms/RoundButton/RoundButton'
import '@/components/atoms/SquareButton/SquareButton'
import '@/components/atoms/Input/Input'
import '@/components/atoms/Select/Select'
import '@/components/atoms/Textarea/Textarea'

export class ReportForm extends LitElement {
  repositoryId: string
  templates: IssueTemplate[]
  currentTemplate: IssueTemplate | null
  selected: IssueTemplate['name']
  options: SelectProps[]
  screenshot: string
  initialValues: ReportFields
  loading: boolean

  reset: null | (() => void) = null
  private app = new StoreController(this, appContext)
  private modal = new StoreController(this, modalContext)
  private formRef = createRef()
  static styles = [unsafeCSS(resetStyle), unsafeCSS(style)]
  static get properties() {
    return {
      repositoryId: {
        type: String,
      },
      templates: {
        type: Array,
      },
      loading: {
        type: Boolean,
      },
    }
  }

  get values() {
    return this.formRef.value && (this.formRef.value as any).values
  }

  get errors() {
    return this.formRef.value && (this.formRef.value as any).errors
  }

  get isValid() {
    return this.formRef.value && (this.formRef.value as any).isValid
  }

  constructor() {
    super()
    this.repositoryId = ''
    this.selected = ''
    this.currentTemplate = null
    this.options = []
    this.templates = []
    this.screenshot = ''
    this.initialValues = {
      repositoryId: '',
      title: '',
      body: '',
    }
    this.loading = false
  }

  firstUpdated() {
    this.reset = () => {
      ;(this.formRef.value as any).handleReset()
      this.setValue('repositoryId', this.repositoryId)
    }

    this.options = [
      {
        value: '',
        name: 'Not selected. (blank issue)',
        checked: true,
      },
      ...this.templates,
    ].map((it: any) => ({
      value: it.value || it.name,
      label: it.name,
      ...(it.checked ? { checked: it.checked } : {}),
    }))

    this.reset()
    this.requestUpdate()
  }

  validate() {
    const form: any = this.formRef.value
    form?.handleValidate()
    this.requestUpdate()
    return form.errors
  }

  setValue(name: string, value: string) {
    const form: any = this.formRef.value
    form?.setValue(name, value)
  }

  handleCancel() {
    this.modal.store.setVisible(!this.modal.store.visible)
  }

  async handleSubmit(event: Event) {
    this.validate()

    if (!this.isValid) {
      return
    }

    const issueSubmit = new CustomEvent('submit', {
      detail: {
        repositoryId: this.values.repositoryId,
        title: this.values.title,
        body: [this.values.body, REPORT_BODY_TEMPLATE, this.app.store.config.insertFrom && REPORT_BODY_COPY]
          .filter(Boolean)
          .join('\n\n'),
        ...(this.selected ? { issueTemplate: this.selected } : {}),
      },
    })
    this.dispatchEvent(issueSubmit)
  }

  handleSelect(event: CustomEvent) {
    this.selected = event.detail.selected
    this.currentTemplate = this.templates.find((it: any) => it.name === this.selected) || null

    this.setValue('issueTemplate', this.selected)
    this.setValue('title', this.currentTemplate?.title || '')
    this.setValue('body', this.currentTemplate?.body || '')
    this.validate()
  }

  handleScreenShot(event: CustomEvent) {
    this.screenshot = event.detail.data
    // TODO file upload
    this.setValue(
      'body',
      [this.values?.body || '', '## Screenshot Data', `\`\`\`\n${this.screenshot}\n\`\`\``].join('\n')
    )
    this.requestUpdate()
  }

  onBlur(event: Event) {
    this.validate()
  }

  render() {
    return html` <form
      ${ref(this.formRef)}
      is="lite-form"
      .initialValues=${this.initialValues}
      .validationSchema=${toLiteFormValidationSchema(ReportValidate)}
      class="reportForm"
    >
      <div class="reportForm-item">
        <h2 class="reportForm-heading">ISSUE TEMPLATE</h2>
        <div class="reportForm-field">
          <ir-select
            title="${t('fields.template.placeholder') as unknown as string}"
            name="issueTemplate"
            .options="${this.options}"
            @change="${(event: CustomEvent) => this.handleSelect(event)}"
          ></ir-select>
          <div class="reportForm-caption">
            <p>${t('fields.template.description')}</p>
          </div>
        </div>
      </div>
      <!-- /.reportForm-item -->

      <div class="reportForm-item">
        <h2 class="reportForm-heading">TITLE<span class="reportForm-required">*</span></h2>
        <div class="reportForm-field">
          <lite-input
            name="title"
            placeholder="${t('fields.title.placeholder') as unknown as string}"
            .value="${this.values?.title || ''}"
            .error=${this.errors?.title || ''}
            @blur="${this.onBlur}"
          ></lite-input>
        </div>
      </div>
      <!-- /.reportForm-item -->

      <div class="reportForm-item">
        <div class="reportForm-header">
          <h2 class="reportForm-heading">BODY</h2>
          <ul class="reportForm-nav">
            <li>
              <ir-screenshot @screenshot="${this.handleScreenShot}">
                <ir-square-button>
                  <img src="${IconScreenShot}" alt="screenshot icon" width="18" height="18" />
                </ir-square-button>
              </ir-screenshot>
            </li>
          </ul>
        </div>
        <div class="reportForm-field">
          <lite-textarea
            name="body"
            value="${this.values?.body || ''}"
            placeholder="${t('fields.body.placeholder') as unknown as string}"
          ></lite-textarea>
        </div>
      </div>
      <!-- /.reportForm-item -->

      <div class="reportForm-buttons">
        <div class="reportForm-button">
          <ir-round-button modifier="cancel" @click="${this.handleCancel}">${t('ui.cancel.text')}</ir-round-button>
        </div>
        <div class="reportForm-button">
          <ir-round-button modifier="submit${this.loading ? ' disabled' : ''}" @click="${this.handleSubmit}"
            >${t('ui.submit.text')}</ir-round-button
          >
        </div>
      </div>
    </form>`
  }
}

customElements.define('ir-form', ReportForm)

declare global {
  interface HTMLElementTagNameMap {
    'ir-form': ReportForm
  }
}
