import {Box, Button, Collapse, Grid, ListItem, ListItemIcon, ListItemText, TextField} from "@material-ui/core";
import {DeleteForever, ExpandLess, ExpandMore, Translate} from "@material-ui/icons";
import {useState} from "react";
import {useTranslation} from "react-i18next";
import {getGroup, I18nData, I18nRoot, LoadedI18nRoot} from "../misc";
import {Centred} from "./Centred";

interface KeyRowProps {
    i18nData: LoadedI18nRoot;
    setI18nData: (value: I18nRoot) => void;
    transKey: string;
    namespace: string;
    groups: string[];
    className?: string;
}
export default function KeyRow({groups, i18nData, setI18nData, transKey, namespace, className}: KeyRowProps) {
    const [collapsed, setCollapsed] = useState(false);
    const {t} = useTranslation('core');
    return <>
        <ListItem button onClick={() => setCollapsed(collapsed => !collapsed)} className={className}>
            <ListItemIcon>
                <Translate />
            </ListItemIcon>
            <ListItemText>
                {transKey}
            </ListItemText>
            {collapsed ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={collapsed} className={className} unmountOnExit>
            <Box p={2}>
                <Grid container spacing={2}>
                    {i18nData.langs.map(
                        lang => <Grid item xs={12} sm={6} md={4} lg={3}>
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
                                    let containingGroup = i18nData.masterKeys[namespace];
                                    for (let group of groups) {
                                        containingGroup = containingGroup[group] as I18nData;
                                    }
                                    delete containingGroup[transKey];
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