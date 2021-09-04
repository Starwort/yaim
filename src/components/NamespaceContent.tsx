import {Box, Button, Card, CardContent, CircularProgress, Dialog as Dialogue, DialogActions as DialogueActions, DialogContent as DialogueContent, DialogTitle as DialogueTitle, Grid, IconButton, InputAdornment, List, ListItem, ListItemIcon, ListItemText, TextField, Typography} from "@material-ui/core";
import {Add, CreateNewFolder, DeleteForever, Done} from "@material-ui/icons";
import {useEffect, useMemo, useState} from "react";
import {useTranslation} from "react-i18next";
import {useHistory, useParams} from "react-router-dom";
import {getKeyValue, I18nRoot, LoadedI18nRoot} from "../misc";
import {Centred} from "./Centred";
import {flatten} from './FileTree';
import KeyGroup from "./KeyGroup";
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
    const [keyDialogueOpen, setKeyDialogueOpen] = useState(false);
    const [keyGroupDialogueOpen, setKeyGroupDialogueOpen] = useState(false);
    const [newKey, setNewKey] = useState<string>(t('core:new.key'));
    let newKeyIsValid = true, keyError: string | undefined;
    const flatKeys = useMemo(
        () => flatten(i18nData.masterKeys[namespace]),
        [i18nData.masterKeys, namespace],
    );
    if (/^\s*$/.test(newKey)) {
        newKeyIsValid = false;
        keyError = t('core:namespace.error.key_empty');
    } else if (newKey in i18nData.masterKeys[namespace]) {
        newKeyIsValid = false;
        keyError = t('core:namespace.error.key_exists');
    } else if (/\./.test(newKey)) {
        newKeyIsValid = false;
        keyError = t('core:namespace.error.key_has_dot');
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
                <Box p={2}>
                    <Centred>
                        <Typography variant="h5" component="h2">
                            {t('core:namespace.label.completion')}
                        </Typography>
                    </Centred>
                    <Grid container spacing={2}>
                        {i18nData.langs.map(lang => {
                            const complete = 100 * flatKeys.filter(
                                key => getKeyValue(i18nData.data[lang][namespace], key)
                            ).length / flatKeys.length;
                            return <Grid item xs={12} sm={6} md={2} xl={1} key={lang}>
                                <Centred>
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
                                </Centred>
                            </Grid>;
                        })}
                    </Grid>
                </Box>
            </CardContent>
            <List>
                {Object.entries(i18nData.masterKeys[namespace]).sort(
                    ([keyA,], [keyB,]) => keyA < keyB ? -1 : 1
                ).map(
                    ([key, value]) => typeof value === 'string'
                        ? <KeyRow
                            key={key}
                            i18nData={i18nData}
                            setI18nData={setI18nData}
                            transKey={key}
                            namespace={namespace}
                            groups={[]}
                        />
                        : <KeyGroup
                            key={key}
                            groupName={key}
                            i18nData={i18nData}
                            setI18nData={setI18nData}
                            namespace={namespace}
                            groups={[]}
                        />
                )}
                <ListItem button onClick={() => setKeyDialogueOpen(true)}>
                    <ListItemIcon>
                        <Add />
                    </ListItemIcon>
                    <ListItemText>
                        {t('core:namespace.label.add_key')}
                    </ListItemText>
                </ListItem>
                <ListItem button onClick={() => setKeyGroupDialogueOpen(true)}>
                    <ListItemIcon>
                        <CreateNewFolder />
                    </ListItemIcon>
                    <ListItemText>
                        {t('core:namespace.label.add_group')}
                    </ListItemText>
                </ListItem>
            </List>
        </Card>
        <Dialogue
            open={keyDialogueOpen}
            onClose={() => setKeyDialogueOpen(false)}
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
                            setKeyDialogueOpen(false);
                            setI18nData({
                                ...i18nData,
                                masterKeys: {
                                    ...i18nData.masterKeys,
                                    [namespace]: {
                                        ...i18nData.masterKeys[namespace],
                                        [newKey]: ''
                                    },
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
                    setKeyDialogueOpen(false);
                    setNewKey(t('core:new.key'));
                }}>
                    {t('core:button.cancel')}
                </Button>
                <Button
                    onClick={() => {
                        setKeyDialogueOpen(false);
                        setI18nData({
                            ...i18nData,
                            masterKeys: {
                                ...i18nData.masterKeys,
                                [namespace]: {
                                    ...i18nData.masterKeys[namespace],
                                    [newKey]: ''
                                },
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
        <Dialogue
            open={keyGroupDialogueOpen}
            onClose={() => setKeyGroupDialogueOpen(false)}
            maxWidth="sm"
            fullWidth
        >
            <DialogueTitle>{t('core:namespace.add_group.title')}</DialogueTitle>
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
                            setKeyGroupDialogueOpen(false);
                            setI18nData({
                                ...i18nData,
                                masterKeys: {
                                    ...i18nData.masterKeys,
                                    [namespace]: {
                                        ...i18nData.masterKeys[namespace],
                                        [newKey]: {}
                                    },
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
                    setKeyGroupDialogueOpen(false);
                    setNewKey(t('core:new.key'));
                }}>
                    {t('core:button.cancel')}
                </Button>
                <Button
                    onClick={() => {
                        setKeyGroupDialogueOpen(false);
                        setI18nData({
                            ...i18nData,
                            masterKeys: {
                                ...i18nData.masterKeys,
                                [namespace]: {
                                    ...i18nData.masterKeys[namespace],
                                    [newKey]: {}
                                },
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