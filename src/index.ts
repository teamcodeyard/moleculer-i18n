import { promises as fsp } from 'node:fs'
import Polyglot from 'node-polyglot'

import type { I18nServiceSchema } from './types'
import { readFilesSync } from './utils/read-files-sync'

export const I18nMixin: I18nServiceSchema = {
  name: 'I18nMixin',
  settings: {
    i18n: {
      polyglot: new Polyglot(),
      languages: ['en'],
      dirName: 'testTranslations',
    },
  },
  methods: {
    t({ meta }, key, interpolation) {
      if (!this.settings)
        return `${meta.locale}.${key}`

      const { languages } = this.settings.i18n

      if (!meta.locale || !languages.includes(meta.locale))
        meta.locale = 'en'

      return this.settings.i18n.polyglot.t(`${meta.locale}.${key}`, interpolation)
    },
  },
  async started() {
    // TODO: i18n is any, why?
    const files = await readFilesSync(this.settings.i18n.dirName)

    for (const translation of files) {
      if (translation.filepath.split('.').pop() !== 'json')
        continue

      const content = await fsp.readFile(translation.filepath, 'utf-8')
      const object: Record<string, string> = {}

      object[translation.name] = JSON.parse(content)

      this.settings.i18n.polyglot.extend(object)
    }
  },
}
