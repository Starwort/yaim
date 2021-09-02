import {Box, Button, Card, CardContent, CircularProgress, Dialog as Dialogue, DialogActions as DialogueActions, DialogContent as DialogueContent, DialogTitle as DialogueTitle, Grid, IconButton, InputAdornment, List, ListItem, ListItemIcon, ListItemText, TextField, Typography} from "@material-ui/core";
import {Add, DeleteForever, Done} from "@material-ui/icons";
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useHistory, useParams} from "react-router-dom";
import {I18nRoot, LoadedI18nRoot} from "../misc";
import {Centred} from "./Centred";
import KeyRow from "./KeyRow";

interface NamespaceContentProps {
    i18nData: LoadedI18nRoot;
    setI18nData: (value: I18nRoot) => void;
}
export default function NamespaceContent({i18nData, setI18nData}: NamespaceContentProps) {
    const {namespace} = useParams<{namespace: string;}>();
    const history = useHistory();
    const {t} = useTranslation('core');
    const [newName, setNewName] = useState(namespace);
    const [dialogueOpen, setDialogueOpen] = useState(false);
    const [newKey, setNewKey] = useState<string>(t('core:new.key'));
    let newKeyIsValid = true, keyError: string | undefined;
    if (/^\s*$/.test(newKey)) {
        newKeyIsValid = false;
        keyError = t('core:namespace.error.key_empty');
    } else if (i18nData.masterKeys[namespace].filter(item => item.startsWith(newKey)).length) {
        newKeyIsValid = false;
        keyError = t('core:namespace.error.key_exists');
    }
    const nsExists = namespace !== newName && i18nData.namespaces.includes(newName);
    useEffect(
        () => setNewName(namespace),
        [namespace],
    );
    const updateNSName = () => {
        if (newName === namespace || nsExists) {
            return;
        }
        let newNamespaces = i18nData.data;
        for (let namespaces of Object.values(newNamespaces)) {
            namespaces[newName] = namespaces[namespace];
            delete namespaces[namespace];
        }
        setI18nData({...i18nData, data: newNamespaces, namespaces: Object.keys(newNamespaces[i18nData.master])});
        history.replace(`/${newName}`);
    };
    const removeNS = () => {
        let newNamespaces = i18nData.data;
        for (let namespaces of Object.values(newNamespaces)) {
            delete namespaces[namespace];
        }
        setI18nData({...i18nData, data: newNamespaces, namespaces: Object.keys(newNamespaces[i18nData.master])});
        history.replace('/');
    };
    return <>
        <Card>
            <CardContent>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label={t('core:namespace.label.name')}
                            value={newName}
                            onChange={
                                (event) => setNewName(event.target.value)
                            }
                            error={nsExists}
                            helperText={nsExists ? t('core:namespace.error.name_exists') : ''}
                            onKeyPress={(ev) => {
                                if (ev.key === 'Enter') {
                                    updateNSName();
                                    ev.preventDefault();
                                }
                            }}
                            fullWidth
                            InputProps={{
                                endAdornment: <InputAdornment position="end">
                                    <IconButton
                                        style={{color: nsExists ? undefined : 'green'}}
                                        onClick={updateNSName}
                                        disabled={nsExists}
                                    >
                                        <Done />
                                    </IconButton>
                                </InputAdornment>
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Centred>
                            <Button
                                startIcon={<DeleteForever />}
                                onClick={removeNS}
                            >
                                {t('core:namespace.label.delete')}
                            </Button>
                        </Centred>
                    </Grid>
                </Grid>
                <Grid container spacing={2}>
                    {i18nData.langs.map(lang => {
                        const complete = 100 * i18nData.masterKeys[namespace].filter(
                            key => i18nData.data[lang][namespace][key]
                        ).length / i18nData.masterKeys[namespace].length;
                        return <Grid item xs={6} sm={3} md={2} lg={1}>
                            <Box display="inline-flex" alignItems="center">
                                {lang}:
                                <Box position="relative" display="inline-flex" p={1}>
                                    <CircularProgress variant="determinate" value={complete} />
                                    <Box
                                        top={0}
                                        left={0}
                                        bottom={0}
                                        right={0}
                                        position="absolute"
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                    >
                                        <Typography variant="caption" component="div" color="textSecondary">
                                            {complete.toFixed(0)}%
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </Grid>;
                    })}
                </Grid>
            </CardContent>
            <List>
                {i18nData.masterKeys[namespace].map(
                    key => <KeyRow
                        key={key}
                        i18nData={i18nData}
                        setI18nData={setI18nData}
                        transKey={key}
                        namespace={namespace}
                    />
                )}
                <ListItem button onClick={() => setDialogueOpen(true)}>
                    <ListItemIcon>
                        <Add />
                    </ListItemIcon>
                    <ListItemText>
                        {t('core:namespace.label.add_key')}
                    </ListItemText>
                </ListItem>
            </List>
        </Card>
        <Dialogue
            open={dialogueOpen}
            onClose={() => setDialogueOpen(false)}
            maxWidth="sm"
            fullWidth
        >
            <DialogueTitle>{t('core:namespace.add_key.title')}</DialogueTitle>
            <DialogueContent>
                <TextField
                    autoFocus
                    label={t('core:namespace.add_key.label.input')}
                    error={!newKeyIsValid}
                    helperText={keyError ?? t('core:namespace.add_key.label.help')}
                    fullWidth
                    value={newKey}
                    onChange={(event) => setNewKey(event.target.value)}
                    onKeyPress={(ev) => {
                        if (ev.key === 'Enter') {
                            setDialogueOpen(false);
                            setI18nData({
                                ...i18nData,
                                masterKeys: {
                                    ...i18nData.masterKeys,
                                    [namespace]: [...i18nData.masterKeys[namespace], newKey],
                                },
                                unsaved: true,
                            });
                            setNewKey(t('core:new.key'));
                            ev.preventDefault();
                        }
                    }}
                />
            </DialogueContent>
            <DialogueActions>
                <Button onClick={() => {
                    setDialogueOpen(false);
                    setNewKey(t('core:new.key'));
                }}>
                    {t('core:button.cancel')}
                </Button>
                <Button
                    onClick={() => {
                        setDialogueOpen(false);
                        setI18nData({
                            ...i18nData,
                            masterKeys: {
                                ...i18nData.masterKeys,
                                [namespace]: [...i18nData.masterKeys[namespace], newKey],
                            },
                            unsaved: true,
                        });
                        setNewKey(t('core:new.key'));
                    }}
                    disabled={!newKeyIsValid}
                >
                    {t('core:button.confirm')}
                </Button>
            </DialogueActions>
        </Dialogue>
    </>;
}