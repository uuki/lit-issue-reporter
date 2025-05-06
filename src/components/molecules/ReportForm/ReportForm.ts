/**
 * @doc Hotfix to support Safari. Eventually, the form part may be implemented from scratch with cross-browser support.
 */
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
  private isSafari: boolean

  reset: null | (() => void) = null
  private app = new StoreController(this, appContext)
  private modal = new StoreController(this, modalContext)
  private formRef = createRef()
  private titleRef = createRef<HTMLInputElement>()
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
    // 標準フォーム使用時はスクラッチで値を取得
    if (this.isSafari && this.formRef.value) {
      const formValues: Record<string, any> = {
        repositoryId: this.repositoryId,
        title: '',
        body: '',
      }

      // フォーム要素から値を取得
      const formElement = this.formRef.value as HTMLFormElement
      const titleInput = formElement.querySelector('[name="title"]') as HTMLInputElement
      const bodyInput = formElement.querySelector('[name="body"]') as HTMLTextAreaElement

      if (titleInput) formValues.title = titleInput.value
      if (bodyInput) formValues.body = bodyInput.value

      return formValues
    }

    // 通常のlite-form
    return this.formRef.value && (this.formRef.value as any).values
  }

  get errors() {
    // Safariの場合はスクラッチでエラーを管理
    if (this.isSafari) {
      const errors: Record<string, string> = {}
      // タイトルの検証
      if (!this.values.title) {
        errors.title = 'Input of title is required.'
      }
      return errors
    }

    return this.formRef.value && (this.formRef.value as any).errors
  }

  get isValid() {
    // Safariの場合はスクラッチで検証
    if (this.isSafari) {
      return this.values.title && this.values.title.trim() !== ''
    }

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
    // Safariブラウザの検出
    this.isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
    if (this.isSafari) {
      console.log('Safari browser detected, using standard form implementation')
    }
  }

  firstUpdated() {
    this.reset = () => {
      if (this.isSafari) {
        // 標準フォームのリセット
        if (this.formRef.value) {
          ;(this.formRef.value as HTMLFormElement).reset()
        }
        this.setValue('repositoryId', this.repositoryId)
      } else {
        // lite-formのリセット
        ;(this.formRef.value as any).handleReset()
        this.setValue('repositoryId', this.repositoryId)
      }
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
    if (this.isSafari) {
      // スクラッチのバリデーション
      const titleInput = this.titleRef.value?.shadowRoot?.querySelector('input') as HTMLInputElement

      if (!titleInput) return

      if (!titleInput.value) {
        titleInput.classList.add('error')
        return false
      } else {
        titleInput.classList.remove('error')
      }
      return true
    } else {
      // 通常のlite-formバリデーション
      const form: any = this.formRef.value
      form?.handleValidate()
      this.requestUpdate()
      return form.errors
    }
  }

  setValue(name: string, value: string) {
    if (this.isSafari) {
      // Safariでの値設定
      const formElement = this.formRef.value as HTMLFormElement
      if (!formElement) return

      const input = formElement.querySelector(`[name="${name}"]`) as HTMLInputElement | HTMLTextAreaElement
      if (input) {
        input.value = value
      }
    } else {
      // 通常のlite-form値設定
      const form: any = this.formRef.value
      form?.setValue(name, value)
    }
  }

  handleCancel() {
    this.modal.store.setVisible(!this.modal.store.visible)
  }

  async handleSubmit(event: Event) {
    if (this.isSafari) {
      // Safariでは元のイベントを防止
      event.preventDefault()
    }

    // バリデーション実行
    const isValid = this.validate()

    if (!isValid) {
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

  // Safariで標準フォームをレンダリング
  renderStandardForm() {
    return html`
      <form ${ref(this.formRef)} @submit="${this.handleSubmit}" class="${APP_PREFIX}-reportForm">
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

        <div class="${APP_PREFIX}-reportForm-item">
          <h2 class="${APP_PREFIX}-reportForm-heading">
            TITLE<span class="${APP_PREFIX}-reportForm-required">*</span>
          </h2>
          <div class="${APP_PREFIX}-reportForm-field">
            <ir-input
              ${ref(this.titleRef)}
              name="title"
              placeholder="${t('fields.title.placeholder') as unknown as string}"
              .value="${this.values?.title || ''}"
              @blur="${this.onBlur}"
            ></ir-input>
          </div>
        </div>

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
            <ir-textarea
              name="body"
              .value="${this.values?.body || ''}"
              placeholder="${t('fields.body.placeholder') as unknown as string}"
            ></ir-textarea>
          </div>
        </div>

        <input type="hidden" name="repositoryId" .value="${this.repositoryId}" />

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
      </form>
    `
  }

  // lite-formでのレンダリング
  renderLiteForm() {
    return html`
      <form
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

        <div class="${APP_PREFIX}-reportForm-item">
          <h2 class="${APP_PREFIX}-reportForm-heading">
            TITLE<span class="${APP_PREFIX}-reportForm-required">*</span>
          </h2>
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
      </form>
    `
  }

  render() {
    return this.isSafari ? this.renderStandardForm() : this.renderLiteForm()
  }
}

customElements.define('ir-form', ReportForm)

declare global {
  interface HTMLElementTagNameMap {
    'ir-form': ReportForm
  }
}
