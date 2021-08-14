import {CssBaseline, ThemeProvider, Typography} from "@material-ui/core";
import {useMemo, useState} from "react";
import {AppFrame, Centred} from "./components";
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
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppFrame fileTree={<>...</>} setTheme={setTheme}>
                <Centred>
                    <Typography>
                        Hello world!!
                    </Typography>
                </Centred>
            </AppFrame>
        </ThemeProvider>
    );
}

export default App;
