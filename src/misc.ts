import React from "react";
import {TFunction} from "react-i18next";
import {numberFormatters} from "./i18n";

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

export const root = '/nookdata';
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

export const months = [
    "core:time.month.jan",
    "core:time.month.feb",
    "core:time.month.mar",
    "core:time.month.apr",
    "core:time.month.may",
    "core:time.month.jun",
    "core:time.month.jul",
    "core:time.month.aug",
    "core:time.month.sep",
    "core:time.month.oct",
    "core:time.month.nov",
    "core:time.month.dec",
];
export const weekdays = [
    "core:time.weekday.sun",
    "core:time.weekday.mon",
    "core:time.weekday.tue",
    "core:time.weekday.wed",
    "core:time.weekday.thu",
    "core:time.weekday.fri",
    "core:time.weekday.sat",
];
interface TimeFormatterSettings {
    twelveHour: boolean;
    precision: 'hour' | 'minute' | 'second';
}
interface DateFormatterSettings<Time> {
    longhand: boolean;
    includeYear: boolean;
    includeTime: Time;
}

export function formatTime(
    date: Date,
    t: TFunction<"core">,
    {twelveHour, precision}: TimeFormatterSettings
): string {
    const formatter = numberFormatters[t('core:misc.code')];
    if (twelveHour) {
        let hour = date.getHours() % 12;
        if (hour == 0) {
            hour = 12;
        }
        return t(
            `core:time.twelve_hour.${(
                date.getHours() < 12 ? 'am' : 'pm'
            )}`,
            {
                time: t(
                    `core:time.precision.${precision}`,
                    {
                        hour: formatter(hour),
                        minute: formatter(date.getMinutes()).padStart(2, '0'),
                        second: formatter(date.getSeconds()).padStart(2, '0'),
                    },
                ),
            },
        );
    } else {
        let minute = date.getMinutes();
        if (precision == 'hour') {
            precision = 'minute';
            minute = 0;
        }
        return t(
            `core:time.precision.${precision}`,
            {
                hour: formatter(date.getHours()).padStart(2, '0'),
                minute: formatter(minute).padStart(2, '0'),
                second: formatter(date.getSeconds()).padStart(2, '0'),
            },
        );
    }
}

export function formatDate(
    date: Date,
    t: TFunction<"core">,
    {longhand, includeYear, includeTime}: DateFormatterSettings<true>,
    timeFormatterSettings: TimeFormatterSettings,
): string;
export function formatDate(
    date: Date,
    t: TFunction<"core">,
    {longhand, includeYear, includeTime}: DateFormatterSettings<false>,
): string;
export function formatDate(
    date: Date,
    t: TFunction<"core">,
    {longhand, includeYear, includeTime}: DateFormatterSettings<boolean>,
    timeFormatterSettings?: TimeFormatterSettings,
): string {
    return t(
        `core:time.date.${(
            longhand ? 'long' : 'short'
        )}.${(
            includeYear ? 'full' : 'short'
        )}${(
            includeTime ? '_with_time' : ''
        )}`,
        {
            year: date.getFullYear(),
            shortYear: (date.getFullYear() % 100).toString().padStart(2, '0'),
            month: date.getMonth(),
            monthName: t(months[date.getMonth()] + '.long'),
            day: date.getDate(),
            weekday: t(weekdays[date.getDay()] + '.long'),
            time: includeTime ? formatTime(date, t, timeFormatterSettings!) : '',
        }
    );
}
export function useRerender() {
    const [, setTick] = React.useState(0);
    const update = React.useCallback(() => {
        setTick(tick => tick + 1);
    }, []);
    return update;
}

export type I18nData = {
    [key: string]: string | I18nData;
};

type LoadedFileTreeFolder = {
    loaded: true;
    tree: {
        [fileName: string]: FileTree;
    };
};
type LoadedFileTreeFile = {
    loaded: true;
    keys: string[];
    unsavedChanges: boolean;
    lang: string;
    content: I18nData;
};
type UnloadedFileTree = {
    loaded: false;
};

export type FileTree = (
    UnloadedFileTree
    | LoadedFileTreeFolder
    | LoadedFileTreeFile
);
