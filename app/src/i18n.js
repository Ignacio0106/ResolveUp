import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(Backend) // carga archivos /public/locales/{lng}/{ns}.json
  .use(LanguageDetector) // detecta y persiste (configurable)
  .use(initReactI18next)
  .init({
    fallbackLng: 'es', // idioma por defecto si no hay traducción
    supportedLngs: ['es', 'en'],
    ns: ['common'], // namespaces (módulos)
    defaultNS: 'common',
    debug: false,
    detection: {
      order: ['querystring','localStorage','cookie','navigator','htmlTag','path','subdomain'],
      caches: ['localStorage','cookie'],
      cookieMinutes: 525600, // 1 año
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json'
    },
    interpolation: {
      escapeValue: false // react ya escapa
    }
  });

export default i18n;
