import { html, LitElement, css } from 'lit'
import { ref, createRef } from 'lit/directives/ref.js'
import { isTouchDevice } from '@/utils/device'

export type DraggableState = {
  current: {
    x: number
    y: number
  }
  min: {
    x: number
    y: number
  }
  limit: {
    x: number
    y: number
  }
  isTouchDevice: boolean
}

export type DraggableOptions = {
  handleSelector: string
  fixed: boolean
  initPosition: {
    x: number // 0-1
    y: number // 0-1
  }
}

export class DraggableLit extends LitElement {
  static styles = css`
    :host {
      display: block;
      position: absolute;
      width: auto;
      height: auto;
    }
    .draggable-root {
      width: 100%;
      height: 100%;
      position: relative;
    }
  `

  state: DraggableState = {
    current: {
      x: 0,
      y: 0,
    },
    min: {
      x: 0,
      y: 0,
    },
    limit: {
      x: 0,
      y: 0,
    },
    isTouchDevice: isTouchDevice() || false,
  }

  options: DraggableOptions = {
    handleSelector: '[data-draggable-handle]',
    fixed: false,
    initPosition: {
      x: 0.02,
      y: 0.92,
    },
  }

  private rootRef = createRef<HTMLDivElement>()
  private slotRef = createRef<HTMLSlotElement>()

  static get properties() {
    return {
      options: {
        type: Object,
      },
      state: {
        type: Object,
        state: true,
      },
    }
  }

  constructor() {
    super()
    this.bind()
  }

  private bind() {
    this.checkPosition = this.checkPosition.bind(this)
    this.updatePosition = this.updatePosition.bind(this)
    this.onPointerMove = this.onPointerMove.bind(this)
    this.onPointerUp = this.onPointerUp.bind(this)
    this.onTouchMove = this.onTouchMove.bind(this)
    this.onResize = this.onResize.bind(this)
  }

  private get dragTarget(): HTMLElement {
    const handleEl =
      this.rootRef.value
        ?.querySelector('slot')
        ?.assignedElements({ flatten: true })[0]
        ?.shadowRoot?.querySelector(this.options.handleSelector) || null
    return (handleEl || this.rootRef.value || this) as HTMLElement
  }

  private get slottedChildren() {
    const slot = this.shadowRoot?.querySelector('slot')
    return slot?.assignedElements({ flatten: true })
  }

  createRenderRoot() {
    const root = super.createRenderRoot()
    return root
  }

  firstUpdated() {
    requestAnimationFrame(() => {
      this.initializePosition()
      this.attachEventListeners()
    })
  }

  private initializePosition() {
    if (!this.rootRef.value) return

    this.onResize()

    const pos = this.checkPosition({
      x: window.innerWidth * this.options.initPosition.x,
      y: window.innerHeight * this.options.initPosition.y,
    })
    this.updatePosition(pos.x, pos.y)

    this.style.position = this.options.fixed ? 'fixed' : 'absolute'
    this.style.top = `${this.state.current.y}px`
    this.style.left = `${this.state.current.x}px`

    if (this.rootRef.value) {
      this.rootRef.value.classList.add('is-draggable-ready')
    }
  }

  private attachEventListeners() {
    this.dragTarget.addEventListener('pointermove', this.onPointerMove)
    this.dragTarget.addEventListener('pointerup', this.onPointerUp)
    this.dragTarget.addEventListener('touchmove', this.onTouchMove)
    window.addEventListener('resize', this.onResize)
  }

  disconnectedCallback() {
    super.disconnectedCallback()

    this.dragTarget.removeEventListener('pointermove', this.onPointerMove)
    this.dragTarget.removeEventListener('pointerup', this.onPointerUp)
    this.dragTarget.removeEventListener('touchmove', this.onTouchMove)
    window.removeEventListener('resize', this.onResize)
  }

  private onResize() {
    const target = (this.dragTarget || this.rootRef.value) as HTMLElement
    const targetWidth = target.offsetWidth
    const targetHeight = target.offsetHeight

    // ホスト要素のサイズを設定
    this.style.width = `${targetWidth}px`
    this.style.height = `${targetHeight}px`

    if (this.state.isTouchDevice) {
      this.state.min.x = targetWidth / 2
      this.state.min.y = targetHeight / 2
      this.state.limit.x = window.innerWidth - targetWidth / 2
      this.state.limit.y = window.innerHeight - targetHeight / 2
    } else {
      this.state.min.x = 0
      this.state.min.y = 0
      this.state.limit.x = window.innerWidth - targetWidth
      this.state.limit.y = window.innerHeight - targetHeight
    }

    const pos = this.checkPosition({ x: this.state.current.x, y: this.state.current.y })
    this.updatePosition(pos.x, pos.y)
  }

  private onTouchMove(e: TouchEvent) {
    if (!this.state.isTouchDevice) return

    if (!this.dataset.dragging) {
      this.dataset.dragging = 'true'
    }

    const touch = e.touches[0]
    const x = touch.pageX - window.scrollX
    const y = touch.pageY - window.scrollY

    const pos = this.checkPosition({ x, y })

    const children = this.slottedChildren
    if (!children || children.length === 0) return

    const firstChild = children[0] as HTMLElement
    this.updatePosition(
      pos.x - firstChild.offsetWidth / 2,
      pos.y - firstChild.offsetHeight + this.dragTarget.offsetHeight / 2
    )
    e.preventDefault()
    e.stopPropagation()
  }

  private onPointerMove(e: PointerEvent) {
    if (!e.buttons) {
      return
    }
    e.preventDefault()

    if (!this.dataset.dragging) {
      this.dataset.dragging = 'true'
    }

    const x = this.offsetLeft + e.movementX
    const y = this.offsetTop + e.movementY

    this.dragTarget.setPointerCapture(e.pointerId)

    const pos = this.checkPosition({ x, y })

    this.updatePosition(pos.x, pos.y)
  }

  private onPointerUp() {
    requestAnimationFrame(() => {
      this.dataset.dragging = ''
    })
  }

  private updatePosition(x: number, y: number) {
    this.state.current.x = x
    this.state.current.y = y

    this.draggable = false
    this.style.position = this.options.fixed ? 'fixed' : 'absolute'
    this.style.top = `${y}px`
    this.style.left = `${x}px`

    this.requestUpdate()
  }

  private checkPosition({ x, y, padding = 0 }: { x: number; y: number; padding?: number }) {
    return {
      x: x < this.state.min.x ? this.state.min.x + padding : x >= this.state.limit.x ? this.state.limit.x - padding : x,
      y: y < this.state.min.y ? this.state.min.y + padding : y >= this.state.limit.y ? this.state.limit.y - padding : y,
    }
  }

  render() {
    return html`
      <div ${ref(this.rootRef)} class="draggable-root">
        <slot ${ref(this.slotRef)}></slot>
      </div>
    `
  }
}

customElements.define('ir-draggable', DraggableLit)

declare global {
  interface HTMLElementTagNameMap {
    'ir-draggable': DraggableLit
  }
}
