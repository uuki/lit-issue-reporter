import ja from '@/locales/ja.json'
import en from '@/locales/en.json'

type TranslationData = {
  [key: string]: any
}

class TranslationManager {
  private translations: { [locale: string]: TranslationData } = {}
  private defaultLocale: string = 'ja'
  private currentLocale: string

  constructor(translations?: { [locale: string]: TranslationData }) {
    this.currentLocale = this.getBrowserLanguage()

    if (translations) {
      this.translations = translations
    }
  }

  private getBrowserLanguage(): string {
    const browserLang = navigator.language.split('-')[0]
    return browserLang || this.defaultLocale
  }

  public registerTranslation(locale: string, data: TranslationData): void {
    this.translations[locale] = data
  }

  public translate(key: string, locale?: string): string {
    const useLocale = locale || this.currentLocale
    const translationData = this.translations[useLocale] || this.translations[this.defaultLocale]

    if (!translationData) {
      console.warn(`Translation data for locale "${useLocale}" not found`)
      return key
    }

    const keyParts = key.split('.')
    let result: any = translationData

    for (const part of keyParts) {
      if (result && typeof result === 'object' && part in result) {
        result = result[part]
      } else {
        console.warn(`Translation key "${key}" not found for locale "${useLocale}"`)
        return key
      }
    }
    return typeof result === 'string' ? result : key
  }

  public setLocale(locale: string): void {
    if (this.translations[locale]) {
      this.currentLocale = locale
    } else {
      console.warn(`Locale "${locale}" is not registered`)
    }
  }

  public getAvailableLocales(): string[] {
    return Object.keys(this.translations)
  }
}

const translationManager = new TranslationManager({
  ja,
  en,
})

/**
 * 翻訳関数
 * @param key ドット記法のキー（例: 'errors.unknown'）
 * @param locale 任意で指定する言語
 * @returns 翻訳されたテキスト
 */
export function translate(key: string, locale?: string): string {
  return translationManager.translate(key, locale)
}

/**
 * 翻訳データを登録
 * @param locale 言語コード
 * @param data 翻訳データ
 */
export function registerTranslation(locale: string, data: TranslationData): void {
  translationManager.registerTranslation(locale, data)
}

/**
 * 現在の言語を設定
 * @param locale 言語コード
 */
export function setLocale(locale: string): void {
  translationManager.setLocale(locale)
}

/**
 * 利用可能な言語一覧を取得
 */
export function getAvailableLocales(): string[] {
  return translationManager.getAvailableLocales()
}
