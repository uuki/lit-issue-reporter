/**
 * @see https://hasura.io/learn/graphql/vue/apollo-client/
 */
import { ApolloClient, createHttpLink, InMemoryCache, ApolloLink, from } from '@apollo/client/core'
import { onError } from '@apollo/client/link/error'
import { REPORTER_MOCKING } from '@/utils/env'
import { APP_PROVIDERS } from '@/constants'
import { translate as t } from '@/utils/i18n'

type HeadersProps = {
  [key: string]: string
}

type ErrorDetail = {
  type: string
  message: string
}

const FETCH_POLICY = REPORTER_MOCKING === 'false' ? 'no-cache' : 'cache-first'

// カスタムイベントの型定義
interface ApiErrorEvent extends CustomEvent {
  detail: {
    type: string
    message: string
    errors?: ErrorDetail[]
    raw?: any
  }
}

/**
 * Fine-grained PATとClassic PATの両方をサポートするための認証ヘッダー設定
 * どちらのトークンタイプでも同じAuthorizationヘッダーフォーマットを使用
 */
function getHeaders(token: string) {
  const headers: HeadersProps = {}
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
    // GitHubのAPIバージョンを明示的に指定
    headers['Accept'] = 'application/vnd.github.v4+json'
  }
  return headers
}

/**
 * エラーメッセージを作成
 */
function createErrorMessage(error: any): { message: string; type: string } {
  const unknownError = {
    type: 'unknown_error',
    message: error.message || t('errors.unknown'),
  }

  if (!error.graphQLErrors || !error.graphQLErrors.length) {
    return unknownError
  }

  const firstError = error.graphQLErrors[0]

  // possibility: scope
  if (firstError.type === 'FORBIDDEN') {
    return {
      type: 'permission_error',
      message: t('errors.forbidden'),
    }
  }

  // possibility: authentication
  if (firstError.type === 'UNAUTHORIZED') {
    return {
      type: 'auth_error',
      message: t('errors.unauthorized'),
    }
  }

  // possibility: not found
  if (firstError.type === 'NOT_FOUND' && firstError.path && firstError.path[0] === 'repository') {
    return {
      type: 'repository_error',
      message: JSON.stringify(t('errors.not_found')),
    }
  }

  // ネットワークエラー
  if (error.networkError) {
    if (error.networkError.statusCode === 401) {
      return {
        type: 'token_error',
        message: t('errors.invalid_token'),
      }
    }

    if (error.networkError.statusCode === 403) {
      return {
        type: 'restricted_error',
        message: t('errors.restricted'),
      }
    }

    return {
      type: 'network_error',
      message: `Network Error: ${error.networkError.message || 'Connection failed'}`,
    }
  }

  return unknownError
}

/**
 * カスタムエラーイベントをディスパッチする
 */
function dispatchErrorEvent(error: any) {
  const { type, message } = createErrorMessage(error)

  const errorDetails = error.graphQLErrors
    ? error.graphQLErrors.map((err: any) => ({ type: err.type, message: err.message }))
    : undefined

  const event = new CustomEvent('github-api-error', {
    bubbles: true,
    composed: true,
    detail: {
      type,
      message,
      errors: errorDetails,
      raw: error,
    },
  }) as ApiErrorEvent

  window.dispatchEvent(event)

  if (!import.meta.env.PROD) {
    console.error('GitHub API Error:', {
      type,
      message,
      raw: error,
    })
  }
}

// Create the apollo client
export function createApolloClient(token: string) {
  // HTTP connection to the API
  const httpLink = createHttpLink({
    // You should use an absolute URL here
    uri: APP_PROVIDERS.github.endpoint,
    fetch: (uri: RequestInfo, options: RequestInit) => {
      options.headers = getHeaders(token)
      return fetch(uri, options)
    },
  })

  // エラーハンドリングの拡張
  const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
    if (graphQLErrors || networkError) {
      dispatchErrorEvent({ graphQLErrors, networkError, operation })
    }
  })

  return new ApolloClient({
    link: from([errorLink, httpLink]),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: FETCH_POLICY,
      },
      query: {
        fetchPolicy: FETCH_POLICY,
        errorPolicy: 'all',
      },
    },
  })
}

// エラーイベントのタイプ宣言を拡張
declare global {
  interface WindowEventMap {
    'github-api-error': ApiErrorEvent
  }
}
