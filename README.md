# Yet Another I18n Manager

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

An additional open-source i18n manager (as the open-source ones all seem to be bad, and the good ones all seem to be paid-plan)

YAIM is a localisation tool intended for `i18next` projects. It allows you to edit translation files through an interface instead of dealing with JSON files directly. In addition, it will show you how complete each translation is on a per-namespace basis. This is particularly aimed towards non-developers, who may not wish to modify files directly; but it is still useful for developers who wish to speed up their keying process.

YAIM's translation keys were created with YAIM.

## Usage

Install all dependencies: `npm i`

To run the app: `npm run electron`

To develop the app: `npm start` in one console, and `npm run electron-dev` in another.

In addition to the Electron app, [a web version](https://starbright.dyndns.org/yaim) is available.

YAIM expects your workspace to be in the following format:

```
workspace root
  |- language folder
  |    |- namespace.json
  |    |- other_namespace.json
  |- other language folder
       |- namespace.json
       |- other_namespace.json
```

Using namespace/lang instead of lang/namespace will cause issues!

## Credits

The YAIM logos were designed by @0xicl33n. All other material was created by @Starwort, the owner of this repository.
