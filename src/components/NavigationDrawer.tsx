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
import {Drawer, Hidden, ListItem, ListItemIcon, ListItemText, SvgIcon, Toolbar, useTheme} from '@material-ui/core';
import {Language} from '@material-ui/icons';
import {useTranslation} from 'react-i18next';
import {ReactComponent as darkModeIcon} from '../assets/extra_icons/dark_mode.svg';
import {ReactComponent as lightModeIcon} from '../assets/extra_icons/light_mode.svg';
import {ThemeName} from '../themes';

function DarkModeIcon() {
    return <SvgIcon component={darkModeIcon} />;
}
function LightModeIcon() {
    return <SvgIcon component={lightModeIcon} />;
}
interface DrawerContentProps {
    onSelect?: () => void;
    setTheme: (theme: ThemeName) => void;
    setLangOpen: (value: boolean) => void;
    children: React.ReactNode;
}
function DrawerContent({
    onSelect,
    setTheme,
    setLangOpen,
    children,
}: DrawerContentProps) {
    const {t} = useTranslation('core');
    const theme = useTheme();
    const newTheme: ThemeName = theme.name === 'dark' ? 'light' : 'dark';
    return <>
        {children}
        <div style={{flexGrow: 1}} />
        <ListItem button onClick={() => {setLangOpen(true); if (onSelect) {onSelect();} }}>
            <ListItemIcon>
                <Language />
            </ListItemIcon>
            <ListItemText primary={t('core:sidebar.lang')} />
        </ListItem>
        <ListItem button onClick={() => {setTheme(newTheme); if (onSelect) {onSelect();} }}>
            <ListItemIcon>
                {
                    newTheme === 'dark'
                        ? <DarkModeIcon />
                        : <LightModeIcon />
                }
            </ListItemIcon>
            <ListItemText primary={t('core:sidebar.theme')} />
        </ListItem>
    </>;
}

interface NavigationDrawerProps {
    open: boolean;
    setOpen: (value: boolean) => void;
    setTheme: (theme: ThemeName) => void;
    setLangOpen: (value: boolean) => void;
    children: React.ReactNode;
}


export function NavigationDrawer(props: NavigationDrawerProps) {
    const theme = useTheme();
    const container = window !== undefined ? () => window.document.body : undefined;
    return <>
        <Hidden smUp>
            <Drawer
                variant="temporary"
                container={container}
                anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                open={props.open}
                onClose={() => props.setOpen(false)}
            >
                <DrawerContent
                    onSelect={() => props.setOpen(false)}
                    setTheme={props.setTheme}
                    setLangOpen={props.setLangOpen}
                >
                    {props.children}
                </DrawerContent>
            </Drawer>
        </Hidden>
        <Hidden xsDown>
            <Drawer
                variant="persistent"
                anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                open={props.open}
            >
                <Toolbar />
                <DrawerContent
                    setTheme={props.setTheme}
                    setLangOpen={props.setLangOpen}
                >
                    {props.children}
                </DrawerContent>
            </Drawer>
        </Hidden>
    </>;
}
