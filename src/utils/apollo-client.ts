/**
 * @see https://hasura.io/learn/graphql/vue/apollo-client/
 */
import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client/core'
import { onError } from '@apollo/client/link/error'
import { REPORTER_MOCKING } from '@/utils/env'
import { APP_PROVIDERS } from '@/constants'

type HeadersProps = {
  [key: string]: string
}

const FETCH_POLICY = REPORTER_MOCKING === 'false' ? 'no-cache' : 'cache-first'

function getHeaders(token: string) {
  const headers: HeadersProps = {}
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  return headers
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
  const errorLink = onError((error) => {
    if (!import.meta.env.PROD) {
      console.error(error)
    }
  })

  return new ApolloClient({
    link: errorLink.concat(httpLink),
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
