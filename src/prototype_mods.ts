import {ThemeName} from "./themes";

declare global {
    interface String {
        capitalise: () => String;
    }
    interface Array<T> {
        rotated: (by: number) => Array<T>;
        rotate: (by: number) => Array<T>;
        count: (elem: T) => number;
    }
}
String.prototype.capitalise = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
};
Array.prototype.rotated = function (by: number) {
    by = by % this.length;
    return this.slice(by, this.length).concat(this.slice(0, by));
};
Array.prototype.rotate = function (by: number) {
    by = by % this.length;
    while (this.length && by < 0) by += this.length;
    this.push.apply(this, this.splice(0, by));
    return this;
};
Array.prototype.count = function (elem) {
    return this.filter(item => item === elem).length;
};

declare module "react" {
    interface CSSProperties {
        '--progress'?: string | number;
    }
}

declare module "@material-ui/core/styles/createTheme" {
    interface Theme {
        name: ThemeName;
    }
}

declare module "@material-ui/core/styles/createPalette" {
    interface ElevationColourValue {
        main: string;
    }

    interface ElevationColour {
        0: ElevationColourValue;
        1: ElevationColourValue;
        2: ElevationColourValue;
        3: ElevationColourValue;
        4: ElevationColourValue;
        6: ElevationColourValue;
        8: ElevationColourValue;
        12: ElevationColourValue;
        16: ElevationColourValue;
        24: ElevationColourValue;
    }
    interface Palette {
        elevations: ElevationColour;
        opacity: number;
    }
    interface PaletteOptions {
        elevations: ElevationColour;
        opacity: number;
    }
}
export {};
