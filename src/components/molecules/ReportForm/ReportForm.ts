import type { IssueTemplate, ProjectV2 } from '@/types/generated/graphql'
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
import { APP_PREFIX } from '@/utils/env'
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
  projects: ProjectV2[]
  currentTemplate: IssueTemplate | null
  selectedTemplate: IssueTemplate['name']
  selectedProjects: string[]
  templateOptions: SelectProps[]
  projectOptions: SelectProps[]
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
      projects: {
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
    this.selectedTemplate = ''
    this.selectedProjects = []
    this.currentTemplate = null
    this.templateOptions = []
    this.projectOptions = []
    this.templates = []
    this.projects = []
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
      this.selectedProjects = []
    }

    // テンプレートのオプション設定
    this.templateOptions = [
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

    // プロジェクトのオプション設定
    this.projectOptions =
      this.projects?.map((project: any) => ({
        value: project.id,
        label: project.title || project.name,
        checked: false,
      })) || []

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
        ...(this.selectedTemplate ? { issueTemplate: this.selectedTemplate } : {}),
        ...(this.selectedProjects.length > 0 ? { projectIds: this.selectedProjects } : {}),
      },
    })
    this.dispatchEvent(issueSubmit)
  }

  handleTemplateSelect(event: CustomEvent) {
    this.selectedTemplate = event.detail.selected
    this.currentTemplate = this.templates.find((it: any) => it.name === this.selectedTemplate) || null

    this.setValue('issueTemplate', this.selectedTemplate)
    this.setValue('title', this.currentTemplate?.title || '')
    this.setValue('body', this.currentTemplate?.body || '')
    this.validate()
  }

  handleProjectsSelect(event: CustomEvent) {
    this.selectedProjects = event.detail.selected
    this.requestUpdate()
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
      class="${APP_PREFIX}-reportForm"
    >
      <div class="${APP_PREFIX}-reportForm-item">
        <h2 class="${APP_PREFIX}-reportForm-heading">ISSUE TEMPLATE</h2>
        <div class="${APP_PREFIX}-reportForm-field">
          <ir-select
            title="${t('fields.template.placeholder') as unknown as string}"
            name="issueTemplate"
            .options="${this.templateOptions}"
            @change="${(event: CustomEvent) => this.handleTemplateSelect(event)}"
          ></ir-select>
          <div class="${APP_PREFIX}-reportForm-caption">
            <p>${t('fields.template.description')}</p>
          </div>
        </div>
      </div>
      <!-- /.reportForm-item -->

      <!-- プロジェクト選択 -->
      ${this.projectOptions.length
        ? html`
            <div class="${APP_PREFIX}-reportForm-item">
              <h2 class="${APP_PREFIX}-reportForm-heading">PROJECT</h2>
              <div class="${APP_PREFIX}-reportForm-field">
                <ir-select
                  title="${t('fields.project.placeholder') as unknown as string}"
                  name="projectId"
                  .options="${this.projectOptions}"
                  multiple
                  @change="${(event: CustomEvent) => this.handleProjectsSelect(event)}"
                ></ir-select>
                <div class="${APP_PREFIX}-reportForm-caption">
                  <p>${t('fields.project.description')}</p>
                </div>
              </div>
            </div>
          `
        : ''}
      <!-- /.reportForm-item -->

      <div class="${APP_PREFIX}-reportForm-item">
        <h2 class="${APP_PREFIX}-reportForm-heading">TITLE<span class="${APP_PREFIX}-reportForm-required">*</span></h2>
        <div class="${APP_PREFIX}-reportForm-field">
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

      <div class="${APP_PREFIX}-reportForm-item">
        <div class="${APP_PREFIX}-reportForm-header">
          <h2 class="${APP_PREFIX}-reportForm-heading">BODY</h2>
          <ul class="${APP_PREFIX}-reportForm-nav">
            <li>
              <ir-screenshot @screenshot="${this.handleScreenShot}">
                <ir-square-button>
                  <img src="${IconScreenShot}" alt="screenshot icon" width="18" height="18" />
                </ir-square-button>
              </ir-screenshot>
            </li>
          </ul>
        </div>
        <div class="${APP_PREFIX}-reportForm-field">
          <lite-textarea
            name="body"
            value="${this.values?.body || ''}"
            placeholder="${t('fields.body.placeholder') as unknown as string}"
          ></lite-textarea>
        </div>
      </div>
      <!-- /.reportForm-item -->

      <div class="${APP_PREFIX}-reportForm-buttons">
        <div class="${APP_PREFIX}-reportForm-button">
          <ir-round-button modifier="cancel" @click="${this.handleCancel}">${t('ui.cancel.text')}</ir-round-button>
        </div>
        <div class="${APP_PREFIX}-reportForm-button">
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
