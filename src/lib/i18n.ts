import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import ptTranslation from '../locales/pt/translation.json';
import enTranslation from '../locales/en/translation.json';

const resources = {
  pt: {
    translation: ptTranslation
  },
  en: {
    translation: enTranslation
  }
};

// Create i18n instance without initializing it
const i18nInstance = i18n.createInstance();

// Initialize i18n only on client side
export const initI18n = () => {
  if (typeof window !== 'undefined' && !i18nInstance.isInitialized) {
    i18nInstance
      .use(LanguageDetector)
      .use(initReactI18next)
      .init({
        resources,
        fallbackLng: 'pt',
        debug: process.env.NODE_ENV === 'development',
        
        interpolation: {
          escapeValue: false, // React already does escaping
        },

        detection: {
          order: ['localStorage', 'navigator', 'htmlTag'],
          caches: ['localStorage'],
        }
      });
  }
  return i18nInstance;
};

export default i18nInstance;