import dark from './dark';
import light from './light';

dark.name = 'dark';
light.name = 'light';

const themes = {
    light,
    dark,
};

export type ThemeName = keyof typeof themes;

export default function getTheme(theme: ThemeName) {
    return themes[theme];
}