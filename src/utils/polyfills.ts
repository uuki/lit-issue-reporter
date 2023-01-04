// import '@webcomponents/custom-elements'
// import ShadyDOM from '@webcomponents/shadydom'
// import * as ShadyDOM from '@webcomponents/shadydom/src/shadydom.js'
// console.log(ShadyDOM)
import '@webcomponents/webcomponentsjs'
import 'core-js/es/array'
import 'core-js/es/object'
import 'core-js/es/promise'
import 'core-js/es/reflect'
import 'core-js/es/symbol'

export interface Window {
  ShadyDOM?: {
    force?: boolean
  }
}

const initPolyfill = async () => {
  let polyfills = []

  // @ts-ignore
  if (!('attachShadow' in Element.prototype && 'getRootNode' in Element.prototype) || window.ShadyDOM?.force) {
    polyfills.push('sd')
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!window.customElements || (window.customElements as any).forcePolyfill) {
    polyfills.push('ce')
  }

  // NOTE: any browser that does not have template or ES6 features
  // must load the full suite of polyfills.
  if (
    !window.Promise ||
    !Array.from ||
    !window.URL ||
    !window.Symbol //||
    // needsTemplate
  ) {
    polyfills = ['sd-ce-pf']
  }
  const polyfillsPromise = polyfills.length
    ? Promise.all([
        import(`@webcomponents/webcomponentsjs/bundles/webcomponents-${polyfills.join('-')}.js`),
        // import(`lit/polyfill-support.js`),
      ])
    : Promise.resolve()

  polyfillsPromise.then(
    () => {
      Promise.resolve()
    }
    // Promise.all([
    //   getPreferredLocale().then((locale) => import(`./locales/${locale}.po`)),
    //   get<string>('theme').then(
    //     (storedTheme) => (document.body.dataset.theme = storedTheme || 'system'),
    //   ),
    //   import('./containers/shell/shell.component'),
    // ]),
  )
}

export default initPolyfill
