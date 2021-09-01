import {Box, Collapse, Grid, ListItem, ListItemIcon, ListItemText, TextField} from "@material-ui/core";
import {ExpandLess, ExpandMore, Translate} from "@material-ui/icons";
import {useState} from "react";
import {I18nRoot, LoadedI18nRoot} from "../misc";

interface KeyRowProps {
    i18nData: LoadedI18nRoot;
    setI18nData: (value: I18nRoot) => void;
    transKey: string;
    namespace: string;
}
export default function KeyRow({i18nData, setI18nData, transKey, namespace}: KeyRowProps) {
    const [collapsed, setCollapsed] = useState(false);
    return <>
        <ListItem button onClick={() => setCollapsed(collapsed => !collapsed)}>
            <ListItemIcon>
                <Translate />
            </ListItemIcon>
            <ListItemText>
                {transKey}
            </ListItemText>
            {collapsed ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={collapsed}>
            <Box p={2}>
                <Grid container spacing={2}>
                    {i18nData.langs.map(
                        lang => <Grid item xs={12} sm={6} md={4} lg={3}>
                            <TextField
                                multiline
                                fullWidth
                                value={
                                    i18nData.data[lang][namespace][transKey]
                                }
                                label={`Translation for ${lang}`}
                                onChange={
                                    (event) => setI18nData({
                                        ...i18nData,
                                        data: {
                                            ...i18nData.data,
                                            [lang]: {
                                                ...i18nData.data[lang],
                                                [namespace]: {
                                                    ...i18nData.data[lang][namespace],
                                                    [transKey]: event.target.value,
                                                },
                                            },
                                        },
                                        unsaved: true,
                                    })
                                }
                            />
                        </Grid>
                    )}
                </Grid>
            </Box>
        </Collapse>
    </>;
}