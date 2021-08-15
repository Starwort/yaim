/* Copyright (c) 2021 Starwort
 *
 * This copyright notice may not be removed from this source code file as
 * all rights are reserved by the original author.
 *
 * This file is part of YAIM.
 *
 * YAIM is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * YAIM is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with YAIM. If not, see <https://www.gnu.org/licenses/>.
 */
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import {initReactI18next} from 'react-i18next';

export const availableLocalisations = ['en'];

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
        backend: {loadPath: './assets/i18n/{{lng}}/{{ns}}.json'},
        fallbackLng: 'en',
        debug: process.env.NODE_ENV === 'development',

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
