import { promises as fsp } from 'node:fs'
import { basename } from 'node:path'
import type { Context, ServiceSchema } from 'moleculer'
import Polyglot from 'node-polyglot'
import fg from 'fast-glob'

import type { I18nSettings, LanguageKey } from './type'

const MIXIN_NAME = 'I18nMixin'

const settings: I18nSettings<LanguageKey> = {
  i18n: {
    dirName: './test/mock/translations',
    languages: {
      EN: 'en',
      ES: 'es',
    },
    polyglot: new Polyglot(),
  },
}

type TranslationMethodContext = Context<any, { locale: string }>

export const I18nMixin: ServiceSchema<I18nSettings<LanguageKey>> = {
  name: MIXIN_NAME,
  settings,
  methods: {
    t(ctx: TranslationMethodContext, key: string, interpolation: number | Polyglot.InterpolationOptions) {
      const isLanguageAvailable = settings.i18n.languages[ctx.meta.locale as LanguageKey]

      // Set default language key
      if (!isLanguageAvailable)
        ctx.meta.locale = settings.i18n.languages.EN

      return settings.i18n.polyglot.t(`${ctx.meta.locale}.${key}`, interpolation)
    },
  },
  // TODO: how to handle promise errors?
  async started() {
    const translationFileSuffix = '.json'

    try {
      // TODO: do we need to sort files?
      const translationFiles = await fg(`${this.settings.i18n.dirName}/*${translationFileSuffix}`)

      const translations = await Promise.all(
        translationFiles.map(async (translation) => {
          const content = await fsp.readFile(translation, 'utf-8')
          const language = basename(translation, translationFileSuffix)

          return {
            [language]: JSON.parse(content),
          }
        }),
      )

      this.settings.i18n.polyglot.extend(translations)
    }
    catch (error) {
      // TODO: use moleculer logger
      console.error(error)
    }
  },
}
