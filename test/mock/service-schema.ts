import type { ServiceSchema } from 'moleculer'

import { I18nMixin } from '../../src'

export const mockSchema: ServiceSchema = {
  name: 'greeter',
  mixins: [
    // TODO: check type here
    I18nMixin as unknown as Partial<ServiceSchema>,
  ],
  settings: {
    i18n: {
      dirName: './test/mock/translations',
    },
  },
  actions: {
    welcome: {
      handler(ctx) {
        ctx.meta.locale = 'es'

        // @ts-expect-error t function does not exists
        return this.t(ctx, 'greeter.welcome.message')
      },
    },
  },
}
