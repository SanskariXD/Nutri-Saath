import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from '@/locales/en/translation.json';
import hi from '@/locales/hi/translation.json';
import kn from '@/locales/kn/translation.json';

const resources = {
  en: { translation: en },
  hi: { translation: hi },
  kn: { translation: kn },
};

const STORAGE_KEY = 'app.language';
const detectInitialLanguage = (): 'en' | 'hi' | 'kn' => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY) as 'en' | 'hi' | 'kn' | null;
    if (saved && ['en', 'hi', 'kn'].includes(saved)) return saved;
  } catch {}
  return 'en';
};

i18n.use(initReactI18next).init({
  resources,
  lng: detectInitialLanguage(),
  fallbackLng: 'en',
  supportedLngs: ['en', 'hi', 'kn'],
  interpolation: { escapeValue: false },
  load: 'languageOnly',
  preload: ['en', 'hi', 'kn'],
  react: { useSuspense: false },
});

export const setAppLanguage = async (lng: 'en' | 'hi' | 'kn') => {
  await i18n.changeLanguage(lng);
  try { localStorage.setItem(STORAGE_KEY, lng); } catch {}
};

export default i18n;