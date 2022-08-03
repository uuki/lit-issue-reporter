import { html, LitElement } from 'lit'
import { translate as t } from 'lit-translate'
import { takeScreenshot, checkIfBrowserSupported } from '@xata.io/screenshot'
import { StoreController } from 'exome/lit'
import { appContext } from '@/contexts/app'
import { emit } from '@/utils/event'

export type ScreenShotProps = {
  quality?: number
  onCaptureStart?: () => Promise<void>
  onCaptureEnd?: () => Promise<void>
  type?: 'image/jpeg' | 'image/png'
}

export class ScreenShot extends LitElement {
  options: ScreenShotProps

  private app = new StoreController(this, appContext)
  private browserSupported: boolean = false
  private screenShot: string = ''
  static get properties() {
    return {
      options: {
        type: Object,
      },
    }
  }

  constructor() {
    super()
    this.options = {}
  }

  firstUpdated() {
    this.browserSupported = checkIfBrowserSupported()
  }

  beforeCapture() {
    if (this.app.store.root) {
      this.app.store.root.style.opacity = '0'
    }
  }

  afterCapture() {
    if (this.app.store.root) {
      this.app.store.root.style.opacity = ''
    }
  }

  async handleCapture() {
    let hasError = false

    if (!this.browserSupported) {
      console.error('Media Capture and Streams API not supported')
      return
    }

    this.beforeCapture()

    /**
     * This is a base64-encoded string representing your screenshot.
     */
    this.screenShot = await takeScreenshot({ ...this.options }).catch((err) => {
      console.error(err)
      hasError = true
      return err
    })

    this.afterCapture()

    if (!hasError) {
      emit(this, 'screenshot', {
        detail: {
          data: this.screenShot,
        },
      })
    }
  }

  render() {
    return html` <div title="${t('ui.screenshot.title') as unknown as string}" @click="${this.handleCapture}">
      <slot></slot>
    </div>`
  }
}

customElements.define('ir-screenshot', ScreenShot)

declare global {
  interface HTMLElementTagNameMap {
    'ir-screenshot': ScreenShot
  }
}
