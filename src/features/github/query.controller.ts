// import type { ApolloQueryResult } from '@apollo/client'
import { ReactiveController, ReactiveControllerHost } from 'lit'
import { StoreController } from 'exome/lit'
import { appContext } from '@/contexts/app'
import { ApolloQuery } from '@apollo-elements/lit-apollo'

export class QueryController<D, V> extends ApolloQuery implements ReactiveController {
  host: ReactiveControllerHost
  query: any

  private app = new StoreController(this, appContext)
  private readonly _render: () => void

  constructor(host: ReactiveControllerHost, query: D, variables?: V) {
    super()
    ;(this.host = host).addController(this)

    this.options.errorPolicy = 'all'
    this.options.fetchPolicy = 'cache-first'

    this.query = query

    if (variables) {
      this.variables = variables
    }

    this._render = () => {
      this.host.requestUpdate()
    }
  }

  fetch(variables?: V) {
    this.variables = variables || this.variables
    this.subscribe()
    return this.refetch()
  }

  update() {
    if (!this.client) {
      this.client = this.app.store.apollo
    }
  }

  hostConnected() {
    this._render()
  }

  hostDisconnected() {
    this._render()
  }
}

customElements.define('query-controller', QueryController)
