import type Polyglot from 'node-polyglot'
import { type Context } from 'moleculer'

import type { I18nServiceSchema } from './types'
import { getPhrases } from './helpers/get-phrases'

export const I18nMixin: I18nServiceSchema = {
  name: 'I18nMixin',
  settings: {
    i18n: {
      availableLocales: [
        'en',
        'es',
      ],
      fallbackLocale: 'en',
      path: 'locales',
      polyglot: null,
    },
  },
  methods: {
    t(context: Context<unknown, { locale: string }>, key: string, interpolation: number | Polyglot.InterpolationOptions): string {
      const localeExists = this.settings?.i18n.availableLocales.includes(context.meta.locale)
      const locale = localeExists ? context.meta.locale : this.settings?.i18n.fallbackLocale

      return this.settings!.i18n.polyglot?.t(`${locale}.${key}`, interpolation) as string
    },
  },
  async started() {
    // TODO: check fallback language file exists somewhere
    const phrases = await getPhrases(this.settings.i18n.path)

    this.settings.i18n.polyglot?.extend(phrases)
  },
}
