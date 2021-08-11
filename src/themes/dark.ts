import {createMuiTheme} from '@material-ui/core/styles';
import '../prototype_mods';
import {commonProps} from './common_theme_data';


// Dark theme
const theme = createMuiTheme({
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
        modelled: {
            main: 'gold',
            transparent: 'rgba(255, 215, 0, 0.3)',
        },
        winter: {
            main: '#3c84c6',
            transparent: 'rgba(60, 132, 198, 0.3)',
            contrastText: 'rgba(0,0,0,87%)'
        },
        spring: {
            main: '#38761c',
            transparent: 'rgba(56, 118, 28, 0.3)',
            contrastText: 'rgba(0,0,0,87%)'
        },
        summer: {
            main: '#e69038',
            transparent: 'rgba(230, 144, 56, 0.3)',
            contrastText: 'rgba(0,0,0,87%)'
        },
        autumn: {
            main: '#b45f04',
            transparent: 'rgba(180, 95, 4, 0.3)',
            contrastText: 'rgba(0,0,0,87%)'
        },
        primary: {
            main: '#bb86fc',
            contrastText: 'rgba(0,0,0,87%)',
            transparent: 'rgba(187, 134, 252, 0.3)',
        },
        secondary: {
            main: '#03dac6',
            contrastText: 'rgba(0,0,0,87%)',
        },
        error: {
            main: '#cf6679',
            transparent: 'rgba(207, 102, 121, 0.3)',
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