import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import {initReactI18next} from 'react-i18next';

export const availableLocalisations = ['en', 'fr', 'ja'];

const jaCharMap: Record<string, string> = {
    '0': '０',
    '1': '１',
    '2': '２',
    '3': '３',
    '4': '４',
    '5': '５',
    '6': '６',
    '7': '７',
    '8': '８',
    '9': '９',
    'a': 'ａ',
    'b': 'ｂ',
    'c': 'ｃ',
    'd': 'ｄ',
    'e': 'ｅ',
    'f': 'ｆ',
};
export const numberFormatters: Record<string, (value: number | string) => string> = {
    'en': (value) => value.toString(),
    'fr': (value) => value.toString(),
    'ja': (value) => value.toString().replace(/[012456789abcdef]/g, (m) => jaCharMap[m]),
};

i18n.use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        backend: {loadPath: '/nookdata/assets/i18n/{{lng}}/{{ns}}.json'},
        fallbackLng: 'en',
        debug: process.env.NODE_ENV == 'development',

        interpolation: {
            escapeValue: false, // not needed for react as it escapes by default
        },
        react: {
            transSupportBasicHtmlNodes: true,
            transKeepBasicHtmlNodesFor: ['br', 'big', 'small', 'ruby', 'rt'],
        },
        supportedLngs: availableLocalisations,
        ns: 'core',
        defaultNS: 'core',
    });