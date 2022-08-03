import type { Strings } from 'lit-translate'
import { ReactiveElement } from 'lit'
import { ApolloClient } from '@apollo/client/core'
import { Exome } from 'exome'

export type AppRoot = HTMLElement | null
export type Config = {
  token: string
  repository: string
  owner: string
  lang?: string
  localesLoader?: Promise<Strings>
  insertFrom?: boolean
}

class AppContext extends Exome {
  public root: AppRoot = null
  public context: ReactiveElement['renderRoot'] | null = null
  public apollo: ApolloClient<any> | null = null
  public config: Config = { token: '', repository: '', owner: '' }
  public loading: boolean = false
  public provider: 'github' = 'github' // Currently fixed value

  public setRoot(newValue: AppRoot) {
    this.root = newValue
  }

  public setContext(newValue: ReactiveElement['renderRoot']) {
    this.context = newValue
  }

  public setApolloClient(client: ApolloClient<any>) {
    this.apollo = client
  }

  public setConfig(newValue: Config) {
    this.config = { ...newValue }
  }

  public setLoading(newValue: boolean) {
    this.loading = newValue
  }
}
export const appContext = new AppContext()
