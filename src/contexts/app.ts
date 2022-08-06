import type { StringsLoader } from 'lit-translate'
import { ReactiveElement } from 'lit'
import { ApolloClient } from '@apollo/client/core'
import { Exome } from 'exome'
import { APP_OPTIONS } from '@/constants'

export type AppRoot = HTMLElement | null
export type ReporterConfig = Config & Partial<Options>
export type Config = {
  token: string
  repository: string
  owner: string
}
export type Options = {
  noticeDuration: number
  lang: string
  stringsLoader: StringsLoader | null
  insertFrom: boolean
}

class AppContext extends Exome {
  public root: AppRoot = null
  public context: ReactiveElement['renderRoot'] | null = null
  public apollo: ApolloClient<any> | null = null
  public config: Config & Options = {
    token: '',
    repository: '',
    owner: '',
    ...APP_OPTIONS,
  }
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

  public setConfig(newValue: ReporterConfig) {
    this.config = { ...APP_OPTIONS, ...newValue }
  }

  public setLoading(newValue: boolean) {
    this.loading = newValue
  }
}
export const appContext = new AppContext()
