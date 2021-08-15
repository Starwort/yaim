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
import {createTheme} from '@material-ui/core/styles';
import '../prototype_mods';
import {commonProps} from './common_theme_data';


// Dark theme
const theme = createTheme({
    palette: {
        type: 'dark',
        opacity: 0.3,
        elevations: {
            0: {main: '#1e1e1e'},
            1: {main: '#292929'},
            2: {main: '#2e2e2e'},
            3: {main: '#303030'},
            4: {main: '#323232'},
            6: {main: '#373737'},
            8: {main: '#393939'},
            12: {main: '#3e3e3e'},
            16: {main: '#404040'},
            24: {main: '#424242'},
        },
        primary: {
            main: '#bb86fc',
            contrastText: 'rgba(0,0,0,87%)',
        },
        secondary: {
            main: '#03dac6',
            contrastText: 'rgba(0,0,0,87%)',
        },
        error: {
            main: '#cf6679',
        },
        background: {
            paper: '#1e1e1e',
            default: '#121212'
        },
        text: {
            primary: 'rgba(255,255,255,87%)',
            secondary: 'rgba(255,255,255,60%)',
            hint: 'rgba(255,255,255,60%)',
            disabled: 'rgba(255,255,255,38%)',
        }
    },
    zIndex: {
        appBar: 1250
    },
    props: commonProps,
});

theme.overrides = {
    MuiAppBar: {
        colorPrimary: {
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.primary.main,
        },
        colorSecondary: {
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.secondary.main,
        },
        colorDefault: {
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
        }
    },
    MuiDrawer: {
        paper: {
            width: 240
        }
    },
    MuiCard: {
        root: {
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 8%)',
            borderStyle: 'solid',
        },
    },
    MuiCardHeader: {
        root: {
            paddingBottom: 0,
            textAlign: 'center',
        },
    },
    MuiListItemIcon: {
        root: {
            color: theme.palette.text.secondary,
        }
    }
};

export default theme;
