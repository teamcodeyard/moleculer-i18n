import { promises as fsp } from 'node:fs'
import { basename } from 'node:path'
import type { ServiceSchema, ServiceSettingSchema } from 'moleculer'
import Polyglot from 'node-polyglot'
import fg from 'fast-glob'

interface I18nSettings<LanguageKey extends string> extends ServiceSettingSchema {
  i18n: {
    dirName: string
    languages: Record<LanguageKey, string>
    polyglot: Polyglot
  }
}

type LanguageKeys =
  | 'EN'

const MIXIN_NAME = 'I18nMixin'

const settings: I18nSettings<LanguageKeys> = {
  i18n: {
    dirName: './mock/translations',
    languages: {
      EN: 'en',
    },
    polyglot: new Polyglot(),
  },
}

export const I18nMixin: ServiceSchema<I18nSettings<LanguageKeys>> = {
  name: MIXIN_NAME,
  settings,
  methods: {
    // TODO: set method type with ServiceMethods somehow 🤔
    t(ctx, key, interpolation) {
      // TODO: how to set type here?
      let { locale } = ctx.meta
      const availableLanguages = Object.values(settings.i18n.languages)

      // Set default language key
      if (!availableLanguages.includes(locale))
        locale = settings.i18n.languages.EN

      return settings.i18n.polyglot.t(`${locale}.${key}`, interpolation)
    },
  },
  // TODO: how to handle promise errors?
  async started() {
    try {
      // TODO: do we need to sort files?
      const translationFiles = await fg(`${this.settings.i18n.dirName}/*.json`)
      const translations: Record<string, string> = {}

      translationFiles.forEach(async (translation) => {
        const content = await fsp.readFile(translation, 'utf-8')
        const language = basename(translation, '.json')

        translations[language] = String(JSON.parse(content))

        this.settings.i18n.polyglot.extend(translations)
      })
    }
    catch (error) {
      console.error(error)
    }
  },
}
