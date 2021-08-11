import {createMuiTheme} from '@material-ui/core/styles';
import '../prototype_mods';
import {commonProps} from './common_theme_data';

// Normal or default theme
const theme = createMuiTheme({
    palette: {
        type: 'light',
        opacity: 0.6,
        elevations: {
            0: {main: '#ffffff'},
            1: {main: '#ffffff'},
            2: {main: '#ffffff'},
            3: {main: '#ffffff'},
            4: {main: '#ffffff'},
            6: {main: '#ffffff'},
            8: {main: '#ffffff'},
            12: {main: '#ffffff'},
            16: {main: '#ffffff'},
            24: {main: '#ffffff'},
        },
        modelled: {
            main: '#fbc02d',
            transparent: 'rgba(251, 192, 45, 0.5)',
        },
        winter: {
            main: '#3c84c6',
            transparent: 'rgba(60, 132, 198, 0.6)',
            contrastText: 'rgba(0,0,0,87%)',
        },
        spring: {
            main: '#38761c',
            transparent: 'rgba(56, 118, 28, 0.6)',
            contrastText: 'rgba(0,0,0,87%)',
        },
        summer: {
            main: '#e69038',
            transparent: 'rgba(230, 144, 56, 0.6)',
            contrastText: 'rgba(0,0,0,87%)',
        },
        autumn: {
            main: '#b45f04',
            transparent: 'rgba(180, 95, 4, 0.6)',
            contrastText: 'rgba(0,0,0,87%)',
        },
        primary: {
            main: '#6200ee',
            contrastText: 'rgba(255,255,255,87%)',
            transparent: 'rgba(98, 0, 238, 0.5)',
        },
        secondary: {
            main: '#03dac6',
            contrastText: 'rgba(0,0,0,87%)',
        },
        error: {
            main: '#b00020',
            transparent: 'rgba(176, 0, 32, 0.5)',
        },
        background: {
            paper: '#ffffff',
            default: '#eeeeee'
        },
        text: {
            primary: 'rgba(0,0,0,87%)',
            secondary: 'rgba(0,0,0,60%)',
            hint: 'rgba(0,0,0,60%)',
            disabled: 'rgba(0,0,0,38%)',
        }
    },
    zIndex: {
        appBar: 1250
    },
    props: commonProps,
});

theme.overrides = {
    MuiDrawer: {
        paper: {
            width: 240
        }
    },
    MuiCard: {
        root: {
            borderWidth: 1,
            borderColor: 'transparent',
            borderStyle: 'solid',
        },
    },
    MuiCardHeader: {
        root: {
            paddingBottom: 0,
            textAlign: 'center',
        },
    },
};

export default theme;