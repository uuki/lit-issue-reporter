import { html, LitElement } from 'lit'
import { ref, createRef } from 'lit/directives/ref.js'
import { translate } from 'free-transform'

export type MovableState = {
  x: number
  y: number
}
export type MovableProps = {
  width?: string
  height?: string
}

export class Movable extends LitElement {
  state: MovableState = { x: 0, y: 0 }
  styles: MovableProps = {}

  private myRef = createRef<HTMLDivElement>()
  private child = createRef()
  static get properties() {
    return {
      styles: {
        type: Object,
      },
      modifier: {
        type: String,
      },
    }
  }

  private get slottedChildren() {
    const slot = this.shadowRoot?.querySelector('slot')
    return slot?.assignedElements({ flatten: true })
  }

  private onMouseDown = (event: MouseEvent) => {
    event.stopPropagation()

    const drag = translate(
      {
        x: this.state.x,
        y: this.state.y,
        startX: event.pageX,
        startY: event.pageY,
      },
      (payload: MovableState) => {
        this.state = { ...this.state, ...payload }
        this.myRef.value!.style.transform = `translate(${this.state.x}px, ${this.state.y}px)`
      }
    )

    const up = () => {
      document.removeEventListener('mousemove', drag)
      document.removeEventListener('mouseup', up)
    }

    document.addEventListener('mousemove', drag)
    document.addEventListener('mouseup', up)
  }

  constructor() {
    super()
  }

  firstUpdated() {
    const root = this.myRef.value
    const children = this.slottedChildren

    if (root && children?.length) {
      const target = children[0] as HTMLElement
      const { bottom, left } = getComputedStyle(target)

      root.style.width = this.styles.width || ''
      root.style.height = this.styles.height || ''
      root.style.userSelect = 'none'
      root.style.position = 'fixed'
      root.style.backfaceVisibility = 'hidden'
      root.style.bottom = bottom
      root.style.left = left

      target.style.bottom = 'auto'
      target.style.left = 'auto'

      root.addEventListener('mousedown', this.onMouseDown)
    }
    this.requestUpdate()
  }

  disconnectedCallback() {
    super.disconnectedCallback()
  }

  render() {
    return html`
      <div ${ref(this.myRef)}>
        <slot ${ref(this.child)}></slot>
      </div>
    `
  }
}

customElements.define('ir-movable', Movable)

declare global {
  interface HTMLElementTagNameMap {
    'ir-movable': Movable
  }
}
