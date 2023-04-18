import type { ServiceSchema } from 'moleculer'
import Polyglot from 'node-polyglot'

import { I18nMixin } from '~/index'
import type { I18nSettings } from '~/types'

export const mockI18NSchema: ServiceSchema = {
  name: 'greeter',
  mixins: [
    I18nMixin as unknown as Partial<ServiceSchema>,
  ],
  settings: {
    i18n: {
      availableLocales: [
        'en',
        'es',
      ],
      fallbackLocale: 'en',
      path: [
        'i18n',
        'locales',
      ],
      polyglot: new Polyglot(),
    },
  } satisfies I18nSettings,
  actions: {
    welcome: {
      handler(ctx) {
        // @ts-expect-error t function exists
        return this.t(ctx, 'greeter.welcome.message')
      },
    },
    farewell: {
      params: {
        name: 'string',
      },
      handler(ctx) {
        const { name } = ctx.params

        // @ts-expect-error t function exists
        return this.t(ctx, 'greeter.farewell', { name })
      },
    },
  },
}
