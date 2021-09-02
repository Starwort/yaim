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
import {ListItem, ListItemIcon, ListItemText} from "@material-ui/core";
import {Add, Folder, Save, Settings} from "@material-ui/icons";
import i18n from 'i18next';
import {useCallback} from "react";
import {useTranslation} from "react-i18next";
import {Link, useLocation} from 'react-router-dom';
import type {I18nData, I18nRoot, LoadedI18nRoot, Namespaces} from "../misc";

const {t} = i18n;

async function extractData(directory: FileSystemDirectoryHandle): Promise<Namespaces> {
    let rv: Namespaces = {};
    for await (let [namespace, handle] of directory.entries()) {
        if (handle.kind !== 'file') {
            continue;
        }
        rv[namespace.replace(/\.json$/, '')] = JSON.parse(await (await handle.getFile()).text());
    }
    return rv;
}

export function flatten(data: I18nData): string[] {
    let rv = [];
    for (let [key, values] of Object.entries(data)) {
        if (typeof values === 'string') {
            rv.push(key);
        } else {
            for (let innerKey of flatten(values)) {
                rv.push(`${key}.${innerKey}`);
            }
        }
    }
    return rv;
}
// export function unFlatten(data: FlatI18nData): NestedI18nData {
//     let rv: NestedI18nData = {};
//     for (let [key, value] of Object.entries(data)) {
//         let dest = rv;
//         for (let part of key.split('.').slice(0, -1)) {
//             if (!(part in dest)) {
//                 dest[part] = {};
//             }
//             dest = dest[part] as NestedI18nData;
//         }
//         dest[key.split('.').at(-1)] = value;
//     }
//     return rv;
// }

async function loadI18nData(): Promise<I18nRoot> {
    let dir: FileSystemDirectoryHandle;
    try {
        dir = await window.showDirectoryPicker();
    } catch {
        return {
            loaded: false,
        };
    }
    let data: LoadedI18nRoot = {
        loaded: true,
        data: {},
        master: 'en',
        masterKeys: {},
        namespaces: [],
        langs: [],
        unsaved: false,
    };
    let master: string | undefined;
    for await (let [name, contents] of dir.entries()) {
        if (contents.kind !== 'directory') {
            continue;
        }
        if (master === undefined) {
            master = name;
        }
        data.langs.push(name);
        data.data[name] = await extractData(contents);
    }
    if (master !== undefined) {
        data.namespaces = Object.keys(data.data[master]);
        data.master = master;
        data.masterKeys = data.data[master];
        for (let lang of data.langs) {
            for (let namespace of data.namespaces) {
                data.data[lang][namespace] = data.data[lang][namespace] ?? {};
            }
        }
    }
    return data;
}

async function saveData(i18nData: LoadedI18nRoot, setI18nData: (i18nData: I18nRoot) => void) {
    let dir: FileSystemDirectoryHandle;
    try {
        dir = await window.showDirectoryPicker();
        if (await dir.queryPermission({mode: 'readwrite'}) !== 'granted') {
            if (await dir.requestPermission({mode: 'readwrite'}) !== 'granted') {
                console.warn(t('core:save.warn.no_permission'));
                alert(t('core:save.warn.alert'));
                return;
            }
        }
    } catch {
        return;
    }
    let hadProblems = false;
    for (let lang of i18nData.langs) {
        let langDir: FileSystemDirectoryHandle;
        try {
            langDir = await dir.getDirectoryHandle(lang, {create: true});
        } catch (error) {
            console.warn(t('core:save.warn.language_fail', {lang, error}));
            hadProblems = true;
            continue;
        }
        for (let ns of i18nData.namespaces) {
            let data = Object.fromEntries(
                Object.entries(i18nData.data[lang][ns]).filter(
                    ([key, value]) => (key in i18nData.masterKeys[ns] && value)
                )
            );
            try {
                let file = await langDir.getFileHandle(`${ns}.json`, {create: true});
                let writeableStream = await file.createWritable();
                await writeableStream.write(JSON.stringify(data));
                await writeableStream.close();
            } catch (error) {
                console.warn(t('core:save.warn.namespace_fail', {lang, ns, error}));
                hadProblems = true;
            }
        }
    }
    if (hadProblems) {
        alert(t('core:save.warn.alert'));
    } else {
        setI18nData({...i18nData, unsaved: false});
    }
}

interface FileTreeProps {
    i18nData: I18nRoot;
    setI18nData: (value: I18nRoot) => void;
}
export function FileTree({i18nData, setI18nData}: FileTreeProps) {
    const {t} = useTranslation('core');
    const createNamespace = useCallback(
        () => {
            const loadedI18nData = {...i18nData, unsaved: true} as LoadedI18nRoot;
            let newNS = t('core:new.namespace');
            if (newNS in loadedI18nData.namespaces) {
                for (let i = 0; ; i++) {
                    if (!(`${newNS}_${i}` in loadedI18nData.namespaces)) {
                        newNS = `${newNS}_${i}`;
                        break;
                    }
                }
            }
            loadedI18nData.namespaces.push(newNS);
            for (let lang of loadedI18nData.langs) {
                loadedI18nData.data[lang][newNS] = {};
            }
            setI18nData(loadedI18nData);
        },
        [i18nData, setI18nData, t],
    );
    const {pathname} = useLocation();
    const loaded = pathname.replace(/^\//, '');
    if (!i18nData.loaded) {
        return <ListItem
            button
            onClick={async () => setI18nData(await loadI18nData())}
        >
            <ListItemIcon><Add /></ListItemIcon>
            <ListItemText>{t('core:sidebar.load_data')}</ListItemText>
        </ListItem>;
    }
    return <>
        <ListItem
            button
            component={Link}
            to='/'
            selected={!loaded}
        >
            <ListItemIcon>
                <Settings />
            </ListItemIcon>
            <ListItemText>
                {t('core:sidebar.project_settings')}
            </ListItemText>
        </ListItem>
        {i18nData.namespaces.map(namespace => <ListItem
            button
            component={Link}
            key={namespace}
            to={namespace}
            selected={namespace === loaded}
        >
            <ListItemIcon>
                <Folder />
            </ListItemIcon>
            <ListItemText>
                {namespace}
            </ListItemText>
        </ListItem>)}
        <ListItem button onClick={createNamespace}>
            <ListItemIcon>
                <Add />
            </ListItemIcon>
            <ListItemText>
                {t('core:sidebar.create_namespace')}
            </ListItemText>
        </ListItem>
        {i18nData.unsaved && <ListItem button onClick={() => saveData(i18nData, setI18nData)}>
            <ListItemIcon>
                <Save />
            </ListItemIcon>
            <ListItemText>
                {t('core:sidebar.save_project')}
            </ListItemText>
        </ListItem>}
    </>;
}
