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