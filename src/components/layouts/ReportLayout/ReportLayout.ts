import type { GetRepositoryQuery, CreateIssuePayload } from '@/types/generated/graphql'
import type { ApolloError, ApolloQueryResult } from '@apollo/client'
import { unsafeCSS, LitElement } from 'lit'
import { ref, createRef } from 'lit/directives/ref.js'
import { translate as t } from 'lit-translate'
import { StoreController } from 'exome/lit'
import { appContext } from '@/contexts/app'
import { modalContext } from '@/contexts/modal'
import { html } from '@apollo-elements/lit-apollo'
import CreateIssueMutation from '@/graphql/github/mutations/createIssue.mutation.graphql'
import RepositoryQuery from '@/graphql/github/queries/repository.query.graphql'
import { QueryController, MutationController } from '@/features/github'
import { APP_PREFIX } from '@/utils/env'
import resetStyle from '@/styles/utils/reset.css'
import style from './ReportLayout.css'
import { Toast } from '@/components/functional/Toast/Toast'
import { ReportForm } from '@/components/molecules/ReportForm/ReportForm'
import { APP_PROVIDERS } from '@/constants'
import '@/components/functional/Toast/Toast'
import '@/components/molecules/ReportForm/ReportForm'
import '@/components/organisms/Modal/Modal'

export class ReportLayout extends LitElement {
  static styles = [unsafeCSS(resetStyle), unsafeCSS(style)]
  private formRef = createRef<ReportForm>()
  private toastRef = createRef<Toast>()
  private app = new StoreController(this, appContext)
  private modal = new StoreController(this, modalContext)

  query = new QueryController(this, RepositoryQuery)
  mutation = new MutationController(this, CreateIssueMutation)
  repository: { data: GetRepositoryQuery['repository']; loading: ApolloQueryResult<GetRepositoryQuery>['loading'] } = {
    data: null,
    loading: true,
  }
  error: ApolloError | undefined
  errors: ApolloQueryResult<GetRepositoryQuery>['errors']
  lastCreatedIssueId: string = ''

  constructor() {
    super()
  }

  firstUpdated() {
    this.query.update()
    this.mutation.update()
    this.fetch()
  }

  async handleSubmit(event: CustomEvent) {
    this.app.store.setLoading(true)

    const { data } = (await this.mutation
      .mutate({
        variables: event.detail,
      })
      .catch((err) => {
        console.error(err)
      })) as any
    const issue = (data.createIssue as CreateIssuePayload).issue

    this.app.store.setLoading(false)
    this.lastCreatedIssueId = issue?.number.toString() || ''
    this.toastRef.value?.showToast('Issue opened', this.app.store.config.noticeDuration || 4000)

    if (this.formRef.value?.reset) {
      this.formRef.value?.reset()
    }
    this.modal.store.setVisible(false)
  }

  async fetch() {
    const res = (await this.query
      .fetch({
        owner: this.app.store.config.owner,
        name: this.app.store.config.repository,
      })
      .catch((err) => {
        console.error(err)
        return err as ApolloError
      })) as ApolloQueryResult<GetRepositoryQuery | undefined> | ApolloError

    if (res instanceof Error) {
      this.error = res
    } else if (!res.data) {
      this.errors = res.errors
    }

    if (this.error || this.errors) {
      this.requestUpdate()
      return
    }

    const { data, loading } = res as ApolloQueryResult<GetRepositoryQuery>

    this.repository = { data: { ...data.repository! }, loading }
    this.requestUpdate()
  }

  getForm() {
    if (this.error || this.errors) {
      return html`<div class="${APP_PREFIX}-reportLayout-error">
        <h2 class="${APP_PREFIX}-reportLayout-error-heading">${t('errors.connection')}</h2>
        <p>
          <code
            >${this.errors
              ? this.errors.map((x) => html`<span>${x.message}</span>`)
              : this.error?.networkError?.message}</code
          >
        </p>
      </div>`
    }

    // TODO Spinner
    return this.repository.loading
      ? html`...loading`
      : html`
          <ir-form
            ${ref(this.formRef)}
            @submit="${this.handleSubmit}"
            .repositoryId=${this.repository.data?.id || ''}
            .templates="${this.repository.data?.issueTemplates || []}"
            .loading=${this.app.store.loading}
          ></ir-form>
        `
  }

  handleToastClick() {
    const provider = APP_PROVIDERS[this.app.store.provider]
    let issueURL

    if (this.app.store.provider === 'github') {
      issueURL = `${provider.domain}/${this.app.store.config.owner}/${this.app.store.config.repository}/issues/${this.lastCreatedIssueId}`
    }
    window.open(issueURL, '_blank')
  }

  render() {
    return html`<ir-modal .visible="${this.modal.store.visible}">
        <div class="${APP_PREFIX}-reportLayout-header">
          <h1 class="${APP_PREFIX}-reportLayout-heading">${t('app.title')}</h1>
          <p>${t('app.overview')}</p>
        </div>
        ${this.getForm()} </ir-modal
      ><ir-toast ${ref(this.toastRef)} modifier="link" @click=${this.handleToastClick}></ir-toast>`
  }
}

customElements.define('ir-report-layout', ReportLayout)

declare global {
  interface HTMLElementTagNameMap {
    'ir-report-layout': ReportLayout
  }
}
