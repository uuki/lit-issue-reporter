import { ReactiveController, ReactiveControllerHost } from 'lit'
import { ApolloMutationController } from '@apollo-elements/core'
import { StoreController } from 'exome/lit'
import { appContext } from '@/contexts/app'

export class MutationController extends ApolloMutationController implements ReactiveController {
  host: ReactiveControllerHost
  private app = new StoreController(this.host, appContext)
  private readonly _render: () => void

  constructor(host: ReactiveControllerHost, mutate: any) {
    super(host, mutate)
    ;(this.host = host).addController(this)

    this._render = () => {
      this.host.requestUpdate()
    }
  }

  update() {
    if (!this.client) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
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
