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
import AddIssueToProjectMutation from '@/graphql/github/mutations/addIssueToProject.mutation.graphql'
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
  createIssueMutation = new MutationController(this, CreateIssueMutation)
  addIssueToProjectMutation = new MutationController(this, AddIssueToProjectMutation)

  repository: { data: GetRepositoryQuery['repository']; loading: ApolloQueryResult<GetRepositoryQuery>['loading'] } = {
    data: null,
    loading: true,
  }
  error: ApolloError | undefined
  errors: ApolloQueryResult<GetRepositoryQuery>['errors']
  lastCreatedIssueId = ''
  lastCreatedIssueNodeId = ''

  // イベントハンドラーをバインド
  private boundHandleGitHubApiError: (event: CustomEvent) => void

  constructor() {
    super()
    this.boundHandleGitHubApiError = this.handleGitHubApiError.bind(this)
    window.addEventListener('github-api-error', this.boundHandleGitHubApiError)
  }

  /**
   * GitHub APIエラーイベントのハンドラー
   */
  handleGitHubApiError(event: CustomEvent): void {
    // イベントの詳細情報を取得
    const detail = event.detail as {
      type: string
      message: string
      errors?: Array<{ type: string; message: string }>
      raw?: any
    }

    const { message } = detail

    // エラータイプに応じて異なるアクションを実行
    this.showErrorToast(message)

    // ローディング状態をリセット
    this.app.store.setLoading(false)
  }

  /**
   * エラートーストを表示
   */
  showErrorToast(message: string, title = 'Error'): void {
    this.toastRef.value?.showToast(`${title}: ${message}`, this.app.store.config.noticeDuration || 8000, 'error')
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()
    // バインドした関数を使用して削除
    window.removeEventListener('github-api-error', this.boundHandleGitHubApiError)
  }

  firstUpdated(): void {
    this.query.update()
    this.createIssueMutation.update()
    this.addIssueToProjectMutation.update()
    this.fetch()
  }

  /**
   * プロジェクトへのIssue追加処理
   * @param issueId 追加するIssueのNode ID
   * @param projectIds 追加先プロジェクトIDの配列
   */
  async addIssueToProjects(issueId: string, projectIds: string[]): Promise<void> {
    if (!projectIds || projectIds.length === 0) return

    // 各プロジェクトに対して順番に処理
    for (const projectId of projectIds) {
      try {
        await this.addIssueToProjectMutation.mutate({
          variables: {
            projectId: projectId,
            contentId: issueId,
            clientMutationId: `add-issue-to-project-${Date.now()}`,
          },
        })
      } catch (err) {
        console.error(`Failed to add issue to project ${projectId}:`, err)
        // プロジェクト追加エラーの場合は処理を継続するが、警告を表示
        this.toastRef.value?.showToast(
          `Project addition error: The issue was created, but couldn't be added to the project.`,
          this.app.store.config.noticeDuration || 6000,
          'warning'
        )
      }
    }
  }

  async handleSubmit(event: CustomEvent): Promise<void> {
    this.app.store.setLoading(true)

    // イベントデータから必要な項目を抽出
    const { projectIds, ...issueData } = event.detail

    try {
      const { data } = (await this.createIssueMutation.mutate({
        variables: issueData,
      })) as any

      if (!data || !data.createIssue || !data.createIssue.issue) {
        throw new Error('Failed to create issue')
      }

      const issue = (data.createIssue as CreateIssuePayload).issue
      this.lastCreatedIssueId = issue?.number.toString() || ''
      this.lastCreatedIssueNodeId = issue?.id || ''

      if (projectIds && projectIds.length > 0) {
        await this.addIssueToProjects(this.lastCreatedIssueNodeId, projectIds)
      }

      // 通知表示とフォームリセット
      this.toastRef.value?.showToast(
        'Issue created #' + this.lastCreatedIssueId,
        this.app.store.config.noticeDuration || 4000,
        'success'
      )
      if (this.formRef.value?.reset) {
        this.formRef.value?.reset()
      }
      this.modal.store.setVisible(false)
    } catch (err) {
      console.error('Error creating issue:', err)
      // 特定のエラーはgithub-api-errorイベントでキャッチされるため、
      // ここでは一般的なエラーのみ処理する
      if (!(err as ApolloError).graphQLErrors && !(err as ApolloError).networkError) {
        this.toastRef.value?.showToast(
          `Issue creation error: ${(err as Error).message || 'Unknown error occurred'}`,
          this.app.store.config.noticeDuration || 6000,
          'error'
        )
      }
    } finally {
      this.app.store.setLoading(false)
    }
  }

  async fetch(): Promise<void> {
    try {
      const res = (await this.query.fetch({
        owner: this.app.store.config.owner,
        name: this.app.store.config.repository,
      })) as ApolloQueryResult<GetRepositoryQuery>

      // データなしエラーの処理
      if (!res.data || !res.data.repository) {
        throw new Error('Failed to fetch repository data')
      }

      const { data, loading } = res
      this.repository = { data: { ...data.repository! }, loading }
      this.requestUpdate()
    } catch (err) {
      // エラーはgithub-api-errorイベントでキャッチされるため、ここでは状態更新のみ行う
      if (err instanceof Error) {
        this.error = err as ApolloError
      } else if (err && typeof err === 'object' && 'errors' in err) {
        this.errors = (err as any).errors
      }
      this.requestUpdate()
    }
  }

  getForm() {
    if (this.error || this.errors) {
      return html`<div class="${APP_PREFIX}-reportLayout-error">
        <h2 class="${APP_PREFIX}-reportLayout-error-heading">${t('errors.connection')}</h2>
        <p>
          <code
            >${this.errors
              ? this.errors.map((x) => html`<span>${x.message}</span>`)
              : this.error?.message || this.error?.networkError?.message}</code
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
            .projects="${this.repository.data?.projectsV2?.nodes || []}"
          ></ir-form>
        `
  }

  handleToastClick(): void {
    // Issueが作成された場合のみリンクを開く
    if (!this.lastCreatedIssueId) return

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
