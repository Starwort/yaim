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
import React from "react";

export type Dict<V> = {
    [key: string]: V;
};
var _getTextWidthDiv: HTMLDivElement;
function setUpDiv() {
    _getTextWidthDiv = document.createElement("div");
    _getTextWidthDiv.style.position = 'absolute';
    _getTextWidthDiv.style.top = '-9999px';
    _getTextWidthDiv.style.left = '-9999px';
    // _getTextWidthDiv.ariaHidden = true;
    document.body.appendChild(_getTextWidthDiv);
    return _getTextWidthDiv;
}
export function getTextWidth(text: string) {
    var div = _getTextWidthDiv ?? (setUpDiv());
    div.innerText = text;
    return div.clientWidth;
}

export const root = '/';
export function getDefault<T>(data: string | undefined, defaultValue: T) {
    if (data !== undefined) {
        return JSON.parse(data) as T;  // todo: figure out how to type-check this
    } else {
        return defaultValue;
    }
}
export function valueOr(data: String | undefined, defaultValue: number) {
    let rv = data ? +data : defaultValue;
    if (!isNaN(rv)) {
        return rv;
    } else {
        return defaultValue;
    }
}
export function booleanOr(data: String | undefined, defaultValue: boolean) {
    switch (data) {
        case 'true':
            return true;
        case 'false':
            return false;
        default:
            return defaultValue;
    }
}

export function range(start: number, stop: number | undefined = undefined, step: number = 1): Array<number> {
    if (stop === undefined) {
        stop = start;
        start = 0;
        if (step == 1) {  // benefit from optimisation where I don't use two-arg range
            return Array.from(Array(stop).keys());
        }
    }
    return Array(
        Math.ceil((stop! - start) / step)
    ).fill(start).map((x, y) => x + y * step);
}

export function all(values: boolean[]) {
    return values.reduce((res, valid) => (res && valid), true);
}
export function any(values: boolean[]) {
    return values.reduce((res, valid) => (res || valid), false);
}

export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
export function clone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
}
export type Tuple<T extends unknown[]> = [...T];
export type SoA<T extends unknown[]> = {[I in keyof T]: T[I][]};
export function* zip<T extends unknown[]>(...arrays: SoA<T>) {
    if (arrays.length < 1) {
        return;
    }
    for (let i = 0; i < arrays.reduce((minLength, nextArr) => {
        let len = nextArr.length;
        return Math.min(minLength, len);
    }, Infinity); i++) {
        yield arrays.map((arr) => arr[i]) as Tuple<T>;
    }
}

export type Filter<T, V> = {
    [P in keyof T]: T[P] extends V ? never : T[P];
};

export function fsum(input: Array<number>) {
    // a translation of NeumaierSum
    // source: https://en.wikipedia.org/wiki/Kahan_summation_algorithm#Further_enhancements
    let sum = 0;
    let c = 0;  // A running compensation for lost low-order bits.
    for (let value of input) {
        let t = sum + value;
        if (Math.abs(sum) >= Math.abs(value)) {
            c += (sum - t) + value;  // If sum is bigger, low-order digits of value are lost
        } else {
            c += (value - t) + sum;  // Else low-order digits of sum are lost.
        }
        sum = t;
    }
    return sum + c;  // Correction only applied once in the very end.
}
export function useRerender() {
    const [, setTick] = React.useState(0);
    const update = React.useCallback(() => {
        setTick(tick => tick + 1);
    }, []);
    return update;
}

export type LoadedI18nRoot = {
    loaded: true;
    unsaved: boolean;
    langs: string[];
    master: string;
    masterKeys: Record<string, string[]>;
    namespaces: string[];
    data: Record<string, Namespaces>;
};
type UnloadedI18nRoot = {
    loaded: false;
};
export type I18nRoot = LoadedI18nRoot | UnloadedI18nRoot;

export type Namespaces = Record<string, FlatI18nData>;

export type FlatI18nData = Record<string, string>;
export type NestedI18nData = {
    [key: string]: NestedI18nData | string;
};

// type LoadedFileTreeFolder = {
//     loaded: true;
//     tree: {
//         [fileName: string]: FileTree;
//     };
// };
// type LoadedFileTreeFile = {
//     loaded: true;
//     keys: string[];
//     unsavedChanges: boolean;
//     lang: string;
//     content: I18nData;
// };
// type UnloadedFileTree = {
//     loaded: false;
// };

// export type FileTree = (
//     UnloadedFileTree
//     | LoadedFileTreeFolder
//     | LoadedFileTreeFile
// );
