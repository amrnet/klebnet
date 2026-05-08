import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enTranslations from './locales/en.json';
import frTranslations from './locales/fr.json';
import ptTranslations from './locales/pt.json';
import esTranslations from './locales/es.json';

const resources = {
  en: {
    translation: enTranslations
  },
  fr: {
    translation: frTranslations
  },
  pt: {
    translation: ptTranslations
  },
  es: {
    translation: esTranslations
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    // Default to English. Detection order is localStorage (so the user's
    // explicit choice via the LanguageSwitcher persists across visits)
    // then htmlTag (which is `en`). Browser `navigator` language is
    // intentionally NOT consulted — that was making the dashboard render
    // in pt/es/fr for visitors with a non-English OS locale on first load.
    fallbackLng: 'en',
    supportedLngs: ['en', 'fr', 'pt', 'es'],
    debug: false,

    detection: {
      order: ['localStorage', 'htmlTag'],
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage'],
    },

    interpolation: {
      escapeValue: false // react already does escaping
    }
  });

export default i18n;
