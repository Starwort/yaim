import {Button, Collapse, Dialog as Dialogue, DialogActions as DialogueActions, DialogContent as DialogueContent, DialogTitle as DialogueTitle, List, ListItem, ListItemIcon, ListItemText, TextField} from "@material-ui/core";
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import {Add, DeleteForever, ExpandLess, ExpandMore, Folder, FolderOpen} from "@material-ui/icons";
import {useMemo, useState} from "react";
import {useTranslation} from "react-i18next";
import {getGroup, I18nData, I18nRoot, LoadedI18nRoot} from "../misc";
import KeyRow from "./KeyRow";


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        nested: {
            paddingLeft: theme.spacing(4),
        },
    }),
);

interface KeyGroupProps {
    i18nData: LoadedI18nRoot;
    setI18nData: (value: I18nRoot) => void;
    groupName: string;
    namespace: string;
    groups: string[];
    className?: string;
}
export default function KeyGroup({groups, i18nData, setI18nData, groupName, namespace, className}: KeyGroupProps) {
    const {t} = useTranslation('core');
    const [expanded, setExpanded] = useState(false);
    const [keyDialogueOpen, setKeyDialogueOpen] = useState(false);
    const [keyGroupDialogueOpen, setKeyGroupDialogueOpen] = useState(false);
    const [newKey, setNewKey] = useState<string>(t('core:new.key'));
    const {nested} = useStyles();
    const myGroups = useMemo(
        () => [...groups, groupName],
        [groups, groupName],
    );
    let newKeyIsValid = true, keyError: string | undefined;
    let nsKeys = i18nData.masterKeys[namespace];
    const groupKeys = useMemo(
        () => getGroup(nsKeys, groups),
        [groups, nsKeys],
    );
    const groupData = groupKeys[groupName] as I18nData;
    if (/^\s*$/.test(newKey)) {
        newKeyIsValid = false;
        keyError = t('core:namespace.error.key_empty');
    } else if (newKey in groupData) {
        newKeyIsValid = false;
        keyError = t('core:namespace.error.key_exists');
    } else if (/\./.test(newKey)) {
        newKeyIsValid = false;
        keyError = t('core:namespace.error.key_has_dot');
    }
    return <>
        <ListItem button onClick={() => setExpanded(expanded => !expanded)} className={className}>
            <ListItemIcon>
                {expanded ? <FolderOpen /> : <Folder />}
            </ListItemIcon>
            <ListItemText>
                {groupName}
            </ListItemText>
            {expanded ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={expanded} className={className} unmountOnExit>
            <List component="div" disablePadding>
                {Object.entries(groupData).sort(
                    ([keyA,], [keyB,]) => keyA < keyB ? -1 : 1
                ).map(
                    ([key, values]) =>
                        typeof values === 'string' ? <KeyRow
                            groups={myGroups}
                            i18nData={i18nData}
                            setI18nData={setI18nData}
                            namespace={namespace}
                            key={key}
                            transKey={key}
                            className={nested}
                        /> :
                            <KeyGroup
                                groups={myGroups}
                                i18nData={i18nData}
                                setI18nData={setI18nData}
                                namespace={namespace}
                                key={key}
                                groupName={key}
                                className={nested}
                            />
                )}
                <ListItem
                    button
                    onClick={() => setKeyDialogueOpen(true)}
                >
                    <ListItemIcon>
                        <Add />
                    </ListItemIcon>
                    <ListItemText>
                        {t('core:namespace.label.add_key')}
                    </ListItemText>
                </ListItem>
                <ListItem
                    button
                    onClick={() => setKeyGroupDialogueOpen(true)}
                >
                    <ListItemIcon>
                        <Add />
                    </ListItemIcon>
                    <ListItemText>
                        {t('core:namespace.label.add_group')}
                    </ListItemText>
                </ListItem>
                <ListItem
                    button
                    onClick={() => {
                        delete getGroup(i18nData.masterKeys[namespace], groups)[groupName];
                        setI18nData({
                            ...i18nData,
                            unsaved: true,
                        });
                    }}
                >
                    <ListItemIcon>
                        <DeleteForever />
                    </ListItemIcon>
                    <ListItemText>
                        {t('core:key_group.delete')}
                    </ListItemText>
                </ListItem>
            </List>
        </Collapse>
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
                            getGroup(i18nData.masterKeys[namespace], myGroups)[newKey] = '';
                            setI18nData({
                                ...i18nData,
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
                        getGroup(i18nData.masterKeys[namespace], myGroups)[newKey] = '';
                        setI18nData({
                            ...i18nData,
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
                            getGroup(i18nData.masterKeys[namespace], myGroups)[newKey] = {};
                            setI18nData({
                                ...i18nData,
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
                        getGroup(i18nData.masterKeys[namespace], myGroups)[newKey] = {};
                        setI18nData({
                            ...i18nData,
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