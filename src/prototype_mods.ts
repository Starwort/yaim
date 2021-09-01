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
import {ThemeName} from "./themes";

declare global {
    interface String {
        capitalise: () => String;
    }
    interface Array<T> {
        rotated: (by: number) => Array<T>;
        rotate: (by: number) => Array<T>;
        count: (elem: T) => number;
        at: (pos: number) => T;
    }
}
// eslint-disable-next-line no-extend-native
String.prototype.capitalise = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
};
// eslint-disable-next-line no-extend-native
Array.prototype.rotated = function (by: number) {
    by = by % this.length;
    return this.slice(by, this.length).concat(this.slice(0, by));
};
// eslint-disable-next-line no-extend-native
Array.prototype.rotate = function (by: number) {
    by = by % this.length;
    while (this.length && by < 0) by += this.length;
    this.push.apply(this, this.splice(0, by));
    return this;
};
// eslint-disable-next-line no-extend-native
Array.prototype.count = function (elem) {
    return this.filter(item => item === elem).length;
};

declare module "@material-ui/core/styles/createTheme" {
    interface Theme {
        name: ThemeName;
    }
}

export {};
