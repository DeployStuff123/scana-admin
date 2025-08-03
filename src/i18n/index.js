import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import dashboardEN from './locales/en/dashboard.json';
import loginEN from './locales/en/login.json';
import redirectLinksEN from './locales/en/redirectLinks.json';
import followUpEN from './locales/en/follow_up.json';

import dashboardES from './locales/es/dashboard.json';
import loginES from './locales/es/login.json';
import redirectLinksES from './locales/es/redirectLinks.json';
import followUpES from './locales/es/follow_up.json';
import settingEN from './locales/en/setting.json';
import settingES from './locales/es/setting.json';
import userListEN from './locales/en/userList.json';
import userListES from './locales/es/userList.json';
import redirectLinkDetailsEN from './locales/en/redirectLinkDetails.json';
import redirectLinkDetailsES from './locales/es/redirectLinkDetails.json';
import userDetailsEN from './locales/en/userDetails.json';
import userDetailsES from './locales/es/userDetails.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    ns: ['dashboard', 'userList', 'login', 'redirectLinks', 'followUp', 'setting', 'redirectLinkDetails', 'userDetails' ],
    defaultNS: 'dashboard',
    resources: {
      en: {
        dashboard: dashboardEN,
        userList: userListEN,
        userDetails: userDetailsEN,
        login: loginEN,
        redirectLinks: redirectLinksEN,
        followUp: followUpEN,
        setting: settingEN,
        redirectLinkDetails: redirectLinkDetailsEN,
      },
      es: {
        dashboard: dashboardES,
        userList: userListES,
        userDetails: userDetailsES,
        login: loginES,
        redirectLinks: redirectLinksES,
        followUp: followUpES,
        setting: settingES,
        redirectLinkDetails: redirectLinkDetailsES,
      },
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;

