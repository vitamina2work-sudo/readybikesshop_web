import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import es from './locales/es.json'
import ca from './locales/ca.json'
import en from './locales/en.json'

export const supportedLanguages = ['es', 'ca', 'en'] as const
export type SupportedLanguage = (typeof supportedLanguages)[number]

const saved = localStorage.getItem('language')
const initialLanguage: SupportedLanguage =
  saved && supportedLanguages.includes(saved as SupportedLanguage)
    ? (saved as SupportedLanguage)
    : 'es'

i18n.use(initReactI18next).init({
  resources: {
    es: { translation: es },
    ca: { translation: ca },
    en: { translation: en },
  },
  lng: initialLanguage,
  fallbackLng: 'es',
  interpolation: { escapeValue: false },
})

i18n.on('languageChanged', (lng) => {
  localStorage.setItem('language', lng)
  document.documentElement.lang = lng
})

document.documentElement.lang = initialLanguage

export default i18n
