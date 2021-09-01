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
import {useCallback} from "react";
import {Link, useLocation} from 'react-router-dom';
import type {FlatI18nData, I18nRoot, LoadedI18nRoot, Namespaces, NestedI18nData} from "../misc";

async function extractData(directory: FileSystemDirectoryHandle): Promise<Namespaces> {
    let rv: Namespaces = {};
    for await (let [namespace, handle] of directory.entries()) {
        if (handle.kind !== 'file') {
            continue;
        }
        rv[namespace.replace(/\.json$/, '')] = flatten(JSON.parse(await (await handle.getFile()).text()));
    }
    return rv;
}

function flatten(data: NestedI18nData): FlatI18nData {
    let rv: FlatI18nData = {};
    for (let [key, values] of Object.entries(data)) {
        if (typeof values === 'string') {
            rv[key] = values;
        } else {
            for (let [innerKey, value] of Object.entries(flatten(values))) {
                rv[`${key}.${innerKey}`] = value;
            }
        }
    }
    return rv;
}
function unFlatten(data: FlatI18nData): NestedI18nData {
    let rv: NestedI18nData = {};
    for (let [key, value] of Object.entries(data)) {
        let dest = rv;
        for (let part of key.split('.').slice(0, -1)) {
            if (!(part in dest)) {
                dest[part] = {};
            }
            dest = dest[part] as NestedI18nData;
        }
        dest[key.split('.').at(-1)] = value;
    }
    return rv;
}

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
        data.masterKeys = Object.fromEntries(
            Object.entries(data.data[master]).map(
                ([name, data]) => ([name, Object.keys(data)])
            )
        );
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
                console.warn('Could not save as permission was denied!');
                alert('There were problems saving the data. Please check the console (Ctrl+Shift+I) for more information');
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
            console.warn(`Failed to save language ${lang}: ${error}`);
            hadProblems = true;
            continue;
        }
        for (let ns of i18nData.namespaces) {
            let data = i18nData.data[lang][ns];
            try {
                let file = await langDir.getFileHandle(`${ns}.json`, {create: true});
                let writeableStream = await file.createWritable();
                await writeableStream.write(JSON.stringify(unFlatten(data)));
                await writeableStream.close();
            } catch (error) {
                console.warn(`Failed to save language ${lang} namespace ${ns}: ${error}`);
                hadProblems = true;
            }
        }
    }
    if (hadProblems) {
        alert('There were problems saving the data. Please check the console (Ctrl+Shift+I) for more information');
    } else {
        setI18nData({...i18nData, unsaved: false});
    }
}

interface FileTreeProps {
    i18nData: I18nRoot;
    setI18nData: (value: I18nRoot) => void;
}
export function FileTree({i18nData, setI18nData}: FileTreeProps) {
    const createNamespace = useCallback(
        () => {
            const loadedI18nData = {...i18nData, unsaved: true} as LoadedI18nRoot;
            let newNS = 'new_namespace';
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
        [i18nData, setI18nData],
    );
    const {pathname} = useLocation();
    const loaded = pathname.replace(/^\//, '');
    if (!i18nData.loaded) {
        return <ListItem button onClick={async () => setI18nData(await loadI18nData())}>
            <ListItemIcon><Add /></ListItemIcon>
            <ListItemText>Load data</ListItemText>
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
                Project settings
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
                Create namespace
            </ListItemText>
        </ListItem>
        {i18nData.unsaved && <ListItem button onClick={() => saveData(i18nData, setI18nData)}>
            <ListItemIcon>
                <Save />
            </ListItemIcon>
            <ListItemText>
                Save project
            </ListItemText>
        </ListItem>}
    </>;
}
