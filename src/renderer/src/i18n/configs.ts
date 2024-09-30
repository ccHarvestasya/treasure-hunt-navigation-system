import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import translation_na from './locales/na.json'
import translation_eu from './locales/eu.json'
import translation_fr from './locales/fr.json'
import translation_de from './locales/de.json'
import translation_cn from './locales/cn.json'
import translation_kr from './locales/kr.json'
import translation_ja from './locales/ja.json'

i18n
  .use(initReactI18next)
  .use(LanguageDetector) // ユーザーの言語設定を検知するために必要
  .init({
    fallbackLng: 'ja', // デフォルトの言語を設定
    returnEmptyString: false, // 空文字での定義を許可に
    resources: {
      // 辞書情報
      // 用意した翻訳ファイルを読み込む
      na: {
        translation: translation_na
      },
      eu: {
        translation: translation_eu
      },
      fr: {
        translation: translation_fr
      },
      de: {
        translation: translation_de
      },
      cn: {
        translation: translation_cn
      },
      kr: {
        translation: translation_kr
      },
      ja: {
        translation: translation_ja
      }
    },
    interpolation: {
      // 翻訳された文字列内のHTMLやReactコンポーネントをエスケープすることを無効に
      escapeValue: false
    },
    react: {
      // 指定したHTMLノードを翻訳時にそのまま保持して表示するための設定
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'span']
    }
  })

export default i18n
