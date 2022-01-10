import {Box, Button, Collapse, Grid, ListItem, ListItemIcon, ListItemText, TextField, useTheme} from "@material-ui/core";
import {DeleteForever, ExpandLess, ExpandMore, Translate} from "@material-ui/icons";
import {useState} from "react";
import {useTranslation} from "react-i18next";
import {getGroup, I18nRoot, LoadedI18nRoot} from "../misc";
import {Centred} from "./Centred";

interface KeyRowProps {
    i18nData: LoadedI18nRoot;
    setI18nData: (value: I18nRoot) => void;
    transKey: string;
    namespace: string;
    groups: string[];
    nestDepth: number;
}
export default function KeyRow({groups, i18nData, setI18nData, transKey, namespace, nestDepth}: KeyRowProps) {
    const [collapsed, setCollapsed] = useState(false);
    const {t} = useTranslation('core');
    const theme = useTheme();
    return <>
        <ListItem button onClick={() => setCollapsed(collapsed => !collapsed)} style={{paddingLeft: theme.spacing(4 * nestDepth)}}>
            <ListItemIcon>
                <Translate />
            </ListItemIcon>
            <ListItemText>
                {transKey}
            </ListItemText>
            {collapsed ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={collapsed} unmountOnExit>
            <Box p={2}>
                <Grid container spacing={2}>
                    {i18nData.langs.map(
                        lang => <Grid item xs={12} sm={6} lg={4} xl={3} key={lang}>
                            <TextField
                                multiline
                                fullWidth
                                value={
                                    getGroup(i18nData.data[lang][namespace], groups)[transKey]
                                }
                                label={t('core:key_row.translation_for', {lang})}
                                onChange={
                                    (event) => {
                                        getGroup(i18nData.data[lang][namespace], groups)[transKey] = event.target.value;
                                        setI18nData({
                                            ...i18nData,
                                            unsaved: true,
                                        });
                                    }
                                }
                            />
                        </Grid>
                    )}
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                        <Centred>
                            <Button
                                startIcon={<DeleteForever />}
                                onClick={() => {
                                    delete getGroup(i18nData.masterKeys[namespace], groups)[transKey];
                                    setI18nData({
                                        ...i18nData,
                                        unsaved: true,
                                    });
                                }}
                            >
                                {t('core:key_row.delete')}
                            </Button>
                        </Centred>
                    </Grid>
                </Grid>
            </Box>
        </Collapse>
    </>;
}