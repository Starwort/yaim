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
import {CssBaseline, ThemeProvider} from "@material-ui/core";
import {useMemo, useState} from "react";
import {Route} from "react-router-dom";
import {AppFrame} from "./components";
import {I18nRoot} from "./misc";
import getTheme, {ThemeName} from "./themes";

export type Settings = {
    theme: ThemeName;
};
export const defaultSettings: Settings = {
    theme: 'dark',
};

function App() {
    if (!window.localStorage.settings) {
        window.localStorage.settings = JSON.stringify(defaultSettings);
    }
    const [settings, setSettingsImpl] = useState<Settings>(() => JSON.parse(window.localStorage.settings));
    function setSettings(value: Settings) {
        window.localStorage.settings = JSON.stringify(value);
        setSettingsImpl(value);
    }
    function setTheme(value: 'dark' | 'light') {
        document.body.classList.add("no-transition");
        setSettings({...settings, theme: value});
        // document.body.classList.remove("no-transition");
        setTimeout(() => document.body.classList.remove("no-transition"), 10);
    }
    const theme = useMemo(
        () => getTheme(settings.theme),
        [settings]
    );
    const [i18nData, setI18nData] = useState<I18nRoot>({loaded: false});
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppFrame i18nData={i18nData} setI18nData={setI18nData} setTheme={setTheme}>
                <Route path="/core">
                    hi
                </Route>
            </AppFrame>
        </ThemeProvider>
    );
}

export default App;
