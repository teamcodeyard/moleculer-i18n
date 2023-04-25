[![Moleculer logo](http://moleculer.services/images/banner.png)](https://github.com/moleculerjs/moleculer)

<br>

Server side i18n support for [Moleculer](https://moleculer.services/) microservices framework based on [Polyglot](https://www.npmjs.com/package/node-polyglot).

<br>

# Install

```bash
$ npm install @codeyard/moleculer-i18n --save
```

<br>

# Usage

## Add I18nMixin to your service

```js
const { I18nMixin } = require("@codeyard/moleculer-i18n");

broker.createService({
  name: 'greeter',
  mixins: [I18nMixin],
  actions: {
    welcome: {
      handler(ctx) {
        return this.t(ctx, 'greeter.welcome.message', { name: 'Jon' })
      },
    },
  },
})
```

<br>

## Configurations

```js
const { I18nMixin } = require('moleculer-i18n')
const Polyglot = require('node-polyglot')

broker.createService({
  name: 'greeter',
  mixins: [I18nMixin],
  settings: {
    i18n: {
      dirName: 'translations',
      languages: ['en', 'es'],
      polyglot: new Polyglot(),
    },
  },
})
```

<br>

### Setting fields
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `dirName` | `string` | **optional** | Name of the directory that contains localized JSON files. |
| `languages` | `array` | **optional** | Array of supported languages (default: en). |

<br>

### Example en.json file

```json
{
  "greeter": {
    "welcome": {
      "message": "Hello there!"
    }
  },
  "errors.general.message": "Ooops, somethig went wrong!",
  "greeter.farewell": "Good bye %{name}!"
}
```

<br>

# License

The project is available under the [MIT license](./LICENSE).

# Contact

Copyright (c) 2016-2019 MoleculerJS

[![@moleculerjs](https://img.shields.io/badge/github-moleculerjs-green.svg)](https://github.com/moleculerjs) [![@MoleculerJS](https://img.shields.io/badge/twitter-MoleculerJS-blue.svg)](https://twitter.com/MoleculerJS)
